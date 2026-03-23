import Dexie, { Table } from 'dexie';
import type { NewsArticle } from '../types';

export interface DBArticle extends NewsArticle {
  savedAt: number;
}

export class ArticleDB extends Dexie {
  articles!: Table<DBArticle>;

  constructor() {
    super('iflandoor-db');
    this.version(1).stores({
      articles: 'id, source, category, savedAt, publishedAt, *tags'
    });
  }
}

export const db = new ArticleDB();

export async function saveArticles(articles: NewsArticle[]): Promise<void> {
  const now = Date.now();
  const dbArticles: DBArticle[] = articles.map(article => ({
    ...article,
    savedAt: now
  }));
  
  await db.articles.bulkPut(dbArticles);
}

export async function getArticles(filters?: {
  category?: string;
  tags?: string[];
  feedSource?: string;
  startDate?: Date;
  endDate?: Date;
  searchQuery?: string;
}): Promise<NewsArticle[]> {
  let collection = db.articles.toCollection();

  if (filters?.category) {
    collection = collection.filter(a => a.category === filters.category);
  }

  if (filters?.feedSource) {
    collection = collection.filter(a => a.source === filters.feedSource);
  }

  if (filters?.startDate) {
    const startMs = filters.startDate.getTime();
    collection = collection.filter(a => new Date(a.publishedAt).getTime() >= startMs);
  }

  if (filters?.endDate) {
    const endMs = filters.endDate.getTime();
    collection = collection.filter(a => new Date(a.publishedAt).getTime() <= endMs);
  }

  if (filters?.tags && filters.tags.length > 0) {
    collection = collection.filter(a => 
      filters.tags!.some(tag => a.tags.includes(tag))
    );
  }

  const results = await collection.toArray();

  if (filters?.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    return results.filter(a => 
      a.title.toLowerCase().includes(query) ||
      a.summary.toLowerCase().includes(query) ||
      a.source.toLowerCase().includes(query) ||
      a.tags.some(tag => tag.toLowerCase().includes(query)) ||
      a.category.toLowerCase().includes(query)
    );
  }

  return results.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getArticlesByDateRange(days: number = 7): Promise<NewsArticle[]> {
  const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
  const results = await db.articles
    .where('savedAt')
    .above(cutoff)
    .toArray();
  
  return results.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function cleanupOldArticles(daysToKeep: number = 7): Promise<number> {
  const cutoff = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
  const deleted = await db.articles
    .where('savedAt')
    .below(cutoff)
    .delete();
  
  return deleted;
}

export async function getArticleCount(): Promise<number> {
  return db.articles.count();
}

export async function clearAllArticles(): Promise<void> {
  await db.articles.clear();
}

export async function getUniqueFeedSources(): Promise<string[]> {
  const articles = await db.articles.toArray();
  const sources = [...new Set(articles.map(a => a.source))];
  return sources;
}

export async function getDateRange(): Promise<{ oldest: Date | null; newest: Date | null }> {
  const oldestArticle = await db.articles.orderBy('publishedAt').first();
  const newestArticle = await db.articles.orderBy('publishedAt').reverse().first();
  
  return {
    oldest: oldestArticle ? new Date(oldestArticle.publishedAt) : null,
    newest: newestArticle ? new Date(newestArticle.publishedAt) : null
  };
}

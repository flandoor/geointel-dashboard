import Dexie, { Table } from 'dexie';
import type { NewsArticle, ArticleStatus } from '../types';

export interface DBArticle extends NewsArticle {
  savedAt: number;
  status: ArticleStatus;
  archivedAt: number | null;
  readAt: number | null;
}

export class ArticleDB extends Dexie {
  articles!: Table<DBArticle>;

  constructor() {
    super('iflandoor-db');
    this.version(2).stores({
      articles: 'id, source, category, savedAt, publishedAt, status, archivedAt, readAt, *tags'
    });
  }
}

export const db = new ArticleDB();

export async function migrateArticles(): Promise<number> {
  const articlesWithoutStatus = await db.articles
    .filter(a => !a.status)
    .toArray();
  
  if (articlesWithoutStatus.length === 0) return 0;
  
  const now = Date.now();
  const ids = articlesWithoutStatus.map(a => a.id);
  await db.articles.where('id').anyOf(ids).modify({ 
    status: 'unread',
    savedAt: now,
    archivedAt: null,
    readAt: null
  });
  
  return articlesWithoutStatus.length;
}

export async function deduplicateArticles(): Promise<number> {
  const allArticles = await db.articles.toArray();
  const seenIds = new Set<string>();
  const duplicates: string[] = [];
  
  for (const article of allArticles) {
    if (seenIds.has(article.id)) {
      duplicates.push(article.id);
    } else {
      seenIds.add(article.id);
    }
  }
  
  if (duplicates.length === 0) return 0;
  
  await db.articles.where('id').anyOf(duplicates).delete();
  return duplicates.length;
}

export async function saveArticles(articles: NewsArticle[]): Promise<void> {
  const now = Date.now();
  const dbArticles: DBArticle[] = articles.map(article => ({
    ...article,
    savedAt: now,
    status: 'unread',
    archivedAt: null,
    readAt: null
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
  status?: ArticleStatus | 'all';
  excludeArchived?: boolean;
}): Promise<NewsArticle[]> {
  let collection = db.articles.toCollection();

  if (filters?.status && filters.status !== 'all') {
    collection = collection.filter(a => a.status === filters.status);
  }

  if (filters?.excludeArchived) {
    collection = collection.filter(a => a.status !== 'archived');
  }

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

export async function markArticleAsRead(id: string): Promise<void> {
  await db.articles.update(id, { 
    readAt: Date.now(),
    status: 'archived'
  });
}

export async function markArticlesAsRead(ids: string[]): Promise<void> {
  const now = Date.now();
  await db.articles.where('id').anyOf(ids).modify({ 
    readAt: now,
    status: 'archived',
    archivedAt: now
  });
}

export async function archiveReadArticles(): Promise<number> {
  const readArticles = await db.articles
    .where('readAt')
    .above(0)
    .filter(a => a.status === 'unread')
    .toArray();
  
  if (readArticles.length === 0) return 0;
  
  const now = Date.now();
  const ids = readArticles.map(a => a.id);
  await db.articles.where('id').anyOf(ids).modify({ 
    status: 'archived',
    archivedAt: now
  });
  
  return readArticles.length;
}

export async function archiveArticle(id: string): Promise<void> {
  await db.articles.update(id, { 
    status: 'archived',
    archivedAt: Date.now()
  });
}

export async function updateArticleStatus(id: string, status: ArticleStatus): Promise<void> {
  const updates: Partial<DBArticle> = { status };
  if (status === 'archived') {
    updates.archivedAt = Date.now();
  }
  if (status === 'bookmarked') {
    updates.archivedAt = null;
  }
  await db.articles.update(id, updates);
}

export async function cleanupOldArticles(daysToKeep: number = 7): Promise<number> {
  const cutoff = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
  
  const toDelete = await db.articles
    .filter(a => 
      a.status === 'archived' && 
      a.archivedAt !== null && 
      a.archivedAt < cutoff
    )
    .toArray();
  
  if (toDelete.length === 0) return 0;
  
  const ids = toDelete.map(a => a.id);
  await db.articles.where('id').anyOf(ids).delete();
  
  return toDelete.length;
}

export async function getArticleCount(): Promise<number> {
  return db.articles.count();
}

export async function getUnreadCount(): Promise<number> {
  return db.articles.where('status').equals('unread').count();
}

export async function getArchivedCount(): Promise<number> {
  return db.articles.where('status').equals('archived').count();
}

export async function clearAllArticles(): Promise<void> {
  await db.articles.clear();
}

export async function resetDatabase(): Promise<void> {
  await db.articles.clear();
  console.log('[DB] Database cleared');
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

import type { NewsArticle, FeedInfo } from '../types';

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

function getCategoryFromTitle(title: string, feedCategory: string): string {
  const lowerTitle = title.toLowerCase();
  
  const categoryKeywords: Record<string, string[]> = {
    military: ['military', 'defense', 'army', 'navy', 'air force', 'war', 'combat', 'troops', 'weapon', 'missile', 'soldier'],
    geopolitics: ['russia', 'china', 'taiwan', 'ukraine', 'nato', 'diplomacy', 'summit', 'treaty', 'border', 'conflict'],
    economy: ['economy', 'trade', 'sanction', 'inflation', 'gdp', 'market', 'oil', 'gas', 'energy', 'import', 'export'],
    technology: ['tech', 'ai', 'chip', 'semiconductor', 'cyber', 'hacker', 'software', 'digital'],
    security: ['cyber', 'attack', 'terror', 'intelligence', 'espionage', 'surveillance', 'security'],
    diplomacy: ['diplomat', 'embassy', 'un', 'meeting', 'negotiate', 'peace', 'summit'],
  };

  for (const [cat, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(k => lowerTitle.includes(k))) {
      return cat;
    }
  }
  
  return feedCategory || 'geopolitics';
}

function extractTags(title: string, summary: string): string[] {
  const text = `${title} ${summary}`.toLowerCase();
  const keywords: Record<string, string> = {
    'nato': 'nato', 'otan': 'nato',
    'russia': 'russia', 'rusia': 'russia',
    'ukraine': 'ukraine', 'ucrania': 'ukraine',
    'china': 'china', 'beijing': 'china',
    'taiwan': 'taiwan', 'taipei': 'taiwan',
    'usa': 'usa', 'united states': 'usa', 'washington': 'usa',
    'europe': 'europe', 'eu': 'eu', 'european union': 'eu',
    'middle east': 'middle-east', 'iran': 'middle-east', 'israel': 'middle-east',
    'asia': 'asia-pacific', 'pacific': 'asia-pacific', 'indo-pacific': 'asia-pacific',
    'arctic': 'arctic',
    'nuclear': 'nuclear', 'atom': 'nuclear',
    'cyber': 'cyber', 'hacking': 'cyber',
    'sanction': 'sanctions',
    'election': 'elections',
    'trade': 'trade',
  };

  const foundTags = new Set<string>();
  for (const [keyword, tag] of Object.entries(keywords)) {
    if (text.includes(keyword)) {
      foundTags.add(tag);
    }
  }

  return Array.from(foundTags).slice(0, 4);
}

function parseXmlDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
  } catch {}
  
  const rfc822 = dateStr.match(/(\d{1,2})\s+(\w{3})\s+(\d{4})\s+(\d{2}):(\d{2}):(\d{2})/);
  if (rfc822) {
    const months: Record<string, string> = {
      Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
      Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
    };
    const [, day, month, year, hour, min, sec] = rfc822;
    return `${year}-${months[month]}-${day.padStart(2, '0')}T${hour}:${min}:${sec}Z`;
  }
  
  return new Date().toISOString();
}

function getTextContent(element: Element | null, tag: string): string {
  if (!element) return '';
  const el = element.getElementsByTagName(tag)[0];
  return el?.textContent?.trim() || '';
}

export async function fetchRSSFeed(feed: FeedInfo): Promise<NewsArticle[]> {
  if (!feed.enabled) {
    console.log(`[RSS] Feed "${feed.name}" is disabled, skipping`);
    return [];
  }
  
  console.log(`[RSS] Fetching feed: ${feed.name} (${feed.url})`);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.log(`[RSS] Timeout fetching ${feed.name}`);
    }, 15000);
    
    const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(feed.url)}`, {
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error(`[RSS] Failed to fetch ${feed.name}: ${response.status} ${response.statusText}`);
      return [];
    }

    const text = await response.text();
    
    if (!text || text.trim().length === 0) {
      console.error(`[RSS] Empty response from ${feed.name}`);
      return [];
    }
    
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml');
    
    const parseError = xml.querySelector('parsererror');
    if (parseError) {
      console.error(`[RSS] XML parse error for ${feed.name}:`, parseError.textContent);
      return [];
    }
    
    const items = xml.querySelectorAll('item, entry');
    console.log(`[RSS] Found ${items.length} items in ${feed.name}`);
    
    const articles: NewsArticle[] = [];

    items.forEach((item, index) => {
      if (index >= 10) return;
      
      const title = getTextContent(item, 'title') || item.getAttribute('title') || '';
      const link = getTextContent(item, 'link') || item.getElementsByTagName('link')[0]?.textContent || '';
      const description = getTextContent(item, 'description') || getTextContent(item, 'summary') || getTextContent(item, 'content') || '';
      const pubDate = getTextContent(item, 'pubDate') || getTextContent(item, 'published') || getTextContent(item, 'updated') || '';
      
      if (!title) return;

      const summary = description
        .replace(/<[^>]*>/g, '')
        .replace(/&[a-z]+;/gi, ' ')
        .substring(0, 300);

      const category = getCategoryFromTitle(title, feed.category);
      const tags = extractTags(title, summary);

      articles.push({
        id: generateId(),
        title: title.substring(0, 200),
        summary: summary || 'No summary available',
        source: feed.name,
        category,
        tags,
        publishedAt: parseXmlDate(pubDate),
        link: link.trim(),
        readTime: Math.max(1, Math.ceil((title.length + summary.length) / 1000)),
      });
    });

    return articles;
  } catch (error) {
    console.error(`Error fetching ${feed.name}:`, error);
    return [];
  }
}

export async function fetchAllFeeds(feeds: FeedInfo[]): Promise<NewsArticle[]> {
  const enabledFeeds = feeds.filter(f => f.enabled);
  const allArticles: NewsArticle[] = [];
  
  const promises = enabledFeeds.map(feed => fetchRSSFeed(feed));
  const results = await Promise.allSettled(promises);
  
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      allArticles.push(...result.value);
    }
  });

  allArticles.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return allArticles;
}
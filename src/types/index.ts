export type ArticleStatus = 'unread' | 'archived' | 'bookmarked';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content?: string;
  source: string;
  category: string;
  tags: string[];
  publishedAt: string;
  isBreaking?: boolean;
  readTime?: number;
  link?: string;
  status?: ArticleStatus;
  archivedAt?: number | null;
  readAt?: number | null;
}

export interface CategoryInfo {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface TagInfo {
  id: string;
  name: string;
  count?: number;
}

export interface FeedInfo {
  id: string;
  name: string;
  url: string;
  category: string;
  enabled: boolean;
  lastFetched?: string;
}

export interface AppData {
  categories: CategoryInfo[];
  tags: TagInfo[];
  feeds: FeedInfo[];
  bookmarkedArticleIds: string[];
}

export const defaultCategories: CategoryInfo[] = [
  { id: 'geopolitics', name: 'Geopolítica', icon: 'globe', color: 'blue' },
  { id: 'military', name: 'Militar', icon: 'shield', color: 'red' },
  { id: 'economy', name: 'Economía', icon: 'chart', color: 'amber' },
  { id: 'technology', name: 'Tecnología', icon: 'cpu', color: 'cyan' },
  { id: 'diplomacy', name: 'Diplomacia', icon: 'handshake', color: 'violet' },
  { id: 'security', name: 'Seguridad', icon: 'lock', color: 'green' },
];

export const defaultTags: TagInfo[] = [
  { id: 'nato', name: 'OTAN' },
  { id: 'china', name: 'China' },
  { id: 'taiwan', name: 'Taiwán' },
  { id: 'russia', name: 'Rusia' },
  { id: 'ukraine', name: 'Ucranía' },
  { id: 'usa', name: 'EE.UU.' },
  { id: 'eu', name: 'UE' },
  { id: 'europe', name: 'Europa' },
  { id: 'middle-east', name: 'Medio Oriente' },
  { id: 'asia-pacific', name: 'Asia-Pacífico' },
  { id: 'arctic', name: 'Ártico' },
  { id: 'nuclear', name: 'Nuclear' },
  { id: 'cyber', name: 'Ciberseguridad' },
  { id: 'sanctions', name: 'Sanciones' },
  { id: 'elections', name: 'Elecciones' },
  { id: 'trade', name: 'Comercio' },
];

export const defaultFeeds: FeedInfo[] = [
  { id: '1', name: 'Reuters World News', url: 'https://www.reutersagency.com/feed/?best-regions=europe&post_type=best', category: 'geopolitics', enabled: true },
  { id: '2', name: 'BBC World', url: 'http://feeds.bbci.co.uk/news/world/rss.xml', category: 'geopolitics', enabled: true },
  { id: '3', name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml', category: 'geopolitics', enabled: true },
  { id: '4', name: 'Defense News', url: 'https://www.defensenews.com/feed/rss/', category: 'military', enabled: true },
];

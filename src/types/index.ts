export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: Category;
  tags: Tag[];
  publishedAt: string;
  isBreaking?: boolean;
  readTime?: number;
  url?: string;
}

export type Category = 
  | 'geopolitics' 
  | 'military' 
  | 'economy' 
  | 'technology' 
  | 'diplomacy'
  | 'security';

export type Tag = 
  | 'nato'
  | 'china'
  | 'taiwan'
  | 'russia'
  | 'ukraine'
  | 'usa'
  | 'eu'
  | 'europe'
  | 'middle-east'
  | 'asia-pacific'
  | 'arctic'
  | 'nuclear'
  | 'cyber'
  | 'sanctions'
  | 'elections'
  | 'trade';

export interface Feed {
  id: string;
  name: string;
  url: string;
  category: Category;
  lastUpdated: string;
}

export interface CategoryInfo {
  id: Category;
  name: string;
  icon: string;
  color: string;
}

export interface TagInfo {
  id: Tag;
  name: string;
  count: number;
}

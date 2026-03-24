import { useState } from 'react';
import type { CategoryInfo, TagInfo, FeedInfo, ArticleStatus } from '../types';
import './Sidebar.css';

interface SidebarProps {
  categories: CategoryInfo[];
  tags: TagInfo[];
  feeds: FeedInfo[];
  selectedCategory: string | null;
  selectedTags: string[];
  selectedFeed: string | null;
  selectedBookmarks: boolean;
  bookmarkCount: number;
  archivedCount: number;
  selectedStatusFilter: ArticleStatus | 'all';
  onCategoryChange: (category: string | null) => void;
  onTagToggle: (tag: string) => void;
  onFeedSelect: (feedId: string | null) => void;
  onBookmarksToggle: () => void;
  onStatusFilterChange: (status: ArticleStatus | 'all') => void;
  articleCount?: number;
}

export default function Sidebar({
  categories,
  tags,
  feeds,
  selectedCategory,
  selectedTags,
  selectedFeed,
  selectedBookmarks,
  bookmarkCount,
  archivedCount,
  selectedStatusFilter,
  onCategoryChange,
  onTagToggle,
  onFeedSelect,
  onBookmarksToggle,
  onStatusFilterChange,
  articleCount = 0,
}: SidebarProps) {
  const [isRSSExpanded, setIsRSSExpanded] = useState(false);
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);
  const [isTagsExpanded, setIsTagsExpanded] = useState(false);

  const iconMap: Record<string, JSX.Element> = {
    globe: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>,
    shield: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    chart: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18" /><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" /></svg>,
    cpu: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" /></svg>,
    handshake: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" /></svg>,
    lock: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
  };

  const getIcon = (iconId: string) => iconMap[iconId] || iconMap.globe;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="35" stroke="var(--accent-blue)" strokeWidth="3" />
            <circle cx="50" cy="50" r="25" stroke="var(--accent-red)" strokeWidth="2" />
            <circle cx="50" cy="50" r="5" fill="var(--text-primary)" />
          </svg>
        </div>
        <div className="logo-text">
          <span className="logo-title">iFlandöör</span>
          <span className="logo-subtitle">News Dashboard</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <button
            className={`bookmarks-item ${selectedBookmarks ? 'active' : ''}`}
            onClick={onBookmarksToggle}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={selectedBookmarks ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <span>Bookmarks</span>
            {bookmarkCount > 0 && (
              <span className="bookmarks-count">{bookmarkCount}</span>
            )}
          </button>

          <button
            className={`archived-item ${selectedStatusFilter === 'archived' ? 'active' : ''}`}
            onClick={() => onStatusFilterChange(selectedStatusFilter === 'archived' ? 'unread' : 'archived')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="21 8 21 21 3 21 3 8" />
              <rect x="1" y="3" width="22" height="5" />
              <line x1="10" y1="12" x2="14" y2="12" />
            </svg>
            <span>Archived</span>
            {archivedCount > 0 && (
              <span className="archived-count">{archivedCount}</span>
            )}
          </button>
        </div>

        <div className="nav-section">
          <button
            className="category-header"
            onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
          >
            <h3 className="nav-section-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              Categories
            </h3>
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              className={`chevron ${isCategoriesExpanded ? 'expanded' : ''}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          
          {isCategoriesExpanded && (
            <ul className="category-list">
              <li>
                <button
                  className={`category-item ${selectedCategory === null ? 'active' : ''}`}
                  onClick={() => onCategoryChange(null)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                  <span>All News</span>
                  <span className="category-count">{articleCount}</span>
                </button>
              </li>
              {categories.map((cat: CategoryInfo) => (
                <li key={cat.id}>
                  <button
                    className={`category-item ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => onCategoryChange(cat.id)}
                    data-color={cat.color}
                  >
                    {getIcon(cat.icon)}
                    <span>{cat.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="nav-section">
          <button 
            className="rss-header"
            onClick={() => setIsRSSExpanded(!isRSSExpanded)}
          >
            <h3 className="nav-section-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.18 15.64a2.18 2.18 0 1 1 0 4.36 2.18 2.18 0 0 1 0-4.36m0-6.18a8.18 8.18 0 0 1 8.18 8.18m-8.18-12.18a12.18 12.18 0 1 0 12.18 12.18"/>
              </svg>
              RSS Feeds
            </h3>
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              className={`chevron ${isRSSExpanded ? 'expanded' : ''}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          
          {isRSSExpanded && (
            <div className="rss-list">
              <button
                className={`rss-item ${selectedFeed === null ? 'active' : ''}`}
                onClick={() => onFeedSelect(null)}
              >
                <span className="rss-dot" style={{ background: 'var(--text-muted)' }} />
                <span>All Feeds</span>
              </button>
              {feeds.filter(f => f.enabled).map((feed: FeedInfo) => (
                <button
                  key={feed.id}
                  className={`rss-item ${selectedFeed === feed.id ? 'active' : ''}`}
                  onClick={() => onFeedSelect(feed.id)}
                >
                  <span className="rss-dot" style={{ background: 'var(--accent-blue)' }} />
                  <span>{feed.name}</span>
                </button>
              ))}
              {feeds.filter(f => f.enabled).length === 0 && (
                <div className="rss-item">
                  <span className="rss-dot" style={{ background: 'var(--text-muted)' }} />
                  <span>No feeds enabled</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="nav-section">
          <button 
            className="rss-header"
            onClick={() => setIsTagsExpanded(!isTagsExpanded)}
          >
            <h3 className="nav-section-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
              Tags
            </h3>
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              className={`chevron ${isTagsExpanded ? 'expanded' : ''}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          
          {isTagsExpanded && (
            <div className="tag-cloud">
              {tags.map((tag: TagInfo) => (
                <button
                  key={tag.id}
                  className={`tag ${selectedTags.includes(tag.id) ? 'tag-active' : ''}`}
                  onClick={() => onTagToggle(tag.id)}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}

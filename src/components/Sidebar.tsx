import { useState } from 'react';
import type { CategoryInfo, TagInfo, FeedInfo } from '../types';
import './Sidebar.css';

interface SidebarProps {
  categories: CategoryInfo[];
  tags: TagInfo[];
  feeds: FeedInfo[];
  selectedCategory: string | null;
  selectedTags: string[];
  onCategoryChange: (category: string | null) => void;
  onTagToggle: (tag: string) => void;
  lastSync: string;
}

export default function Sidebar({
  categories,
  tags,
  feeds,
  selectedCategory,
  selectedTags,
  onCategoryChange,
  onTagToggle,
  lastSync,
}: SidebarProps) {
  const [isRSSExpanded, setIsRSSExpanded] = useState(false);

  const categoryIcons: Record<string, JSX.Element> = {
    geopolitics: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    military: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    economy: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 3v18h18" />
        <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
      </svg>
    ),
    technology: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
      </svg>
    ),
    diplomacy: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <path d="M6 1v3M10 1v3M14 1v3" />
      </svg>
    ),
    security: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  };

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
          <span className="logo-title">GEOINTEL</span>
          <span className="logo-subtitle">Intelligence Dashboard</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3 className="nav-section-title">Categories</h3>
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
                <span className="category-count">12</span>
              </button>
            </li>
            {categories.map((cat: CategoryInfo) => (
              <li key={cat.id}>
                <button
                  className={`category-item ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => onCategoryChange(cat.id)}
                  data-color={cat.color}
                >
                  {categoryIcons[cat.id]}
                  <span>{cat.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="nav-section">
          <h3 className="nav-section-title">
            <span>Tags</span>
            <span className="tag-count">{tags.length}</span>
          </h3>
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
              {feeds.filter(f => f.enabled).map((feed: FeedInfo) => (
                <div key={feed.id} className="rss-item">
                  <span className="rss-dot" style={{ background: 'var(--accent-blue)' }} />
                  <span>{feed.name}</span>
                </div>
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
      </nav>

      <div className="sidebar-footer">
        <div className="status">
          <span className="status-dot" />
          <span>System Online</span>
        </div>
        <p className="timestamp">Last sync: {lastSync}</p>
      </div>
    </aside>
  );
}

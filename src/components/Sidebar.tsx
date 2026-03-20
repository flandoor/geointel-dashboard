import { useState } from 'react';
import type { CategoryInfo, TagInfo, FeedInfo } from '../types';
import './Sidebar.css';

interface SidebarProps {
  categories: CategoryInfo[];
  tags: TagInfo[];
  feeds: FeedInfo[];
  selectedCategory: string | null;
  selectedTags: string[];
  selectedFeed: string | null;
  onCategoryChange: (category: string | null) => void;
  onTagToggle: (tag: string) => void;
  onFeedSelect: (feedId: string | null) => void;
}

export default function Sidebar({
  categories,
  tags,
  feeds,
  selectedCategory,
  selectedTags,
  selectedFeed,
  onCategoryChange,
  onTagToggle,
  onFeedSelect,
}: SidebarProps) {
  const [isRSSExpanded, setIsRSSExpanded] = useState(false);

  const iconMap: Record<string, JSX.Element> = {
    globe: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>,
    shield: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    chart: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18" /><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" /></svg>,
    cpu: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" /></svg>,
    handshake: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" /></svg>,
    lock: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
    rocket: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>,
    flame: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></svg>,
    bank: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" /></svg>,
    plane: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19 4s-2 1-3 2L12 9l-7-2-6 6 4 4-4 8 8-8 2-2-3.5 3.5 2 8.2c.6 1.4 1.8 2.8 3 2.8s2.4-1.4 3-2.8z" /></svg>,
    satellite: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 7L9 3 5 7l4 4m-7 10l4 4-4 4 4 4m-7-10l4-4 4 4 4-4-4-4m-4 4l4 4" /></svg>,
    bell: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
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
                  {getIcon(cat.icon)}
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
      </nav>
    </aside>
  );
}

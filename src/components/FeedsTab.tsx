import { useState } from 'react';
import type { CategoryInfo, FeedInfo } from '../types';

const ICONS = [
  { id: 'globe', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg> },
  { id: 'shield', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg> },
  { id: 'chart', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18" /><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" /></svg> },
  { id: 'cpu', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" /></svg> },
  { id: 'handshake', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" /></svg> },
  { id: 'lock', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg> },
  { id: 'rocket', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /></svg> },
  { id: 'flame', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></svg> },
  { id: 'bank', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" /></svg> },
  { id: 'plane', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19 4s-2 1-3 2L12 9l-7-2-6 6 4 4-4 8 8-8 2-2-3.5 3.5 2 8.2c.6 1.4 1.8 2.8 3 2.8s2.4-1.4 3-2.8z" /></svg> },
  { id: 'satellite', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 7L9 3 5 7l4 4m-7 10l4 4-4 4 4 4m-4-10l4-4 4 4 4-4-4-4m-4 4l4 4" /></svg> },
  { id: 'bell', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg> },
];

interface FeedsTabProps {
  feeds: FeedInfo[];
  categories: CategoryInfo[];
  onToggleFeedEnabled: (id: string) => void;
  onDeleteFeed: (id: string) => void;
  onUpdateFeed: (id: string, updates: Partial<FeedInfo>) => void;
  onAddFeed: (feed: FeedInfo) => void;
}

export default function FeedsTab({ feeds, categories, onToggleFeedEnabled, onDeleteFeed, onUpdateFeed, onAddFeed }: FeedsTabProps) {
  const [newFeed, setNewFeed] = useState({ name: '', url: '', categories: ['geopolitics'] as string[] });

  const toggleFeedCategory = (feedId: string, categoryId: string) => {
    const feed = feeds.find(f => f.id === feedId);
    if (!feed) return;
    const hasCategory = feed.categories.includes(categoryId);
    const newCategories = hasCategory
      ? feed.categories.filter(c => c !== categoryId)
      : [...feed.categories, categoryId];
    if (newCategories.length > 0) {
      onUpdateFeed(feedId, { categories: newCategories });
    }
  };

  const toggleNewFeedCategory = (categoryId: string) => {
    const hasCategory = newFeed.categories.includes(categoryId);
    if (hasCategory) {
      if (newFeed.categories.length > 1) {
        setNewFeed({ ...newFeed, categories: newFeed.categories.filter(c => c !== categoryId) });
      }
    } else {
      setNewFeed({ ...newFeed, categories: [...newFeed.categories, categoryId] });
    }
  };

  const handleAddFeed = () => {
    if (newFeed.name && newFeed.url) {
      onAddFeed({
        id: Date.now().toString(),
        name: newFeed.name,
        url: newFeed.url,
        categories: newFeed.categories,
        enabled: true,
      });
      setNewFeed({ name: '', url: '', categories: ['geopolitics'] });
    }
  };

  const getCategoryColor = (catId: string) => {
    const cat = categories.find(c => c.id === catId);
    return cat?.color || 'blue';
  };

  return (
    <div className="settings-section">
      <h3>RSS Feeds</h3>
      <div className="edit-list">
        {feeds.map((feed) => (
          <div key={feed.id} className="edit-item feed-edit-item">
            <div className="feed-edit-main">
              <div className="edit-item-info">
                <span className="edit-item-name">{feed.name}</span>
                <div className="feed-categories">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      className={`feed-cat-btn ${feed.categories.includes(cat.id) ? 'active' : ''}`}
                      onClick={() => toggleFeedCategory(feed.id, cat.id)}
                      style={{
                        backgroundColor: feed.categories.includes(cat.id) ? 'var(--accent-blue-glow)' : undefined,
                        borderColor: feed.categories.includes(cat.id) ? 'var(--accent-blue)' : undefined,
                        color: feed.categories.includes(cat.id) ? 'var(--accent-blue)' : undefined,
                      }}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="edit-actions">
                <label className="mini-toggle">
                  <input
                    type="checkbox"
                    checked={feed.enabled}
                    onChange={() => onToggleFeedEnabled(feed.id)}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <button 
                  className="edit-delete"
                  onClick={() => onDeleteFeed(feed.id)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="add-form">
        <input
          type="text"
          placeholder="Feed Name"
          value={newFeed.name}
          onChange={(e) => setNewFeed({ ...newFeed, name: e.target.value })}
          className="settings-input"
        />
        <input
          type="text"
          placeholder="RSS URL"
          value={newFeed.url}
          onChange={(e) => setNewFeed({ ...newFeed, url: e.target.value })}
          className="settings-input"
        />
        <div className="feed-categories-input">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat.id}
              className={`feed-cat-btn ${newFeed.categories.includes(cat.id) ? 'active' : ''}`}
              onClick={() => toggleNewFeedCategory(cat.id)}
              style={{
                backgroundColor: newFeed.categories.includes(cat.id) ? 'var(--accent-blue-glow)' : undefined,
                borderColor: newFeed.categories.includes(cat.id) ? 'var(--accent-blue)' : undefined,
                color: newFeed.categories.includes(cat.id) ? 'var(--accent-blue)' : undefined,
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <button className="add-btn" onClick={handleAddFeed}>Add</button>
      </div>
    </div>
  );
}

export { ICONS };

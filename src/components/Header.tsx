import { useState, useEffect } from 'react';
import type { CategoryInfo, TagInfo, FeedInfo, ArticleStatus } from '../types';
import './Header.css';

interface HeaderProps {
  onSettingsClick: () => void;
  isLoading?: boolean;
  onRefresh?: () => void;
  feedCount?: number;
  unreadCount?: number;
  archivedCount?: number;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  categories: CategoryInfo[];
  feeds: FeedInfo[];
  tags: TagInfo[];
  selectedCategory: string | null;
  selectedTags: string[];
  selectedFeed: string | null;
  dateRange: { start: Date | null; end: Date | null };
  statusFilter: ArticleStatus | 'all';
  onStatusFilterChange: (status: ArticleStatus | 'all') => void;
  onCategoryChange: (category: string | null) => void;
  onTagToggle: (tag: string) => void;
  onFeedSelect: (feedId: string | null) => void;
  onDateRangeChange: (range: { start: Date | null; end: Date | null }) => void;
  onClearAllFilters?: () => void;
  activeFilterCount: number;
}

export default function Header({ 
  onSettingsClick, 
  isLoading, 
  onRefresh, 
  feedCount, 
  unreadCount = 0, 
  archivedCount = 0,
  searchQuery = '', 
  onSearchChange, 
  viewMode = 'grid', 
  onViewModeChange,
  categories,
  feeds,
  tags,
  selectedCategory,
  selectedTags,
  selectedFeed,
  dateRange,
  statusFilter,
  onStatusFilterChange,
  onCategoryChange,
  onTagToggle,
  onFeedSelect,
  onDateRangeChange,
  onClearAllFilters,
  activeFilterCount
}: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (date: Date) => {
    const offset = -date.getTimezoneOffset() / 60;
    const sign = offset >= 0 ? '+' : '';
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false,
    }) + ` UTC${sign}${offset}`;
  };

  const hasActiveFilters = selectedCategory || selectedTags.length > 0 || selectedFeed || dateRange.start || dateRange.end;

  return (
    <header className="header">
      <div className="header-left">
        <div className="date-time">
          <span className="date">{formatDate(currentTime)}</span>
          <span className="time">{formatTime(currentTime)}</span>
        </div>
        
        <div className={`search-wrapper ${searchFocused ? 'focused' : ''}`}>
          <svg 
            className="search-icon" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search intelligence..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {searchQuery && (
            <button 
              className="search-clear"
              onClick={() => onSearchChange?.('')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
          <button 
            className={`filter-toggle ${hasActiveFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
            title="Advanced filters"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            {activeFilterCount > 0 && (
              <span className="filter-count">{activeFilterCount}</span>
            )}
          </button>
        </div>
      </div>

      <div className="header-center">
        <div className="live-indicator">
          <span className={`live-dot ${isLoading ? 'loading' : ''}`} />
          <span className="live-text">LIVE</span>
        </div>
        <h1 className="header-title">News Feed</h1>
      </div>

      <div className="header-right">
        <button 
          className={`refresh-button ${isLoading ? 'loading' : ''}`} 
          onClick={onRefresh}
          title="Refresh feeds"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 4v6h-6M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
        </button>
        
        <div className="stats">
          <div className="stat-item">
            <span className="stat-value">{unreadCount}</span>
            <span className="stat-label">Unread</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value">{archivedCount}</span>
            <span className="stat-label">Archived</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value">{feedCount ?? 0}</span>
            <span className="stat-label">Sources</span>
          </div>
        </div>

        <div className="view-toggle">
          <button 
            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => onViewModeChange?.('grid')}
            title="Grid view"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </button>
          <button 
            className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => onViewModeChange?.('list')}
            title="List view"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>
        </div>

        <button className="settings-button" onClick={onSettingsClick}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>

      {showFilters && (
        <div className="filter-panel">
          <div className="filter-section">
            <label>Status</label>
            <select 
              value={statusFilter} 
              onChange={(e) => onStatusFilterChange(e.target.value as ArticleStatus | 'all')}
            >
              <option value="unread">Unread</option>
              <option value="archived">Archived</option>
              <option value="bookmarked">Bookmarked</option>
              <option value="all">All Articles</option>
            </select>
          </div>

          <div className="filter-section">
            <label>Category</label>
            <select 
              value={selectedCategory || ''} 
              onChange={(e) => onCategoryChange(e.target.value || null)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-section">
            <label>Feed Source</label>
            <select 
              value={selectedFeed || ''} 
              onChange={(e) => onFeedSelect(e.target.value || null)}
            >
              <option value="">All Feeds</option>
              {feeds.filter(f => f.enabled).map(feed => (
                <option key={feed.id} value={feed.id}>{feed.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-section">
            <label>Date Range</label>
            <div className="date-range-inputs">
              <input
                type="date"
                value={dateRange.start ? dateRange.start.toISOString().split('T')[0] : ''}
                onChange={(e) => onDateRangeChange({ 
                  start: e.target.value ? new Date(e.target.value) : null, 
                  end: dateRange.end 
                })}
                placeholder="From"
              />
              <span>to</span>
              <input
                type="date"
                value={dateRange.end ? dateRange.end.toISOString().split('T')[0] : ''}
                onChange={(e) => onDateRangeChange({ 
                  start: dateRange.start, 
                  end: e.target.value ? new Date(e.target.value) : null 
                })}
                placeholder="To"
              />
            </div>
          </div>

          <div className="filter-section">
            <label>Tags</label>
            <div className="dropdown-wrapper">
              <button 
                className={`dropdown-trigger ${selectedTags.length > 0 ? 'has-selection' : ''}`}
                onClick={() => {
                  const wrapper = document.querySelector('.tags-dropdown');
                  wrapper?.classList.toggle('open');
                }}
              >
                <span>{selectedTags.length > 0 ? `${selectedTags.length} selected` : 'Select tags'}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div className="tags-dropdown dropdown-menu">
                {tags.map(tag => (
                  <label key={tag.id} className="dropdown-item">
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag.id)}
                      onChange={() => onTagToggle(tag.id)}
                    />
                    <span>{tag.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <button className="clear-all-filters" onClick={onClearAllFilters}>
              Clear all filters
            </button>
          )}
        </div>
      )}
    </header>
  );
}

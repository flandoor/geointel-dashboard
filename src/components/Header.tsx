import { useState, useEffect } from 'react';
import './Header.css';

interface HeaderProps {
  activeFilters: number;
  onClearFilters: () => void;
  onSettingsClick: () => void;
  isLoading?: boolean;
  onRefresh?: () => void;
  feedCount?: number;
  articleCount?: number;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export default function Header({ activeFilters, onClearFilters, onSettingsClick, isLoading, onRefresh, feedCount, articleCount, searchQuery = '', onSearchChange }: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

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
        {activeFilters > 0 && (
          <button className="clear-button" onClick={onClearFilters}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
            Clear filters ({activeFilters})
          </button>
        )}

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
            <span className="stat-value">{feedCount ?? 0}</span>
            <span className="stat-label">Sources</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value">{articleCount ?? 0}</span>
            <span className="stat-label">Articles</span>
          </div>
        </div>

        <button className="settings-button" onClick={onSettingsClick}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>
    </header>
  );
}

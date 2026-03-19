'use client';

import { useState } from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  activeFilters: number;
  onClearFilters: () => void;
  onSettingsClick: () => void;
}

export default function Header({ activeFilters, onClearFilters, onSettingsClick }: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.dateTime}>
          <span className={styles.date}>March 19, 2026</span>
          <span className={styles.time}>14:32 UTC</span>
        </div>
        
        <div className={`${styles.searchWrapper} ${searchFocused ? styles.focused : ''}`}>
          <svg 
            className={styles.searchIcon} 
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
            className={styles.searchInput}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <kbd className={styles.searchHint}>⌘K</kbd>
        </div>
      </div>

      <div className={styles.center}>
        <div className={styles.liveIndicator}>
          <span className={styles.liveDot} />
          <span className={styles.liveText}>LIVE</span>
        </div>
        <h1 className={styles.title}>Intelligence Feed</h1>
      </div>

      <div className={styles.right}>
        {activeFilters > 0 && (
          <button className={styles.clearButton} onClick={onClearFilters}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
            Clear filters ({activeFilters})
          </button>
        )}
        
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>47</span>
            <span className={styles.statLabel}>Sources</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.statItem}>
            <span className={styles.statValue}>1.2k</span>
            <span className={styles.statLabel}>Articles</span>
          </div>
        </div>

        <button className={styles.settingsButton} onClick={onSettingsClick}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>
    </header>
  );
}

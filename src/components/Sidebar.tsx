'use client';

import { useState } from 'react';
import { categories, tags } from '@/data/news';
import { Category, Tag } from '@/types';
import styles from './Sidebar.module.css';

interface SidebarProps {
  selectedCategory: Category | null;
  selectedTags: Tag[];
  onCategoryChange: (category: Category | null) => void;
  onTagToggle: (tag: Tag) => void;
}

export default function Sidebar({
  selectedCategory,
  selectedTags,
  onCategoryChange,
  onTagToggle,
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
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="35" stroke="var(--accent-blue)" strokeWidth="3" />
            <circle cx="50" cy="50" r="25" stroke="var(--accent-red)" strokeWidth="2" />
            <circle cx="50" cy="50" r="5" fill="var(--text-primary)" />
          </svg>
        </div>
        <div className={styles.logoText}>
          <span className={styles.logoTitle}>GEOINTEL</span>
          <span className={styles.logoSubtitle}>Intelligence Dashboard</span>
        </div>
      </div>

      <nav className={styles.nav}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Categories</h3>
          <ul className={styles.categoryList}>
            <li>
              <button
                className={`${styles.categoryItem} ${selectedCategory === null ? styles.active : ''}`}
                onClick={() => onCategoryChange(null)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                <span>All News</span>
                <span className={styles.count}>12</span>
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  className={`${styles.categoryItem} ${selectedCategory === cat.id ? styles.active : ''}`}
                  onClick={() => onCategoryChange(cat.id)}
                  data-color={cat.color}
                >
                  {categoryIcons[cat.id]}
                  <span>{cat.name}</span>
                  <span className={styles.count}>
                    {cat.id === 'geopolitics' ? 4 : 
                     cat.id === 'military' ? 4 : 
                     cat.id === 'economy' ? 2 : 2}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <span>Tags</span>
            <span className={styles.tagCount}>{tags.length}</span>
          </h3>
          <div className={styles.tagCloud}>
            {tags.map((tag) => (
              <button
                key={tag.id}
                className={`${styles.tag} ${selectedTags.includes(tag.id) ? styles.tagActive : ''}`}
                onClick={() => onTagToggle(tag.id)}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <button 
            className={styles.rssHeader}
            onClick={() => setIsRSSExpanded(!isRSSExpanded)}
          >
            <h3 className={styles.sectionTitle}>
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
              className={`${styles.chevron} ${isRSSExpanded ? styles.expanded : ''}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          
          {isRSSExpanded && (
            <div className={styles.rssList}>
              <div className={styles.rssItem}>
                <span className={styles.rssDot} style={{ background: 'var(--accent-blue)' }} />
                <span>Reuters World</span>
              </div>
              <div className={styles.rssItem}>
                <span className={styles.rssDot} style={{ background: 'var(--accent-red)' }} />
                <span>Defense News</span>
              </div>
              <div className={styles.rssItem}>
                <span className={styles.rssDot} style={{ background: 'var(--accent-amber)' }} />
                <span>Bloomberg</span>
              </div>
              <div className={styles.rssItem}>
                <span className={styles.rssDot} style={{ background: 'var(--accent-green)' }} />
                <span>Stratfor</span>
              </div>
              <div className={styles.rssItem}>
                <span className={styles.rssDot} style={{ background: '#8b5cf6' }} />
                <span>FT News</span>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className={styles.footer}>
        <div className={styles.status}>
          <span className={styles.statusDot} />
          <span>System Online</span>
        </div>
        <p className={styles.timestamp}>Last sync: 3 min ago</p>
      </div>
    </aside>
  );
}

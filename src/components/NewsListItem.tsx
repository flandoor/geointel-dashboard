import type { NewsArticle } from '../types';
import { formatDate } from '../data/news';
import './NewsListItem.css';

interface NewsListItemProps {
  article: NewsArticle;
  isSelected: boolean;
  onClick: (article: NewsArticle) => void;
  isBookmarked?: boolean;
  onBookmarkToggle?: (articleId: string) => void;
}

export default function NewsListItem({ article, isSelected, onClick, isBookmarked = false, onBookmarkToggle }: NewsListItemProps) {
  const categoryColors: Record<string, string> = {
    geopolitics: 'var(--accent-blue)',
    military: 'var(--accent-red)',
    economy: 'var(--accent-amber)',
    technology: '#06b6d4',
    diplomacy: '#8b5cf6',
    security: 'var(--accent-green)',
  };

  const categoryColor = categoryColors[article.category] || 'var(--text-secondary)';

  return (
    <article 
      className={`news-list-item ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(article)}
    >
      <div className="list-item-accent" style={{ background: categoryColor }} />
      
      <div className="list-item-content">
        <div className="list-item-header">
          <div className="list-item-meta">
            <span className="list-item-source">{article.source}</span>
            <span className="list-item-dot">·</span>
            <span className="list-item-time">{formatDate(article.publishedAt)}</span>
          </div>
          <div className="list-item-header-actions">
            {article.isBreaking && (
              <span className="list-item-breaking">
                <span className="breaking-dot" />
                LIVE
              </span>
            )}
            <button 
              className={`list-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
              onClick={(e) => { e.stopPropagation(); onBookmarkToggle?.(article.id); }}
              title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          </div>
        </div>

        <h3 className="list-item-title">{article.title}</h3>

        <div className="list-item-footer">
          <span className="list-item-category" style={{ color: categoryColor }}>
            {article.category}
          </span>
          {article.readTime && (
            <span className="list-item-readtime">{article.readTime} min</span>
          )}
        </div>
      </div>
    </article>
  );
}

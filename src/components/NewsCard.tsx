import type { NewsArticle } from '../types';
import { formatDate } from '../data/news';
import './NewsCard.css';

interface NewsCardProps {
  article: NewsArticle;
  variant?: 'default' | 'featured';
  index?: number;
  onClick?: (article: NewsArticle) => void;
  isBookmarked?: boolean;
  onBookmarkToggle?: (articleId: string) => void;
  onArchive?: (articleId: string) => void;
  isRead?: boolean;
}

export default function NewsCard({ article, variant = 'default', index = 0, onClick, isBookmarked = false, onBookmarkToggle, onArchive, isRead = false }: NewsCardProps) {
  const categoryColors: Record<string, string> = {
    geopolitics: 'var(--accent-blue)',
    military: 'var(--accent-red)',
    economy: 'var(--accent-amber)',
    technology: '#06b6d4',
    diplomacy: '#8b5cf6',
    security: 'var(--accent-green)',
  };

  const categoryColor = categoryColors[article.category] || 'var(--text-secondary)';

  const handleClick = () => {
    if (onClick) {
      onClick(article);
    }
  };

  return (
    <article 
      className={`news-card ${variant} ${isRead ? 'read' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={handleClick}
    >
      <div className="news-card-header">
        <div className="news-card-meta">
          <span className="news-source">{article.source}</span>
          <span className="news-dot">·</span>
          <span className="news-time">{formatDate(article.publishedAt)}</span>
          {article.readTime && (
            <>
              <span className="news-dot">·</span>
              <span className="news-read-time">{article.readTime} min</span>
            </>
          )}
        </div>
        
        <div className="news-card-header-actions">
          {article.isBreaking && (
            <span className="breaking-badge">
              <span className="breaking-dot" />
              BREAKING
            </span>
          )}
          <button 
            className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
            onClick={(e) => { e.stopPropagation(); onBookmarkToggle?.(article.id); }}
            title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
          {onArchive && (
            <button 
              className={`archive-btn ${article.status === 'archived' ? 'archived' : ''}`}
              onClick={(e) => { e.stopPropagation(); onArchive(article.id); }}
              title={article.status === 'archived' ? 'Unarchive' : 'Archive'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={article.status === 'archived' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <polyline points="21,8 21,21 3,21 3,8" />
                <rect x="1" y="3" width="22" height="5" />
                <line x1="10" y1="12" x2="14" y2="12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <h3 className="news-card-title">{article.title}</h3>
      
      <p className="news-card-summary">{article.summary}</p>

      <div className="news-card-footer">
        <div className="news-tags">
          {article.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="news-tag" style={{ '--tag-color': categoryColor } as React.CSSProperties}>
              {tag.replace('-', ' ')}
            </span>
          ))}
        </div>
        
        <div className="news-category" style={{ color: categoryColor }}>
          <span 
            className="category-dot" 
            style={{ background: categoryColor }}
          />
          {article.category}
        </div>
      </div>

      <div className="news-card-expand">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15,3 21,3 21,9" />
          <polyline points="9,21 3,21 3,15" />
          <line x1="21" y1="3" x2="14" y2="10" />
          <line x1="3" y1="21" x2="10" y2="14" />
        </svg>
        Read more
      </div>

      <div className="glow-effect" style={{ '--glow-color': categoryColor } as React.CSSProperties} />
    </article>
  );
}

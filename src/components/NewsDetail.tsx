import { useEffect, useCallback } from 'react';
import type { NewsArticle } from '../types';
import { formatDate } from '../data/news';
import DOMPurify from 'dompurify';
import './NewsDetail.css';

interface NewsDetailProps {
  article: NewsArticle;
  onClose: () => void;
  isBookmarked?: boolean;
  onBookmarkToggle?: (articleId: string) => void;
  onArchive?: (articleId: string) => void;
}

function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'b', 'strong', 'em', 'a', 'img', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'width', 'height', 'target', 'rel', 'title'],
    ADD_ATTR: ['target'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  });
}

export default function NewsDetail({ article, onClose, isBookmarked = false, onBookmarkToggle, onArchive }: NewsDetailProps) {
  const categoryColors: Record<string, string> = {
    geopolitics: 'var(--accent-blue)',
    military: 'var(--accent-red)',
    economy: 'var(--accent-amber)',
    technology: '#06b6d4',
    diplomacy: '#8b5cf6',
    security: 'var(--accent-green)',
  };

  const categoryColor = categoryColors[article.category] || 'var(--text-secondary)';

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const openOriginalArticle = async () => {
    if (article.link) {
      try {
        const { open } = await import('@tauri-apps/plugin-shell');
        await open(article.link);
      } catch {
        window.open(article.link, '_blank', 'noopener,noreferrer');
      }
    }
  };

  return (
    <div className="news-detail-overlay" onClick={handleBackdropClick}>
      <div className="news-detail-modal">
        <div className="news-detail-header">
          <div className="news-detail-meta">
            <span className="news-detail-source">{article.source}</span>
            <span className="news-dot">·</span>
            <span className="news-detail-time">{formatDate(article.publishedAt)}</span>
            {article.readTime && (
              <>
                <span className="news-dot">·</span>
                <span className="news-detail-readtime">{article.readTime} min read</span>
              </>
            )}
          </div>
          
          {article.isBreaking && (
            <span className="breaking-badge">
              <span className="breaking-dot" />
              BREAKING
            </span>
          )}
          
          <div className="news-detail-actions">
            {onArchive && (
              <button 
                className={`detail-action-btn archive ${article.status === 'archived' ? 'active' : ''}`}
                onClick={() => onArchive(article.id)}
                title={article.status === 'archived' ? 'Unarchive' : 'Archive'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={article.status === 'archived' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <polyline points="21,8 21,21 3,21 3,8" />
                  <rect x="1" y="3" width="22" height="5" />
                  <line x1="10" y1="12" x2="14" y2="12" />
                </svg>
              </button>
            )}
            {onBookmarkToggle && (
              <button 
                className={`detail-action-btn bookmark ${isBookmarked ? 'active' : ''}`}
                onClick={() => onBookmarkToggle(article.id)}
                title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <h1 className="news-detail-title">{article.title}</h1>

        <div className="news-detail-category">
          <span 
            className="category-dot" 
            style={{ background: categoryColor }}
          />
          <span style={{ color: categoryColor }}>
            {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
          </span>
        </div>

        <div className="news-detail-tags">
          {article.tags.map((tag) => (
            <span 
              key={tag} 
              className="news-detail-tag" 
              style={{ '--tag-color': categoryColor } as React.CSSProperties}
            >
              {tag.replace('-', ' ')}
            </span>
          ))}
        </div>

        <div className="news-detail-content">
          {article.content ? (
            <div 
              className="news-content-html"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}
            />
          ) : (
            <div className="news-detail-summary">
              <p>{article.summary}</p>
              {article.summary && (
                <p className="news-detail-full-text">
                  {article.summary}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="news-detail-footer">
          <button className="news-detail-close-btn" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Close
          </button>
          
          {article.link && (
            <button className="news-detail-read-more-btn" onClick={openOriginalArticle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15,3 21,3 21,9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Read Full Article
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

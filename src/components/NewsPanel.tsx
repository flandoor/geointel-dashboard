import type { NewsArticle } from '../types';
import { formatDate } from '../data/news';
import DOMPurify from 'dompurify';
import './NewsPanel.css';

function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'b', 'strong', 'em', 'a', 'img', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'width', 'height', 'target', 'rel', 'title'],
    ADD_ATTR: ['target'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  });
}

interface NewsPanelProps {
  article: NewsArticle | null;
  isBookmarked?: boolean;
  onBookmarkToggle?: (articleId: string) => void;
  onArchive?: (articleId: string) => void;
}

export default function NewsPanel({ article, isBookmarked = false, onBookmarkToggle, onArchive }: NewsPanelProps) {
  const categoryColors: Record<string, string> = {
    geopolitics: 'var(--accent-blue)',
    military: 'var(--accent-red)',
    economy: 'var(--accent-amber)',
    technology: '#06b6d4',
    diplomacy: '#8b5cf6',
    security: 'var(--accent-green)',
  };

  if (!article) {
    return (
      <div className="news-panel-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14,2 14,8 20,8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
        <h3>Select an article</h3>
        <p>Click on any news item to preview it here</p>
      </div>
    );
  }

  const categoryColor = categoryColors[article.category] || 'var(--text-secondary)';

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
    <div className="news-panel">
      <div className="news-panel-header">
        {article.isBreaking && (
          <span className="panel-breaking-badge">
            <span className="breaking-dot" />
            BREAKING NEWS
          </span>
        )}
        
        <div className="news-panel-meta">
          <span className="news-panel-source">{article.source}</span>
          <span className="panel-dot">·</span>
          <span className="news-panel-time">{formatDate(article.publishedAt)}</span>
          {article.readTime && (
            <>
              <span className="panel-dot">·</span>
              <span className="news-panel-readtime">{article.readTime} min read</span>
            </>
          )}
        </div>

        <h1 className="news-panel-title">{article.title}</h1>

        <div className="news-panel-category-row">
          <span 
            className="panel-category-dot" 
            style={{ background: categoryColor }}
          />
          <span className="news-panel-category" style={{ color: categoryColor }}>
            {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
          </span>
        </div>

        <div className="news-panel-tags">
          {article.tags.map((tag) => (
            <span 
              key={tag} 
              className="news-panel-tag"
              style={{ '--tag-color': categoryColor } as React.CSSProperties}
            >
              {tag.replace('-', ' ')}
            </span>
          ))}
        </div>
      </div>

      <div className="news-panel-body">
        {article.content ? (
          <div 
            className="news-panel-html"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}
          />
        ) : (
          <div className="news-panel-summary">
            <p>{article.summary}</p>
            {article.summary && (
              <p className="news-panel-full-text">
                {article.summary}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="news-panel-footer">
        <button 
          className={`panel-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
          onClick={() => article && onBookmarkToggle?.(article.id)}
          title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          {isBookmarked ? 'Bookmarked' : 'Bookmark'}
        </button>
        {onArchive && article && (
          <button 
            className={`panel-archive-btn ${article.status === 'archived' ? 'archived' : ''}`}
            onClick={() => onArchive(article.id)}
            title={article.status === 'archived' ? 'Unarchive' : 'Archive'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={article.status === 'archived' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <polyline points="21,8 21,21 3,21 3,8" />
              <rect x="1" y="3" width="22" height="5" />
              <line x1="10" y1="12" x2="14" y2="12" />
            </svg>
            {article.status === 'archived' ? 'Unarchive' : 'Archive'}
          </button>
        )}
        {article?.link && (
          <button className="news-panel-read-btn" onClick={openOriginalArticle}>
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
  );
}

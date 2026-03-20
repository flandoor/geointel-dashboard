import type { NewsArticle } from '../types';
import { formatDate } from '../data/news';
import './NewsListItem.css';

interface NewsListItemProps {
  article: NewsArticle;
  isSelected: boolean;
  onClick: (article: NewsArticle) => void;
}

export default function NewsListItem({ article, isSelected, onClick }: NewsListItemProps) {
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
          {article.isBreaking && (
            <span className="list-item-breaking">
              <span className="breaking-dot" />
              LIVE
            </span>
          )}
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

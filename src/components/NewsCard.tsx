import type { NewsArticle } from '../types';
import { formatDate } from '../data/news';
import './NewsCard.css';

interface NewsCardProps {
  article: NewsArticle;
  variant?: 'default' | 'featured';
  index?: number;
}

export default function NewsCard({ article, variant = 'default', index = 0 }: NewsCardProps) {
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
      className={`news-card ${variant}`}
      style={{ animationDelay: `${index * 0.1}s` }}
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
        
        {article.isBreaking && (
          <span className="breaking-badge">
            <span className="breaking-dot" />
            BREAKING
          </span>
        )}
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

      <div className="glow-effect" style={{ '--glow-color': categoryColor } as React.CSSProperties} />
    </article>
  );
}

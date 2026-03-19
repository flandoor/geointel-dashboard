'use client';

import { NewsArticle } from '@/types';
import { formatDate, getCategoryColor } from '@/data/news';
import styles from './NewsCard.module.css';

interface NewsCardProps {
  article: NewsArticle;
  variant?: 'default' | 'featured' | 'compact';
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
      className={`${styles.card} ${styles[variant]}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={styles.header}>
        <div className={styles.meta}>
          <span className={styles.source}>{article.source}</span>
          <span className={styles.dot}>·</span>
          <span className={styles.time}>{formatDate(article.publishedAt)}</span>
          {article.readTime && (
            <>
              <span className={styles.dot}>·</span>
              <span className={styles.readTime}>{article.readTime} min</span>
            </>
          )}
        </div>
        
        {article.isBreaking && (
          <span className={styles.breakingBadge}>
            <span className={styles.breakingDot} />
            BREAKING
          </span>
        )}
      </div>

      <h3 className={styles.title}>{article.title}</h3>
      
      <p className={styles.summary}>{article.summary}</p>

      <div className={styles.footer}>
        <div className={styles.tags}>
          {article.tags.slice(0, 3).map((tag) => (
            <span key={tag} className={styles.tag} style={{ '--tag-color': categoryColor } as React.CSSProperties}>
              {tag.replace('-', ' ')}
            </span>
          ))}
        </div>
        
        <div className={styles.category} style={{ color: categoryColor }}>
          <span 
            className={styles.categoryDot} 
            style={{ background: categoryColor }}
          />
          {article.category}
        </div>
      </div>

      <div className={styles.glowEffect} style={{ '--glow-color': categoryColor } as React.CSSProperties} />
    </article>
  );
}

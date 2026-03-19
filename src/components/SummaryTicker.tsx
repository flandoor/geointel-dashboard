'use client';

import { useEffect, useState } from 'react';
import styles from './SummaryTicker.module.css';

interface TickerItem {
  region: string;
  event: string;
  status: 'alert' | 'warning' | 'normal';
}

const tickerItems: TickerItem[] = [
  { region: 'BALTIC', event: 'NATO naval activity elevated', status: 'warning' },
  { region: 'SCS', event: 'China military exercises ongoing', status: 'alert' },
  { region: 'UKRAINE', event: 'Frontline activity stable', status: 'normal' },
  { region: 'MENA', event: 'Diplomatic negotiations in progress', status: 'normal' },
  { region: 'ARCTIC', event: 'Russian presence increased', status: 'warning' },
  { region: 'EASTF', event: 'North Korea missile test', status: 'alert' },
];

export default function SummaryTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tickerItems.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const current = tickerItems[currentIndex];

  return (
    <div className={styles.ticker}>
      <div className={styles.label}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        REGIONAL ALERTS
      </div>
      
      <div 
        className={styles.content}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div 
          className={`${styles.status} ${styles[current.status]}`}
          key={`status-${currentIndex}`}
        />
        <span className={styles.region} key={`region-${currentIndex}`}>
          {current.region}
        </span>
        <span className={styles.event} key={`event-${currentIndex}`}>
          {current.event}
        </span>
        
        <div className={styles.indicators}>
          {tickerItems.map((item, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === currentIndex ? styles.active : ''} ${styles[item.status]}`}
              onClick={() => setCurrentIndex(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

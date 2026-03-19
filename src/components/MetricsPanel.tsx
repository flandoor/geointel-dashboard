import './MetricsPanel.css';

interface MetricCard {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  region: string;
}

const metrics: MetricCard[] = [
  { label: 'Global Threat Index', value: '7.2', change: '+0.3', trend: 'up', region: 'WORLD' },
  { label: 'Active Conflicts', value: '23', change: '+2', trend: 'up', region: 'MULTI' },
  { label: 'NATO Readiness', value: '87%', change: '+5%', trend: 'up', region: 'EU' },
  { label: 'Trade Disruption', value: '12', change: '-3', trend: 'down', region: 'GLOBAL' },
];

export default function MetricsPanel() {
  return (
    <div className="metrics-panel">
      <div className="metrics-header">
        <h3 className="metrics-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3v18h18" />
            <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
          </svg>
          Key Indicators
        </h3>
        <span className="metrics-timestamp">Updated 2m ago</span>
      </div>
      
      <div className="metrics-grid">
        {metrics.map((metric, i) => (
          <div key={i} className="metric-card">
            <div className="metric-header">
              <span className="metric-region">{metric.region}</span>
              <span className={`metric-trend ${metric.trend}`}>
                {metric.trend === 'up' && '↑'}
                {metric.trend === 'down' && '↓'}
                {metric.trend === 'stable' && '→'}
                {metric.change}
              </span>
            </div>
            <div className="metric-value">{metric.value}</div>
            <div className="metric-label">{metric.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

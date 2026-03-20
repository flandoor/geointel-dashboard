import { useState, useEffect } from 'react';
import './MetricsPanel.css';

interface TickerItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  isCrypto: boolean;
}

const MOCK_STOCKS: TickerItem[] = [
  { symbol: 'S&P 500', name: 'S&P 500', price: 5248.50, change: 0.42, isCrypto: false },
  { symbol: 'NASDAQ', name: 'NASDAQ', price: 18392.75, change: 0.68, isCrypto: false },
  { symbol: 'DOW', name: 'DOW', price: 39127.20, change: -0.15, isCrypto: false },
  { symbol: 'VIX', name: 'VIX', price: 14.85, change: -2.30, isCrypto: false },
  { symbol: 'GOLD', name: 'Gold', price: 2342.80, change: 0.31, isCrypto: false },
  { symbol: 'OIL', name: 'Crude Oil', price: 82.45, change: -1.12, isCrypto: false },
  { symbol: 'USD', name: 'USD Index', price: 104.32, change: 0.08, isCrypto: false },
  { symbol: '10Y', name: 'US 10Y', price: 4.52, change: 0.02, isCrypto: false },
];

export default function MetricsPanel() {
  const [crypto, setCrypto] = useState<TickerItem[]>([]);

  useEffect(() => {
    const fetchCrypto = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,ripple,cardano,polkadot,binancecoin,pancakeswap-token&vs_currencies=usd&include_24hr_change=true'
        );
        const data = await response.json();

        const cryptoData: TickerItem[] = [
          { symbol: 'BTC', name: 'Bitcoin', price: data.bitcoin?.usd || 0, change: data.bitcoin?.usd_24h_change || 0, isCrypto: true },
          { symbol: 'ETH', name: 'Ethereum', price: data.ethereum?.usd || 0, change: data.ethereum?.usd_24h_change || 0, isCrypto: true },
          { symbol: 'SOL', name: 'Solana', price: data.solana?.usd || 0, change: data.solana?.usd_24h_change || 0, isCrypto: true },
          { symbol: 'XRP', name: 'Ripple', price: data.ripple?.usd || 0, change: data.ripple?.usd_24h_change || 0, isCrypto: true },
          { symbol: 'ADA', name: 'Cardano', price: data.cardano?.usd || 0, change: data.cardano?.usd_24h_change || 0, isCrypto: true },
          { symbol: 'DOT', name: 'Polkadot', price: data.polkadot?.usd || 0, change: data.polkadot?.usd_24h_change || 0, isCrypto: true },
          { symbol: 'BNB', name: 'BNB', price: data.binancecoin?.usd || 0, change: data.binancecoin?.usd_24h_change || 0, isCrypto: true },
          { symbol: 'CAKE', name: 'PancakeSwap', price: data['pancakeswap-token']?.usd || 0, change: data['pancakeswap-token']?.usd_24h_change || 0, isCrypto: true },
        ];

        setCrypto(cryptoData);
      } catch (error) {
        console.error('Error fetching crypto:', error);
      }
    };

    fetchCrypto();
    const interval = setInterval(fetchCrypto, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number, isCrypto: boolean) => {
    if (isCrypto) {
      if (price < 1) return `$${price.toFixed(4)}`;
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (price < 100) return price.toFixed(2);
    if (price > 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return price.toFixed(2);
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  const allItems = [...crypto, ...MOCK_STOCKS];

  return (
    <div className="ticker-bar">
      <div className="ticker-label">
        <span className="ticker-label-dot" />
        MARKETS
      </div>
      <div className="ticker-track-container">
        <div className="ticker-track">
          {[...allItems, ...allItems].map((item, i) => (
            <span key={i} className="ticker-token">
              <span className="ticker-token-symbol">{item.symbol}</span>
              <span className="ticker-token-price">
                {formatPrice(item.price, item.isCrypto)}
              </span>
              <span className={`ticker-token-change ${item.change >= 0 ? 'up' : 'down'}`}>
                {formatChange(item.change)}
              </span>
              <span className="ticker-separator">|</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

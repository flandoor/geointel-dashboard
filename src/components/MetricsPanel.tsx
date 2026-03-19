import { useState, useEffect } from 'react';
import './MetricsPanel.css';

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
}

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
}

const MOCK_STOCKS: StockData[] = [
  { symbol: 'SPX', name: 'S&P 500', price: 5248.50, change: 0.42 },
  { symbol: 'NDX', name: 'NASDAQ', price: 18392.75, change: 0.68 },
  { symbol: 'DJI', name: 'Dow Jones', price: 39127.20, change: -0.15 },
  { symbol: 'VIX', name: 'VIX', price: 14.85, change: -2.30 },
  { symbol: 'GOLD', name: 'Gold', price: 2342.80, change: 0.31 },
  { symbol: 'OIL', name: 'Crude Oil', price: 82.45, change: -1.12 },
  { symbol: 'DXY', name: 'USD Index', price: 104.32, change: 0.08 },
  { symbol: '10Y', name: 'US 10Y', price: 4.52, change: 0.02 },
];

export default function MetricsPanel() {
  const [crypto, setCrypto] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCrypto = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,ripple,cardano,polkadot,binancecoin,pancakeswap-token&vs_currencies=usd&include_24hr_change=true'
        );
        const data = await response.json();

        const cryptoData: CryptoData[] = [
          { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: data.bitcoin?.usd || 0, change24h: data.bitcoin?.usd_24h_change || 0 },
          { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: data.ethereum?.usd || 0, change24h: data.ethereum?.usd_24h_change || 0 },
          { id: 'solana', symbol: 'SOL', name: 'Solana', price: data.solana?.usd || 0, change24h: data.solana?.usd_24h_change || 0 },
          { id: 'ripple', symbol: 'XRP', name: 'Ripple', price: data.ripple?.usd || 0, change24h: data.ripple?.usd_24h_change || 0 },
          { id: 'cardano', symbol: 'ADA', name: 'Cardano', price: data.cardano?.usd || 0, change24h: data.cardano?.usd_24h_change || 0 },
          { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', price: data.polkadot?.usd || 0, change24h: data.polkadot?.usd_24h_change || 0 },
          { id: 'binancecoin', symbol: 'BNB', name: 'BNB', price: data.binancecoin?.usd || 0, change24h: data.binancecoin?.usd_24h_change || 0 },
          { id: 'pancakeswap-token', symbol: 'CAKE', name: 'PancakeSwap', price: data['pancakeswap-token']?.usd || 0, change24h: data['pancakeswap-token']?.usd_24h_change || 0 },
        ];

        setCrypto(cryptoData);
      } catch (error) {
        console.error('Error fetching crypto:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCrypto();
    const interval = setInterval(fetchCrypto, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number, isCrypto = false) => {
    if (isCrypto) {
      if (price < 1) return `$${price.toFixed(4)}`;
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (price < 100) return price.toFixed(2);
    if (price > 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return price.toFixed(2);
  };

  return (
    <div className="metrics-panel">
      <div className="metrics-header">
        <h3 className="metrics-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          Markets
        </h3>
        <span className="metrics-timestamp">Live</span>
      </div>

      <div className="ticker-container">
        <div className="ticker-section">
          <div className="ticker-section-header">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" />
            </svg>
            Crypto
          </div>
          <div className="ticker-scroll">
            {loading ? (
              <div className="ticker-loading">Loading...</div>
            ) : (
              crypto.map((coin) => (
                <div key={coin.id} className="ticker-item">
                  <span className="ticker-symbol">{coin.symbol}</span>
                  <span className="ticker-price">{formatPrice(coin.price, true)}</span>
                  <span className={`ticker-change ${coin.change24h >= 0 ? 'up' : 'down'}`}>
                    {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="ticker-divider" />

        <div className="ticker-section">
          <div className="ticker-section-header">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3v18h18" />
              <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
            </svg>
            Indices & Commodities
          </div>
          <div className="ticker-scroll">
            {MOCK_STOCKS.map((stock) => (
              <div key={stock.symbol} className="ticker-item">
                <span className="ticker-symbol">{stock.symbol}</span>
                <span className="ticker-price">{formatPrice(stock.price)}</span>
                <span className={`ticker-change ${stock.change >= 0 ? 'up' : 'down'}`}>
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

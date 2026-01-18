// Mock stock data generator aligned with realistic market patterns

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  high52w: number;
  low52w: number;
}

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export const popularStocks: Stock[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 178.72, change: 2.34, changePercent: 1.33, volume: 52340000, marketCap: '2.8T', high52w: 199.62, low52w: 164.08 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.80, change: -0.92, changePercent: -0.65, volume: 21890000, marketCap: '1.8T', high52w: 153.78, low52w: 115.83 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.91, change: 4.12, changePercent: 1.10, volume: 18920000, marketCap: '2.8T', high52w: 420.82, low52w: 309.45 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.25, change: 1.87, changePercent: 1.06, volume: 34120000, marketCap: '1.9T', high52w: 201.20, low52w: 118.35 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: -5.32, changePercent: -2.10, volume: 98760000, marketCap: '789B', high52w: 299.29, low52w: 152.37 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.28, change: 12.45, changePercent: 1.44, volume: 42150000, marketCap: '2.2T', high52w: 974.00, low52w: 373.56 },
  { symbol: 'META', name: 'Meta Platforms', price: 505.95, change: 8.23, changePercent: 1.65, volume: 15430000, marketCap: '1.3T', high52w: 542.81, low52w: 274.38 },
  { symbol: 'JPM', name: 'JPMorgan Chase', price: 198.42, change: 0.87, changePercent: 0.44, volume: 8920000, marketCap: '571B', high52w: 205.88, low52w: 135.19 },
  { symbol: 'V', name: 'Visa Inc.', price: 279.85, change: 1.23, changePercent: 0.44, volume: 6780000, marketCap: '574B', high52w: 290.96, low52w: 227.68 },
  { symbol: 'WMT', name: 'Walmart Inc.', price: 165.23, change: -0.45, changePercent: -0.27, volume: 7890000, marketCap: '445B', high52w: 169.94, low52w: 143.15 },
];

// Generate realistic candlestick data
export function generateCandleData(basePrice: number, days: number = 90): CandleData[] {
  const data: CandleData[] = [];
  let currentPrice = basePrice * 0.85; // Start 15% lower to show growth
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const volatility = 0.02 + Math.random() * 0.03;
    const trend = Math.random() > 0.45 ? 1 : -1;
    const change = currentPrice * volatility * trend;
    
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.abs(change) * Math.random() * 0.5;
    const low = Math.min(open, close) - Math.abs(change) * Math.random() * 0.5;
    
    data.push({
      time: date.toISOString().split('T')[0],
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Math.floor(Math.random() * 50000000) + 10000000,
    });
    
    currentPrice = close;
  }
  
  return data;
}

// Simulate real-time price updates
export function getUpdatedPrice(currentPrice: number): { price: number; change: number } {
  const volatility = 0.001;
  const randomChange = (Math.random() - 0.5) * 2 * volatility * currentPrice;
  const newPrice = Number((currentPrice + randomChange).toFixed(2));
  return { price: newPrice, change: randomChange };
}

export interface Position {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  stopLoss?: number;
  takeProfit?: number;
}

export interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  shares: number;
  price: number;
  total: number;
  timestamp: Date;
  status: 'completed' | 'pending' | 'auto-closed';
  reason?: string;
}

import { useEffect, useState, useCallback } from 'react';
import { AnimatedNumber } from './AnimatedNumber';
import { getUpdatedPrice } from '@/lib/stockData';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface LiveStockPriceProps {
  basePrice: number;
  symbol: string;
  showChange?: boolean;
  className?: string;
  updateInterval?: number;
}

export function LiveStockPrice({ 
  basePrice, 
  symbol, 
  showChange = true,
  className = '',
  updateInterval = 5000
}: LiveStockPriceProps) {
  const [price, setPrice] = useState(basePrice);
  const [change, setChange] = useState(0);
  const [isPositive, setIsPositive] = useState(true);

  useEffect(() => {
    // Random interval between 3-10 seconds
    const getRandomInterval = () => Math.floor(Math.random() * 7000) + 3000;
    
    let timeoutId: NodeJS.Timeout;
    
    const updatePrice = () => {
      const { price: newPrice, change: priceChange } = getUpdatedPrice(price);
      setPrice(newPrice);
      setChange(priceChange);
      setIsPositive(priceChange >= 0);
      
      // Schedule next update with random interval
      timeoutId = setTimeout(updatePrice, getRandomInterval());
    };
    
    // Initial update after random delay
    timeoutId = setTimeout(updatePrice, getRandomInterval());
    
    return () => clearTimeout(timeoutId);
  }, []);

  const changePercent = (change / (price - change)) * 100;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <AnimatedNumber value={price} prefix="$" decimals={2} className="text-lg font-bold" />
      {showChange && (
        <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-profit' : 'text-loss'}`}>
          {isPositive ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          <span>
            {isPositive ? '+' : ''}{change.toFixed(2)} ({changePercent.toFixed(2)}%)
          </span>
        </div>
      )}
    </div>
  );
}

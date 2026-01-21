import { useEffect, useState } from 'react';
import { AnimatedNumber } from './AnimatedNumber';
import { useStockPrice } from '@/hooks/useStockPrices';
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';

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
}: LiveStockPriceProps) {
  const { quote, loading, error } = useStockPrice(symbol);
  
  // Use live price if available, otherwise fall back to base price
  const price = quote?.price && quote.price > 0 ? quote.price : basePrice;
  const change = quote?.change ?? 0;
  const changePercent = quote?.changePercent ?? 0;
  const isPositive = change >= 0;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        <AnimatedNumber value={price} prefix="$" decimals={2} className="text-lg font-bold" />
        {loading && !quote && (
          <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
        )}
      </div>
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

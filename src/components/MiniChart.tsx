import { useMemo, useEffect, useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { generateCandleData, getUpdatedPrice } from '@/lib/stockData';

interface MiniChartProps {
  basePrice: number;
  symbol: string;
  height?: number;
}

export function MiniChart({ basePrice, symbol, height = 60 }: MiniChartProps) {
  const [currentPrice, setCurrentPrice] = useState(basePrice);
  
  // Generate initial data
  const initialData = useMemo(() => {
    return generateCandleData(basePrice, 7).map(d => ({ value: d.close }));
  }, [basePrice]);
  
  const [data, setData] = useState(initialData);

  // Update with live price
  useEffect(() => {
    const getRandomInterval = () => Math.floor(Math.random() * 7000) + 3000;
    
    let timeoutId: NodeJS.Timeout;
    
    const updatePrice = () => {
      const { price: newPrice } = getUpdatedPrice(currentPrice);
      setCurrentPrice(newPrice);
      setData(prev => {
        const newData = [...prev.slice(1), { value: newPrice }];
        return newData;
      });
      
      timeoutId = setTimeout(updatePrice, getRandomInterval());
    };
    
    timeoutId = setTimeout(updatePrice, getRandomInterval());
    
    return () => clearTimeout(timeoutId);
  }, []);

  const isPositive = data.length >= 2 && data[data.length - 1].value >= data[0].value;

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`miniGradient-${symbol}`} x1="0" y1="0" x2="0" y2="1">
              <stop 
                offset="5%" 
                stopColor={isPositive ? 'hsl(145, 100%, 39%)' : 'hsl(0, 84%, 60%)'} 
                stopOpacity={0.3} 
              />
              <stop 
                offset="95%" 
                stopColor={isPositive ? 'hsl(145, 100%, 39%)' : 'hsl(0, 84%, 60%)'} 
                stopOpacity={0} 
              />
            </linearGradient>
          </defs>
          <YAxis domain={['auto', 'auto']} hide />
          <Area
            type="monotone"
            dataKey="value"
            stroke={isPositive ? 'hsl(145, 100%, 39%)' : 'hsl(0, 84%, 60%)'}
            strokeWidth={2}
            fill={`url(#miniGradient-${symbol})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

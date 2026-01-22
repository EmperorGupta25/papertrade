import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { CandleData, generateCandleData } from '@/lib/stockData';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Layers } from 'lucide-react';

type ChartType = 'line' | 'area' | 'candlestick';

interface StockChartProps {
  symbol: string;
  basePrice: number;
}

export function StockChart({ symbol, basePrice }: StockChartProps) {
  const [chartType, setChartType] = useState<ChartType>('area');
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y' | '10Y'>('1M');

  const data = useMemo(() => {
    const daysMap: Record<string, number> = {
      '1D': 1,
      '1W': 7,
      '1M': 30,
      '3M': 90,
      '1Y': 365,
      '10Y': 3650,
    };
    const resolutionMap: Record<string, 'minute' | 'hourly' | '4hour' | 'daily'> = {
      '1D': 'minute',
      '1W': 'hourly',
      '1M': '4hour',
    };
    const resolution = resolutionMap[timeframe] || 'daily';
    return generateCandleData(basePrice, daysMap[timeframe] || 30, resolution);
  }, [basePrice, timeframe]);

  const chartTypes: { type: ChartType; icon: React.ReactNode; label: string }[] = [
    { type: 'line', icon: <TrendingUp className="h-4 w-4" />, label: 'Line' },
    { type: 'area', icon: <Layers className="h-4 w-4" />, label: 'Area' },
    { type: 'candlestick', icon: <BarChart3 className="h-4 w-4" />, label: 'Candles' },
  ];

  const timeframes = ['1D', '1W', '1M', '3M', '1Y', '10Y'] as const;

  const isPositive = data.length >= 2 && data[data.length - 1].close >= data[0].open;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 p-1 bg-secondary rounded-lg">
          {chartTypes.map(({ type, icon, label }) => (
            <Button
              key={type}
              variant={chartType === type ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType(type)}
              className="gap-2"
            >
              {icon}
              <span className="hidden sm:inline">{label}</span>
            </Button>
          ))}
        </div>

        <div className="flex gap-1 p-1 bg-secondary rounded-lg">
          {timeframes.map(tf => (
            <Button
              key={tf}
              variant={timeframe === tf ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeframe(tf)}
            >
              {tf}
            </Button>
          ))}
        </div>
      </div>

      <motion.div
        key={`${chartType}-${timeframe}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="h-[300px] sm:h-[400px]"
      >
        {chartType === 'candlestick' ? (
          <CandlestickChart data={data} />
        ) : chartType === 'area' ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPositive ? 'hsl(145, 100%, 39%)' : 'hsl(0, 84%, 60%)'} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={isPositive ? 'hsl(145, 100%, 39%)' : 'hsl(0, 84%, 60%)'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" opacity={0.3} />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="close"
                stroke={isPositive ? 'hsl(145, 100%, 39%)' : 'hsl(0, 84%, 60%)'}
                strokeWidth={2}
                fill="url(#colorArea)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" opacity={0.3} />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="close"
                stroke={isPositive ? 'hsl(145, 100%, 39%)' : 'hsl(0, 84%, 60%)'}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </motion.div>
    </div>
  );
}

function CandlestickChart({ data }: { data: CandleData[] }) {
  const minPrice = Math.min(...data.map(d => d.low));
  const maxPrice = Math.max(...data.map(d => d.high));
  const priceRange = maxPrice - minPrice;

  return (
    <div className="w-full h-full flex items-end gap-0.5 px-2">
      {data.map((candle, i) => {
        const isGreen = candle.close >= candle.open;
        const bodyTop = Math.max(candle.open, candle.close);
        const bodyBottom = Math.min(candle.open, candle.close);
        
        const wickTopPercent = ((maxPrice - candle.high) / priceRange) * 100;
        const bodyTopPercent = ((maxPrice - bodyTop) / priceRange) * 100;
        const bodyHeight = ((bodyTop - bodyBottom) / priceRange) * 100;
        const wickBottomPercent = ((maxPrice - candle.low) / priceRange) * 100;

        return (
          <div
            key={i}
            className="relative flex-1 h-full"
            style={{ minWidth: '2px', maxWidth: '12px' }}
          >
            {/* Wick */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 w-[1px] ${isGreen ? 'bg-profit' : 'bg-loss'}`}
              style={{
                top: `${wickTopPercent}%`,
                height: `${wickBottomPercent - wickTopPercent}%`,
              }}
            />
            {/* Body */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: i * 0.005, duration: 0.2 }}
              className={`absolute left-0 right-0 ${isGreen ? 'bg-profit' : 'bg-loss'} rounded-sm`}
              style={{
                top: `${bodyTopPercent}%`,
                height: `${Math.max(bodyHeight, 0.5)}%`,
                transformOrigin: 'bottom',
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;

  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
      <p className="text-sm text-muted-foreground mb-2">{label}</p>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <span className="text-muted-foreground">Open:</span>
        <span className="font-medium">${data.open?.toFixed(2)}</span>
        <span className="text-muted-foreground">Close:</span>
        <span className="font-medium">${data.close?.toFixed(2)}</span>
        <span className="text-muted-foreground">High:</span>
        <span className="font-medium">${data.high?.toFixed(2)}</span>
        <span className="text-muted-foreground">Low:</span>
        <span className="font-medium">${data.low?.toFixed(2)}</span>
      </div>
    </div>
  );
}

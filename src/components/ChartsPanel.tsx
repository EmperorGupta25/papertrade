import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Stock, allStocks, generateCandleData, CandleData, getUpdatedPrice } from '@/lib/stockData';
import { AnimatedNumber } from './AnimatedNumber';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { BarChart3, TrendingUp, Layers, Info, HelpCircle } from 'lucide-react';

type ChartType = 'line' | 'area' | 'candlestick';

export function ChartsPanel() {
  const [selectedStock, setSelectedStock] = useState<Stock>(allStocks[0]);
  const [chartType, setChartType] = useState<ChartType>('area');
  const [timeframe, setTimeframe] = useState<'1W' | '1M' | '3M'>('1M');
  const [livePrice, setLivePrice] = useState(selectedStock.price);
  const [priceChange, setPriceChange] = useState(0);

  // Generate chart data
  const data = useMemo(() => {
    const days = timeframe === '1W' ? 7 : timeframe === '1M' ? 30 : 90;
    return generateCandleData(selectedStock.price, days);
  }, [selectedStock.price, timeframe]);

  // Live price updates with random 3-10 second intervals
  useEffect(() => {
    const getRandomInterval = () => Math.floor(Math.random() * 7000) + 3000;
    
    let timeoutId: NodeJS.Timeout;
    
    const updatePrice = () => {
      const { price: newPrice, change } = getUpdatedPrice(livePrice);
      setLivePrice(newPrice);
      setPriceChange(change);
      
      timeoutId = setTimeout(updatePrice, getRandomInterval());
    };
    
    timeoutId = setTimeout(updatePrice, getRandomInterval());
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Reset live price when stock changes
  useEffect(() => {
    setLivePrice(selectedStock.price);
    setPriceChange(0);
  }, [selectedStock]);

  const chartTypes: { type: ChartType; icon: React.ReactNode; label: string; description: string }[] = [
    { type: 'line', icon: <TrendingUp className="h-4 w-4" />, label: 'Line', description: 'Simple line showing closing prices' },
    { type: 'area', icon: <Layers className="h-4 w-4" />, label: 'Area', description: 'Filled area chart for trend visualization' },
    { type: 'candlestick', icon: <BarChart3 className="h-4 w-4" />, label: 'Candles', description: 'Shows open, high, low, close prices' },
  ];

  const timeframes = [
    { value: '1W', label: '1 Week' },
    { value: '1M', label: '1 Month' },
    { value: '3M', label: '3 Months' },
  ] as const;

  const isPositive = data.length >= 2 && data[data.length - 1].close >= data[0].open;
  const isPriceUp = priceChange >= 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Stock Charts</h1>
          <p className="text-muted-foreground">Detailed price analysis with live updates</p>
        </div>

        <Select value={selectedStock.symbol} onValueChange={(symbol) => {
          const stock = allStocks.find(s => s.symbol === symbol);
          if (stock) setSelectedStock(stock);
        }}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select stock" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {allStocks.map(stock => (
              <SelectItem key={stock.symbol} value={stock.symbol}>
                <span className="font-medium">{stock.symbol}</span>
                <span className="text-muted-foreground ml-2">{stock.name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stock Info Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl">{selectedStock.symbol}</CardTitle>
              <CardDescription className="text-base">{selectedStock.name}</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold flex items-center gap-2">
                <AnimatedNumber value={livePrice} prefix="$" decimals={2} />
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.3 }}
                  key={livePrice}
                  className={`text-sm px-2 py-1 rounded ${isPriceUp ? 'bg-profit/20 text-profit' : 'bg-loss/20 text-loss'}`}
                >
                  {isPriceUp ? '↑' : '↓'} {Math.abs(priceChange).toFixed(2)}
                </motion.div>
              </div>
              <p className={`text-sm ${isPriceUp ? 'text-profit' : 'text-loss'}`}>
                {isPriceUp ? '+' : ''}{((priceChange / (livePrice - priceChange)) * 100).toFixed(2)}% today
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Chart Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-1 p-1 bg-secondary rounded-lg">
              {chartTypes.map(({ type, icon, label, description }) => (
                <Tooltip key={type}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={chartType === type ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setChartType(type)}
                      className="gap-2"
                    >
                      {icon}
                      <span className="hidden sm:inline">{label}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">{description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            <div className="flex gap-1 p-1 bg-secondary rounded-lg">
              {timeframes.map(({ value, label }) => (
                <Button
                  key={value}
                  variant={timeframe === value ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setTimeframe(value)}
                >
                  {value}
                </Button>
              ))}
            </div>
          </div>

          {/* Beginner Tip */}
          <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
            <HelpCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-primary">Tip for beginners</p>
              <p className="text-muted-foreground">
                {chartType === 'candlestick' 
                  ? 'Green candles mean the price went up that day, red means it went down. The thin lines (wicks) show the highest and lowest prices.'
                  : 'Hover over the chart to see exact prices at any point. The green/red color shows if the stock is up or down overall.'
                }
              </p>
            </div>
          </div>

          {/* Chart */}
          <motion.div
            key={`${chartType}-${timeframe}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-[400px]"
          >
            {chartType === 'candlestick' ? (
              <CandlestickChart data={data} />
            ) : chartType === 'area' ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorAreaDetail" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isPositive ? 'hsl(145, 100%, 39%)' : 'hsl(0, 84%, 60%)'} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={isPositive ? 'hsl(145, 100%, 39%)' : 'hsl(0, 84%, 60%)'} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" opacity={0.3} />
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `$${v.toFixed(0)}`} />
                  <RechartsTooltip content={<DetailedTooltip />} />
                  <ReferenceLine y={data[0]?.open} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" label="Start" />
                  <Area
                    type="monotone"
                    dataKey="close"
                    stroke={isPositive ? 'hsl(145, 100%, 39%)' : 'hsl(0, 84%, 60%)'}
                    strokeWidth={2}
                    fill="url(#colorAreaDetail)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" opacity={0.3} />
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `$${v.toFixed(0)}`} />
                  <RechartsTooltip content={<DetailedTooltip />} />
                  <ReferenceLine y={data[0]?.open} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" />
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

          {/* Stock Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t">
            <StatCard label="Market Cap" value={selectedStock.marketCap} />
            <StatCard label="Volume" value={`${(selectedStock.volume / 1000000).toFixed(1)}M`} />
            <StatCard label="52W High" value={`$${selectedStock.high52w.toFixed(2)}`} highlight="up" />
            <StatCard label="52W Low" value={`$${selectedStock.low52w.toFixed(2)}`} highlight="down" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: 'up' | 'down' }) {
  return (
    <div className="text-center p-3 bg-secondary/50 rounded-lg">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`font-semibold text-lg ${highlight === 'up' ? 'text-profit' : highlight === 'down' ? 'text-loss' : ''}`}>
        {value}
      </p>
    </div>
  );
}

function CandlestickChart({ data }: { data: CandleData[] }) {
  const minPrice = Math.min(...data.map(d => d.low));
  const maxPrice = Math.max(...data.map(d => d.high));
  const priceRange = maxPrice - minPrice;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Y-axis labels */}
      <div className="flex h-full">
        <div className="w-16 flex flex-col justify-between py-2 text-xs text-muted-foreground">
          <span>${maxPrice.toFixed(0)}</span>
          <span>${((maxPrice + minPrice) / 2).toFixed(0)}</span>
          <span>${minPrice.toFixed(0)}</span>
        </div>
        <div className="flex-1 flex items-end gap-0.5 px-2">
          {data.map((candle, i) => {
            const isGreen = candle.close >= candle.open;
            const bodyTop = Math.max(candle.open, candle.close);
            const bodyBottom = Math.min(candle.open, candle.close);
            
            const wickTopPercent = ((maxPrice - candle.high) / priceRange) * 100;
            const bodyTopPercent = ((maxPrice - bodyTop) / priceRange) * 100;
            const bodyHeight = ((bodyTop - bodyBottom) / priceRange) * 100;
            const wickBottomPercent = ((maxPrice - candle.low) / priceRange) * 100;

            return (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  <div
                    className="relative flex-1 h-full cursor-pointer hover:bg-secondary/50 rounded"
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
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs space-y-1">
                    <p className="font-medium">{candle.time}</p>
                    <div className="grid grid-cols-2 gap-x-4">
                      <span className="text-muted-foreground">Open:</span>
                      <span>${candle.open.toFixed(2)}</span>
                      <span className="text-muted-foreground">Close:</span>
                      <span>${candle.close.toFixed(2)}</span>
                      <span className="text-muted-foreground">High:</span>
                      <span className="text-profit">${candle.high.toFixed(2)}</span>
                      <span className="text-muted-foreground">Low:</span>
                      <span className="text-loss">${candle.low.toFixed(2)}</span>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DetailedTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;
  const isPositive = data.close >= data.open;

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-lg">
      <p className="text-sm font-medium mb-3">{label}</p>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Open:</span>
          <span className="font-medium ml-2">${data.open?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Close:</span>
          <span className={`font-medium ml-2 ${isPositive ? 'text-profit' : 'text-loss'}`}>${data.close?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">High:</span>
          <span className="font-medium text-profit ml-2">${data.high?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Low:</span>
          <span className="font-medium text-loss ml-2">${data.low?.toFixed(2)}</span>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
        <p>Volume: {(data.volume / 1000000).toFixed(2)}M</p>
        <p className={isPositive ? 'text-profit' : 'text-loss'}>
          Change: {isPositive ? '+' : ''}{((data.close - data.open) / data.open * 100).toFixed(2)}%
        </p>
      </div>
    </div>
  );
}

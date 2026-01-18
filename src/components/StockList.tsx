import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Stock, popularStocks } from '@/lib/stockData';

interface StockListProps {
  onSelectStock: (stock: Stock) => void;
  selectedSymbol?: string;
}

export function StockList({ onSelectStock, selectedSymbol }: StockListProps) {
  const [search, setSearch] = useState('');

  const filteredStocks = popularStocks.filter(
    stock =>
      stock.symbol.toLowerCase().includes(search.toLowerCase()) ||
      stock.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Market</CardTitle>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stocks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
        {filteredStocks.map((stock, i) => {
          const isPositive = stock.change >= 0;
          const isSelected = selectedSymbol === stock.symbol;

          return (
            <motion.button
              key={stock.symbol}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelectStock(stock)}
              className={`w-full p-3 rounded-lg text-left transition-all ${
                isSelected
                  ? 'bg-primary/10 border border-primary'
                  : 'bg-secondary/30 hover:bg-secondary/60 border border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold">{stock.symbol}</span>
                  <p className="text-sm text-muted-foreground truncate max-w-[150px]">
                    {stock.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${stock.price.toFixed(2)}</p>
                  <div className={`flex items-center justify-end gap-1 text-sm ${isPositive ? 'text-profit' : 'text-loss'}`}>
                    {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    <span>
                      {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </CardContent>
    </Card>
  );
}

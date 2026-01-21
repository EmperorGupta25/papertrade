import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, TrendingDown, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Stock, allStocks, getSectors } from '@/lib/stockData';
import { useBatchStockPrices } from '@/hooks/useStockPrices';

interface StockListProps {
  onSelectStock: (stock: Stock) => void;
  selectedSymbol?: string;
}

export function StockList({ onSelectStock, selectedSymbol }: StockListProps) {
  const [search, setSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const sectors = getSectors();

  // Filter stocks by search and sector
  const filteredStocks = useMemo(() => {
    return allStocks.filter(stock => {
      const matchesSearch = 
        stock.symbol.toLowerCase().includes(search.toLowerCase()) ||
        stock.name.toLowerCase().includes(search.toLowerCase());
      const matchesSector = selectedSector === 'all' || stock.sector === selectedSector;
      return matchesSearch && matchesSector;
    });
  }, [search, selectedSector]);

  // Limit displayed stocks for performance, show more when searching
  const displayedStocks = useMemo(() => {
    return search.length > 0 ? filteredStocks.slice(0, 50) : filteredStocks.slice(0, 30);
  }, [filteredStocks, search]);

  // Fetch live prices for displayed stocks
  const symbolsToFetch = useMemo(() => displayedStocks.map(s => s.symbol), [displayedStocks]);
  const { quotes, loading } = useBatchStockPrices(symbolsToFetch);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Market</span>
          <span className="text-xs text-muted-foreground font-normal">
            {allStocks.length} stocks
          </span>
        </CardTitle>
        <div className="space-y-2 mt-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stocks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedSector} onValueChange={setSelectedSector}>
            <SelectTrigger className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Sectors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              {sectors.map(sector => (
                <SelectItem key={sector} value={sector}>{sector}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
        {displayedStocks.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No stocks found</p>
        ) : (
          displayedStocks.map((stock, i) => {
            // Use live price if available, otherwise fall back to static price
            const liveQuote = quotes.get(stock.symbol);
            const displayPrice = liveQuote?.price || stock.price;
            const displayChange = liveQuote?.change ?? stock.change;
            const displayChangePercent = liveQuote?.changePercent ?? stock.changePercent;
            const isPositive = displayChange >= 0;
            const isSelected = selectedSymbol === stock.symbol;

            return (
              <motion.button
                key={stock.symbol}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i * 0.02, 0.5) }}
                onClick={() => onSelectStock({
                  ...stock,
                  price: displayPrice,
                  change: displayChange,
                  changePercent: displayChangePercent
                })}
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
                    <p className="font-semibold">
                      ${displayPrice.toFixed(2)}
                      {loading && !liveQuote && (
                        <span className="ml-1 text-xs text-muted-foreground">...</span>
                      )}
                    </p>
                    <div className={`flex items-center justify-end gap-1 text-sm ${isPositive ? 'text-profit' : 'text-loss'}`}>
                      {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      <span>
                        {isPositive ? '+' : ''}{displayChangePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })
        )}
        {filteredStocks.length > displayedStocks.length && (
          <p className="text-center text-xs text-muted-foreground py-2">
            Showing {displayedStocks.length} of {filteredStocks.length} stocks. Search to find more.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

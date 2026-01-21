import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle, Target, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Position } from '@/lib/stockData';
import { useBatchStockPrices } from '@/hooks/useStockPrices';
import { useMemo } from 'react';

interface PositionsListProps {
  positions: Position[];
  onSell: (symbol: string, shares: number) => void;
  onViewChart: (symbol: string) => void;
}

export function PositionsList({ positions, onSell, onViewChart }: PositionsListProps) {
  // Fetch live prices for all position symbols
  const symbols = useMemo(() => positions.map(p => p.symbol), [positions]);
  const { quotes, loading } = useBatchStockPrices(symbols);

  if (positions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No positions yet</p>
            <p className="text-sm">Start trading to build your portfolio!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          Your Positions
          {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <AnimatePresence mode="popLayout">
          {positions.map(position => {
            // Use live price if available, otherwise fall back to stored price
            const liveQuote = quotes.get(position.symbol);
            const currentPrice = liveQuote?.price && liveQuote.price > 0 
              ? liveQuote.price 
              : position.currentPrice;
            
            const value = position.shares * currentPrice;
            const cost = position.shares * position.avgPrice;
            const pnl = value - cost;
            const pnlPercent = (pnl / cost) * 100;
            const isPositive = pnl >= 0;

            return (
              <motion.div
                key={position.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <button
                      onClick={() => onViewChart(position.symbol)}
                      className="font-bold text-lg hover:text-primary transition-colors"
                    >
                      {position.symbol}
                    </button>
                    <p className="text-sm text-muted-foreground">{position.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${value.toFixed(2)}</p>
                    <div className={`flex items-center justify-end gap-1 text-sm ${isPositive ? 'text-profit' : 'text-loss'}`}>
                      {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      <span>{isPositive ? '+' : ''}${pnl.toFixed(2)} ({pnlPercent.toFixed(2)}%)</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                  <div>
                    <span className="text-muted-foreground">Shares</span>
                    <p className="font-medium">{position.shares}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Avg Cost</span>
                    <p className="font-medium">${position.avgPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Current</span>
                    <p className="font-medium">${currentPrice.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  {position.stopLoss && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-loss/10 text-loss text-xs rounded-full">
                      <AlertTriangle className="h-3 w-3" />
                      Stop: -{position.stopLoss}%
                    </span>
                  )}
                  {position.takeProfit && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-profit/10 text-profit text-xs rounded-full">
                      <Target className="h-3 w-3" />
                      Target: +{position.takeProfit}%
                    </span>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSell(position.symbol, position.shares)}
                  className="w-full hover:bg-loss hover:text-loss-foreground hover:border-loss"
                >
                  Sell All
                </Button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

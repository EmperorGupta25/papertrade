import { motion } from 'framer-motion';
import { History, ArrowUpRight, ArrowDownRight, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trade } from '@/lib/stockData';

interface TradeHistoryProps {
  trades: Trade[];
}

export function TradeHistory({ trades }: TradeHistoryProps) {
  if (trades.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5" />
            Trade History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No trades yet</p>
            <p className="text-sm">Your trade history will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <History className="h-5 w-5" />
          Trade History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
        {trades.slice(0, 20).map((trade, i) => (
          <motion.div
            key={trade.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                trade.type === 'buy' ? 'bg-profit/10' : 'bg-loss/10'
              }`}>
                {trade.type === 'buy' ? (
                  <ArrowUpRight className="h-4 w-4 text-profit" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-loss" />
                )}
              </div>
              <div>
                <p className="font-semibold">
                  {trade.type === 'buy' ? 'Bought' : 'Sold'} {trade.symbol}
                </p>
                <p className="text-sm text-muted-foreground">
                  {trade.shares} shares @ ${trade.price.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">${trade.total.toFixed(2)}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {trade.status === 'auto-closed' && (
                  <span className="flex items-center gap-1 text-amber-500">
                    <AlertCircle className="h-3 w-3" />
                    {trade.reason}
                  </span>
                )}
                {trade.status !== 'auto-closed' && (
                  <span>
                    {new Date(trade.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

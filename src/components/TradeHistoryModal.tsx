import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowUpRight, ArrowDownRight, AlertCircle, History, DollarSign } from 'lucide-react';
import { Trade } from '@/lib/stockData';

interface TradeHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trades: Trade[];
}

export function TradeHistoryModal({ open, onOpenChange, trades }: TradeHistoryModalProps) {
  const totalBuys = trades.filter(t => t.type === 'buy').reduce((sum, t) => sum + t.total, 0);
  const totalSells = trades.filter(t => t.type === 'sell').reduce((sum, t) => sum + t.total, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Complete Trade History
          </DialogTitle>
          <DialogDescription>
            All your trades in chronological order
          </DialogDescription>
        </DialogHeader>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 py-4 border-b">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Trades</p>
            <p className="text-2xl font-bold">{trades.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Bought</p>
            <p className="text-2xl font-bold text-profit">
              ${totalBuys.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Sold</p>
            <p className="text-2xl font-bold text-loss">
              ${totalSells.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <ScrollArea className="h-[400px] pr-4">
          {trades.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No trades yet</p>
              <p className="text-sm">Your trade history will appear here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {trades.map((trade, i) => (
                <motion.div
                  key={trade.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
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
                      {trade.status === 'auto-closed' ? (
                        <span className="flex items-center gap-1 text-amber-500">
                          <AlertCircle className="h-3 w-3" />
                          {trade.reason}
                        </span>
                      ) : (
                        <span>
                          {new Date(trade.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

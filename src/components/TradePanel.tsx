import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, AlertTriangle, Target, ShoppingCart, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Stock } from '@/lib/stockData';
import { toast } from 'sonner';

interface TradePanelProps {
  stock: Stock | null;
  balance: number;
  onBuy: (symbol: string, shares: number, stopLoss?: number, takeProfit?: number) => boolean;
  onSell: (symbol: string, shares: number) => boolean;
  ownedShares: number;
}

export function TradePanel({ stock, balance, onBuy, onSell, ownedShares }: TradePanelProps) {
  const [shares, setShares] = useState('1');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [enableStopLoss, setEnableStopLoss] = useState(false);
  const [stopLoss, setStopLoss] = useState('5');
  const [enableTakeProfit, setEnableTakeProfit] = useState(false);
  const [takeProfit, setTakeProfit] = useState('10');

  if (!stock) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Select a stock to trade</p>
        </CardContent>
      </Card>
    );
  }

  const shareCount = parseInt(shares) || 0;
  const total = shareCount * stock.price;
  const canAfford = total <= balance;
  const canSell = ownedShares >= shareCount;

  const handleTrade = () => {
    if (shareCount <= 0) {
      toast.error('Enter a valid number of shares');
      return;
    }

    if (tradeType === 'buy') {
      if (!canAfford) {
        toast.error('Insufficient funds');
        return;
      }
      const success = onBuy(
        stock.symbol,
        shareCount,
        enableStopLoss ? parseFloat(stopLoss) : undefined,
        enableTakeProfit ? parseFloat(takeProfit) : undefined
      );
      if (success) {
        toast.success(`Bought ${shareCount} shares of ${stock.symbol}`, {
          description: `Total: $${total.toFixed(2)}`,
        });
        setShares('1');
      }
    } else {
      if (!canSell) {
        toast.error(`You only own ${ownedShares} shares`);
        return;
      }
      const success = onSell(stock.symbol, shareCount);
      if (success) {
        toast.success(`Sold ${shareCount} shares of ${stock.symbol}`, {
          description: `Total: $${total.toFixed(2)}`,
        });
        setShares('1');
      }
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Trade {stock.symbol}</span>
          <span className="text-2xl font-bold">${stock.price.toFixed(2)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-1 p-1 bg-secondary rounded-lg">
          <Button
            variant={tradeType === 'buy' ? 'default' : 'ghost'}
            className={`flex-1 ${tradeType === 'buy' ? 'gradient-green text-primary-foreground' : ''}`}
            onClick={() => setTradeType('buy')}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Buy
          </Button>
          <Button
            variant={tradeType === 'sell' ? 'destructive' : 'ghost'}
            className="flex-1"
            onClick={() => setTradeType('sell')}
          >
            <TrendingDown className="h-4 w-4 mr-2" />
            Sell
          </Button>
        </div>

        {tradeType === 'sell' && ownedShares > 0 && (
          <p className="text-sm text-muted-foreground">
            You own <span className="font-semibold text-foreground">{ownedShares}</span> shares
          </p>
        )}

        <div>
          <Label htmlFor="shares">Number of Shares</Label>
          <Input
            id="shares"
            type="number"
            min="1"
            value={shares}
            onChange={e => setShares(e.target.value)}
            className="mt-1"
          />
        </div>

        {tradeType === 'buy' && (
          <>
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-loss" />
                <span className="text-sm">Stop Loss</span>
              </div>
              <div className="flex items-center gap-2">
                {enableStopLoss && (
                  <Input
                    type="number"
                    min="1"
                    max="50"
                    value={stopLoss}
                    onChange={e => setStopLoss(e.target.value)}
                    className="w-16 h-8 text-center"
                  />
                )}
                <span className="text-sm text-muted-foreground">%</span>
                <Switch checked={enableStopLoss} onCheckedChange={setEnableStopLoss} />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-profit" />
                <span className="text-sm">Take Profit</span>
              </div>
              <div className="flex items-center gap-2">
                {enableTakeProfit && (
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={takeProfit}
                    onChange={e => setTakeProfit(e.target.value)}
                    className="w-16 h-8 text-center"
                  />
                )}
                <span className="text-sm text-muted-foreground">%</span>
                <Switch checked={enableTakeProfit} onCheckedChange={setEnableTakeProfit} />
              </div>
            </div>
          </>
        )}

        <div className="p-4 bg-secondary rounded-lg">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Estimated {tradeType === 'buy' ? 'Cost' : 'Return'}</span>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span className="font-bold text-lg">{total.toFixed(2)}</span>
            </div>
          </div>
          {tradeType === 'buy' && (
            <p className="text-xs text-muted-foreground">
              Available: ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          )}
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            className={`w-full ${
              tradeType === 'buy'
                ? 'gradient-green text-primary-foreground hover:opacity-90'
                : 'bg-loss hover:bg-loss/90 text-destructive-foreground'
            }`}
            size="lg"
            onClick={handleTrade}
            disabled={tradeType === 'buy' ? !canAfford : !canSell}
          >
            {tradeType === 'buy' ? 'Buy' : 'Sell'} {shareCount} {shareCount === 1 ? 'Share' : 'Shares'}
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}

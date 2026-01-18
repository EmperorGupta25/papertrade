import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PortfolioCardProps {
  totalValue: number;
  portfolioValue: number;
  balance: number;
  totalPnL: number;
  totalPnLPercent: number;
  initialBalance: number;
}

export function PortfolioCard({
  totalValue,
  portfolioValue,
  balance,
  totalPnL,
  totalPnLPercent,
}: PortfolioCardProps) {
  const isPositive = totalPnL >= 0;

  return (
    <Card className="overflow-hidden">
      <div className={`h-1 ${isPositive ? 'gradient-green' : 'bg-loss'}`} />
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <PieChart className="h-5 w-5 text-primary" />
          Portfolio Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Total Value</p>
          <motion.p
            key={totalValue}
            initial={{ scale: 1.02 }}
            animate={{ scale: 1 }}
            className="text-4xl font-bold"
          >
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </motion.p>
          <div className={`flex items-center gap-1 mt-1 ${isPositive ? 'text-profit' : 'text-loss'}`}>
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span className="font-medium">
              {isPositive ? '+' : ''}${totalPnL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              ({isPositive ? '+' : ''}{totalPnLPercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-secondary/50 rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm">Cash</span>
            </div>
            <p className="text-lg font-semibold">
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <PieChart className="h-4 w-4" />
              <span className="text-sm">Invested</span>
            </div>
            <p className="text-lg font-semibold">
              ${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

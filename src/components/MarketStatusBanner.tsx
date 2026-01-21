import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, TrendingUp, Moon, Sun } from 'lucide-react';
import { getMarketStatus, formatTimeUntil, MarketStatus } from '@/lib/marketHours';

export function MarketStatusBanner() {
  const [status, setStatus] = useState<MarketStatus>(getMarketStatus());

  useEffect(() => {
    // Update every minute
    const interval = setInterval(() => {
      setStatus(getMarketStatus());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status.status) {
      case 'open':
        return 'bg-profit/10 border-profit/20 text-profit';
      case 'pre-market':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-500';
      case 'after-hours':
        return 'bg-purple-500/10 border-purple-500/20 text-purple-500';
      default:
        return 'bg-muted border-border text-muted-foreground';
    }
  };

  const getIcon = () => {
    switch (status.status) {
      case 'open':
        return <TrendingUp className="h-3.5 w-3.5" />;
      case 'pre-market':
        return <Sun className="h-3.5 w-3.5" />;
      case 'after-hours':
        return <Moon className="h-3.5 w-3.5" />;
      default:
        return <Clock className="h-3.5 w-3.5" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor()}`}
    >
      {getIcon()}
      <span>{status.message}</span>
      {status.nextOpen && !status.isOpen && (
        <span className="opacity-70">
          • Opens in {formatTimeUntil(status.nextOpen)}
        </span>
      )}
      {status.nextClose && status.isOpen && (
        <span className="opacity-70">
          • Closes in {formatTimeUntil(status.nextClose)}
        </span>
      )}
    </motion.div>
  );
}

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

  // Only show detailed info when market is open or in extended hours
  const showDetails = status.status !== 'closed';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium border ${getStatusColor()}`}
      title={status.message}
    >
      {getIcon()}
      <span className="hidden sm:inline">
        {status.status === 'open' ? 'Open' : status.status === 'closed' ? 'Closed' : status.message}
      </span>
      {showDetails && status.nextClose && status.isOpen && (
        <span className="opacity-70 hidden md:inline">
          • {formatTimeUntil(status.nextClose)}
        </span>
      )}
    </motion.div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { Position, Trade, allStocks, getUpdatedPrice } from '@/lib/stockData';

const DEFAULT_INITIAL_BALANCE = 10000;

export function usePortfolio() {
  const [initialBalance, setInitialBalance] = useState(() => {
    const saved = localStorage.getItem('mockPortfolio_initialBalance');
    return saved ? parseFloat(saved) : DEFAULT_INITIAL_BALANCE;
  });

  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('mockPortfolio_balance');
    return saved ? parseFloat(saved) : DEFAULT_INITIAL_BALANCE;
  });

  const [positions, setPositions] = useState<Position[]>(() => {
    const saved = localStorage.getItem('mockPortfolio_positions');
    return saved ? JSON.parse(saved) : [];
  });

  const [trades, setTrades] = useState<Trade[]>(() => {
    const saved = localStorage.getItem('mockPortfolio_trades');
    return saved ? JSON.parse(saved).map((t: Trade) => ({ ...t, timestamp: new Date(t.timestamp) })) : [];
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('mockPortfolio_balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('mockPortfolio_initialBalance', initialBalance.toString());
  }, [initialBalance]);

  useEffect(() => {
    localStorage.setItem('mockPortfolio_positions', JSON.stringify(positions));
  }, [positions]);

  useEffect(() => {
    localStorage.setItem('mockPortfolio_trades', JSON.stringify(trades));
  }, [trades]);

  // Update prices and check stop-loss/take-profit
  useEffect(() => {
    const interval = setInterval(() => {
      setPositions(prev => {
        const updated = prev.map(pos => {
          const { price } = getUpdatedPrice(pos.currentPrice);
          return { ...pos, currentPrice: price };
        });

        // Check for auto-close conditions
        updated.forEach(pos => {
          const pnlPercent = ((pos.currentPrice - pos.avgPrice) / pos.avgPrice) * 100;
          
          if (pos.stopLoss && pnlPercent <= -pos.stopLoss) {
            autoCloseTrade(pos, 'stop-loss');
          } else if (pos.takeProfit && pnlPercent >= pos.takeProfit) {
            autoCloseTrade(pos, 'take-profit');
          }
        });

        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const autoCloseTrade = useCallback((position: Position, reason: string) => {
    const total = position.shares * position.currentPrice;
    
    setBalance(prev => prev + total);
    setPositions(prev => prev.filter(p => p.id !== position.id));
    
    const trade: Trade = {
      id: Date.now().toString(),
      symbol: position.symbol,
      type: 'sell',
      shares: position.shares,
      price: position.currentPrice,
      total,
      timestamp: new Date(),
      status: 'auto-closed',
      reason,
    };
    
    setTrades(prev => [trade, ...prev]);
  }, []);

  const buyStock = useCallback((
    symbol: string,
    shares: number,
    stopLoss?: number,
    takeProfit?: number
  ) => {
    const stock = allStocks.find(s => s.symbol === symbol);
    if (!stock) return false;

    const total = stock.price * shares;
    if (total > balance) return false;

    setBalance(prev => prev - total);

    setPositions(prev => {
      const existing = prev.find(p => p.symbol === symbol);
      if (existing) {
        const totalShares = existing.shares + shares;
        const avgPrice = ((existing.shares * existing.avgPrice) + (shares * stock.price)) / totalShares;
        return prev.map(p => p.symbol === symbol ? {
          ...p,
          shares: totalShares,
          avgPrice,
          stopLoss: stopLoss || p.stopLoss,
          takeProfit: takeProfit || p.takeProfit,
        } : p);
      }
      return [...prev, {
        id: Date.now().toString(),
        symbol,
        name: stock.name,
        shares,
        avgPrice: stock.price,
        currentPrice: stock.price,
        stopLoss,
        takeProfit,
      }];
    });

    const trade: Trade = {
      id: Date.now().toString(),
      symbol,
      type: 'buy',
      shares,
      price: stock.price,
      total,
      timestamp: new Date(),
      status: 'completed',
    };
    setTrades(prev => [trade, ...prev]);
    return true;
  }, [balance]);

  const sellStock = useCallback((symbol: string, shares: number) => {
    const position = positions.find(p => p.symbol === symbol);
    if (!position || position.shares < shares) return false;

    const total = position.currentPrice * shares;
    setBalance(prev => prev + total);

    setPositions(prev => {
      if (position.shares === shares) {
        return prev.filter(p => p.symbol !== symbol);
      }
      return prev.map(p => p.symbol === symbol ? {
        ...p,
        shares: p.shares - shares,
      } : p);
    });

    const trade: Trade = {
      id: Date.now().toString(),
      symbol,
      type: 'sell',
      shares,
      price: position.currentPrice,
      total,
      timestamp: new Date(),
      status: 'completed',
    };
    setTrades(prev => [trade, ...prev]);
    return true;
  }, [positions]);

  const resetPortfolio = useCallback((newBalance: number = DEFAULT_INITIAL_BALANCE) => {
    setBalance(newBalance);
    setInitialBalance(newBalance);
    setPositions([]);
    setTrades([]);
  }, []);

  const portfolioValue = positions.reduce((sum, p) => sum + (p.shares * p.currentPrice), 0);
  const totalValue = balance + portfolioValue;
  const totalPnL = totalValue - initialBalance;
  const totalPnLPercent = (totalPnL / initialBalance) * 100;

  return {
    balance,
    positions,
    trades,
    portfolioValue,
    totalValue,
    totalPnL,
    totalPnLPercent,
    buyStock,
    sellStock,
    resetPortfolio,
    initialBalance,
  };
}

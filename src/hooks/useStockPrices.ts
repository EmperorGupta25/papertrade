import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  timestamp: number;
}

interface PriceCache {
  [symbol: string]: {
    quote: StockQuote;
    fetchedAt: number;
  };
}

const CACHE_DURATION = 5000; // 5 seconds cache
const priceCache: PriceCache = {};

export function useStockPrice(symbol: string | null) {
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrice = useCallback(async () => {
    if (!symbol) return;

    // Check cache
    const cached = priceCache[symbol];
    if (cached && Date.now() - cached.fetchedAt < CACHE_DURATION) {
      setQuote(cached.quote);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('stock-prices', {
        body: null,
        headers: { 'Content-Type': 'application/json' },
        method: 'GET',
      });

      // Use URL parameters instead
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stock-prices?action=quote&symbol=${symbol}`,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch price');
      
      const quoteData = await response.json();
      
      if (quoteData.price > 0) {
        priceCache[symbol] = {
          quote: quoteData,
          fetchedAt: Date.now()
        };
        setQuote(quoteData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch price');
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    fetchPrice();
    
    // Refresh every 10 seconds
    const interval = setInterval(fetchPrice, 10000);
    return () => clearInterval(interval);
  }, [fetchPrice]);

  return { quote, loading, error, refetch: fetchPrice };
}

export function useBatchStockPrices(symbols: string[]) {
  const [quotes, setQuotes] = useState<Map<string, StockQuote>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchingRef = useRef(false);

  const fetchPrices = useCallback(async () => {
    if (symbols.length === 0 || fetchingRef.current) return;

    // Filter out cached symbols
    const uncachedSymbols = symbols.filter(sym => {
      const cached = priceCache[sym];
      return !cached || Date.now() - cached.fetchedAt >= CACHE_DURATION;
    });

    // Return cached results if all symbols are cached
    if (uncachedSymbols.length === 0) {
      const cachedQuotes = new Map<string, StockQuote>();
      symbols.forEach(sym => {
        if (priceCache[sym]) {
          cachedQuotes.set(sym, priceCache[sym].quote);
        }
      });
      setQuotes(cachedQuotes);
      return;
    }

    fetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      // Batch fetch in chunks of 30
      const chunks: string[][] = [];
      for (let i = 0; i < uncachedSymbols.length; i += 30) {
        chunks.push(uncachedSymbols.slice(i, i + 30));
      }

      const allQuotes = new Map<string, StockQuote>();
      
      // Add cached quotes first
      symbols.forEach(sym => {
        if (priceCache[sym] && Date.now() - priceCache[sym].fetchedAt < CACHE_DURATION) {
          allQuotes.set(sym, priceCache[sym].quote);
        }
      });

      for (const chunk of chunks) {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stock-prices?action=batch&symbols=${chunk.join(',')}`,
          {
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
              'Content-Type': 'application/json',
            }
          }
        );

        if (!response.ok) continue;
        
        const data = await response.json();
        
        if (data.quotes) {
          data.quotes.forEach((q: StockQuote & { error?: boolean }) => {
            if (!q.error && q.price > 0) {
              priceCache[q.symbol] = {
                quote: q,
                fetchedAt: Date.now()
              };
              allQuotes.set(q.symbol, q);
            }
          });
        }

        // Small delay between chunks to avoid rate limits
        if (chunks.indexOf(chunk) < chunks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      setQuotes(allQuotes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prices');
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [symbols.join(',')]);

  useEffect(() => {
    fetchPrices();
    
    // Refresh every 15 seconds for batch
    const interval = setInterval(fetchPrices, 15000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  return { quotes, loading, error, refetch: fetchPrices };
}

export function useStockCandles(
  symbol: string | null,
  resolution: '1' | '5' | '15' | '30' | '60' | 'D' | 'W' | 'M' = 'D',
  days: number = 30
) {
  const [candles, setCandles] = useState<Array<{
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCandles = useCallback(async () => {
    if (!symbol) return;

    setLoading(true);
    setError(null);

    try {
      const now = Math.floor(Date.now() / 1000);
      const from = now - (days * 24 * 60 * 60);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stock-prices?action=candles&symbol=${symbol}&resolution=${resolution}&from=${from}&to=${now}`,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch candles');
      
      const data = await response.json();
      
      if (data.candles) {
        setCandles(data.candles);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch candles');
    } finally {
      setLoading(false);
    }
  }, [symbol, resolution, days]);

  useEffect(() => {
    fetchCandles();
  }, [fetchCandles]);

  return { candles, loading, error, refetch: fetchCandles };
}

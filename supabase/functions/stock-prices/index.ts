import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Simple in-memory cache to reduce upstream calls and gracefully handle upstream rate limits.
// Note: Edge runtime instances may be recycled, so this cache is best-effort only.
const QUOTE_CACHE_TTL_MS = 60_000;
type CachedQuote = {
  payload: {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    high: number;
    low: number;
    open: number;
    previousClose: number;
    timestamp: number;
  };
  fetchedAt: number;
};
const quoteCache = new Map<string, CachedQuote>();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface QuoteResponse {
  c: number;  // Current price
  d: number;  // Change
  dp: number; // Percent change
  h: number;  // High price of the day
  l: number;  // Low price of the day
  o: number;  // Open price of the day
  pc: number; // Previous close price
  t: number;  // Timestamp
}

interface CandleResponse {
  c: number[];  // Close prices
  h: number[];  // High prices
  l: number[];  // Low prices
  o: number[];  // Open prices
  t: number[];  // Timestamps
  v: number[];  // Volume
  s: string;    // Status
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const FINNHUB_API_KEY = Deno.env.get('FINNHUB_API_KEY')
    if (!FINNHUB_API_KEY) {
      throw new Error('FINNHUB_API_KEY not configured')
    }

    const url = new URL(req.url)
    const action = url.searchParams.get('action') || 'quote'
    const symbol = url.searchParams.get('symbol')
    const symbols = url.searchParams.get('symbols') // comma-separated list
    const resolution = url.searchParams.get('resolution') || 'D' // D, W, M, 1, 5, 15, 30, 60
    const from = url.searchParams.get('from')
    const to = url.searchParams.get('to')

    // Get single quote
    if (action === 'quote' && symbol) {
      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
      )

      // If we are rate-limited, serve cached data if available.
      if (response.status === 429) {
        const cached = quoteCache.get(symbol);
        if (cached && Date.now() - cached.fetchedAt < QUOTE_CACHE_TTL_MS) {
          return new Response(
            JSON.stringify({ ...cached.payload, rateLimited: true, cached: true }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // No cache available — return a soft response (200) so clients don't crash.
        return new Response(JSON.stringify({ symbol, rateLimited: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (!response.ok) {
        const bodyText = await response.text().catch(() => '')
        return new Response(
          JSON.stringify({
            error: 'Upstream quote request failed',
            status: response.status,
            body: bodyText,
          }),
          {
            status: 502,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      const data: QuoteResponse = await response.json()

      // Finnhub sometimes returns an error object (or empty payload) with 200.
      // Validate the expected numeric fields before mapping.
      if (typeof data?.c !== 'number' || typeof data?.t !== 'number') {
        return new Response(
          JSON.stringify({
            error: 'Invalid quote payload from upstream',
            symbol,
            upstream: data,
          }),
          {
            status: 502,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }
      
      const payload = {
        symbol,
        price: data.c,
        change: data.d,
        changePercent: data.dp,
        high: data.h,
        low: data.l,
        open: data.o,
        previousClose: data.pc,
        timestamp: data.t * 1000
      }

      quoteCache.set(symbol, { payload, fetchedAt: Date.now() })

      return new Response(JSON.stringify(payload), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get multiple quotes (batch)
    if (action === 'batch' && symbols) {
      const symbolList = symbols.split(',').slice(0, 30) // Limit to 30 to avoid rate limits
      const quotes = await Promise.all(
        symbolList.map(async (sym) => {
          try {
            const trimmed = sym.trim()
            const response = await fetch(
              `https://finnhub.io/api/v1/quote?symbol=${trimmed}&token=${FINNHUB_API_KEY}`
            )

            if (response.status === 429) {
              const cached = quoteCache.get(trimmed)
              if (cached && Date.now() - cached.fetchedAt < QUOTE_CACHE_TTL_MS) {
                return { ...cached.payload, rateLimited: true, cached: true }
              }
              return { symbol: trimmed, rateLimited: true, error: true }
            }

            if (!response.ok) {
              const bodyText = await response.text().catch(() => '')
              return {
                symbol: trimmed,
                error: true,
                status: response.status,
                body: bodyText,
              }
            }

            const data: QuoteResponse = await response.json()

            if (typeof data?.c !== 'number' || typeof data?.t !== 'number') {
              return {
                symbol: trimmed,
                error: true,
                upstream: data,
              }
            }

            const payload = {
              symbol: trimmed,
              price: data.c,
              change: data.d,
              changePercent: data.dp,
              high: data.h,
              low: data.l,
              open: data.o,
              previousClose: data.pc,
              timestamp: data.t * 1000
            }

            quoteCache.set(trimmed, { payload, fetchedAt: Date.now() })
            return payload
          } catch {
            return { symbol: sym.trim(), error: true }
          }
        })
      )
      
      return new Response(JSON.stringify({ quotes }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get candles for charts
    if (action === 'candles' && symbol && from && to) {
      const response = await fetch(
        `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`
      )

      if (!response.ok) {
        const bodyText = await response.text().catch(() => '')
        return new Response(
          JSON.stringify({
            error: 'Upstream candles request failed',
            status: response.status,
            body: bodyText,
          }),
          {
            status: 502,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      const data: CandleResponse = await response.json()
      
      if (data.s === 'no_data') {
        return new Response(JSON.stringify({ candles: [], status: 'no_data' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      if (data.s !== 'ok' || !Array.isArray(data.t) || !Array.isArray(data.c)) {
        return new Response(
          JSON.stringify({
            error: 'Invalid candles payload from upstream',
            symbol,
            upstream: data,
          }),
          {
            status: 502,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      const candles = data.t?.map((timestamp, i) => ({
        time: timestamp * 1000,
        open: data.o[i],
        high: data.h[i],
        low: data.l[i],
        close: data.c[i],
        volume: data.v[i]
      })) || []

      return new Response(JSON.stringify({ candles, status: 'ok' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ error: 'Invalid request. Provide action (quote, batch, candles) and required parameters.' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

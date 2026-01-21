import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
      const data: QuoteResponse = await response.json()
      
      return new Response(JSON.stringify({
        symbol,
        price: data.c,
        change: data.d,
        changePercent: data.dp,
        high: data.h,
        low: data.l,
        open: data.o,
        previousClose: data.pc,
        timestamp: data.t * 1000
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get multiple quotes (batch)
    if (action === 'batch' && symbols) {
      const symbolList = symbols.split(',').slice(0, 30) // Limit to 30 to avoid rate limits
      const quotes = await Promise.all(
        symbolList.map(async (sym) => {
          try {
            const response = await fetch(
              `https://finnhub.io/api/v1/quote?symbol=${sym.trim()}&token=${FINNHUB_API_KEY}`
            )
            const data: QuoteResponse = await response.json()
            return {
              symbol: sym.trim(),
              price: data.c,
              change: data.d,
              changePercent: data.dp,
              high: data.h,
              low: data.l,
              open: data.o,
              previousClose: data.pc,
              timestamp: data.t * 1000
            }
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
      const data: CandleResponse = await response.json()
      
      if (data.s === 'no_data') {
        return new Response(JSON.stringify({ candles: [], status: 'no_data' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
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

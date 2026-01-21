-- Fix: Trading strategies exposure in competition_participants
-- Create a secure view that hides trades/positions from other participants

-- First, drop the existing leaderboard view if it exists (we'll recreate it properly)
DROP VIEW IF EXISTS public.competition_leaderboard;

-- Create a secure view for competition participants that hides sensitive trading data
-- Users can see their own full data, but only see display_name and balance for others
CREATE VIEW public.competition_leaderboard
WITH (security_invoker = on) AS
SELECT 
  cp.id,
  cp.competition_id,
  cp.user_id,
  cp.display_name,
  cp.balance,
  cp.status,
  cp.joined_at,
  cp.created_at,
  cp.updated_at,
  -- Only show positions/trades if the viewer is the owner of this record
  CASE WHEN cp.user_id = auth.uid() THEN cp.positions ELSE '[]'::jsonb END as positions,
  CASE WHEN cp.user_id = auth.uid() THEN cp.trades ELSE '[]'::jsonb END as trades
FROM public.competition_participants cp;

-- Grant access to the view
GRANT SELECT ON public.competition_leaderboard TO authenticated;

-- Add a comment explaining the security measure
COMMENT ON VIEW public.competition_leaderboard IS 
'Secure view that exposes competition participant data while hiding trading strategies (positions/trades) from other participants. Users can only see their own detailed trading data.';
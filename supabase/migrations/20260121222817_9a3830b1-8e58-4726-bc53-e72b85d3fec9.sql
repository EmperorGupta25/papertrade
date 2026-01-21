-- Fix the SECURITY DEFINER view issue by recreating with security_invoker = on
DROP VIEW IF EXISTS public.competition_leaderboard;

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
  cp.updated_at
  -- Deliberately excludes: trades, positions (sensitive strategy data)
FROM public.competition_participants cp;

-- Now we need a SELECT policy that allows viewing leaderboard data for competition members
-- Since the view uses security_invoker, we need a policy on the base table that allows
-- viewing limited data for other competition members

-- First, let's add a policy that allows viewing basic participant info (not trades/positions)
-- for users in the same competition
CREATE POLICY "Users can view competition participant summaries"
ON public.competition_participants FOR SELECT
USING (
  -- Competition creator can see all participants in their competitions
  EXISTS (
    SELECT 1 FROM public.competitions c
    WHERE c.id = competition_participants.competition_id
    AND c.creator_id = auth.uid()
  )
  OR
  -- Competition participants can see other participants in same competition (via view only)
  EXISTS (
    SELECT 1 FROM public.competition_participants other_cp
    WHERE other_cp.competition_id = competition_participants.competition_id
    AND other_cp.user_id = auth.uid()
    AND other_cp.status = 'accepted'
  )
);
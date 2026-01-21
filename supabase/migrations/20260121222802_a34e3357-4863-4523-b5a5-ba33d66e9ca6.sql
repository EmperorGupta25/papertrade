-- Fix 1: Update handle_new_user() function with input validation for display_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  validated_display_name text;
BEGIN
  -- Validate and sanitize display_name with length limit and trimming
  validated_display_name := COALESCE(
    NULLIF(
      LEFT(TRIM(NEW.raw_user_meta_data->>'display_name'), 50),
      ''
    ),
    LEFT(split_part(NEW.email, '@', 1), 50)
  );
  
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, validated_display_name);
  
  INSERT INTO public.user_portfolios (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail user creation
  RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix 2: Create helper function to check if users are friends
CREATE OR REPLACE FUNCTION public.are_friends(_user_id_1 uuid, _user_id_2 uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.friends
    WHERE status = 'accepted'
    AND (
      (user_id = _user_id_1 AND friend_id = _user_id_2)
      OR (user_id = _user_id_2 AND friend_id = _user_id_1)
    )
  )
$$;

-- Fix 3: Create helper function to check if users are in same competition
CREATE OR REPLACE FUNCTION public.in_same_competition(_user_id_1 uuid, _user_id_2 uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.competition_participants cp1
    JOIN public.competition_participants cp2 
      ON cp1.competition_id = cp2.competition_id
    WHERE cp1.user_id = _user_id_1 
      AND cp2.user_id = _user_id_2
      AND cp1.status = 'accepted'
      AND cp2.status = 'accepted'
  )
$$;

-- Fix 4: Add policy to allow viewing display_name for friends and competition participants
-- First drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create new policies: own profile OR friends/competition members
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can view friends profiles"
ON public.profiles FOR SELECT
USING (public.are_friends(auth.uid(), user_id));

CREATE POLICY "Users can view competition members profiles"
ON public.profiles FOR SELECT
USING (public.in_same_competition(auth.uid(), user_id));

-- Fix 5: Create a view for competition leaderboard that hides sensitive trading data
CREATE OR REPLACE VIEW public.competition_leaderboard AS
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

-- Fix 6: Drop overly permissive SELECT policy on competition_participants
DROP POLICY IF EXISTS "Users can view participants of their competitions" ON public.competition_participants;

-- Create restrictive policy: users can only see their OWN detailed participation data
CREATE POLICY "Users can view their own participation details"
ON public.competition_participants FOR SELECT
USING (auth.uid() = user_id);

-- Create policy allowing competition creators to see participant IDs (not details)
-- This is handled through the leaderboard view instead
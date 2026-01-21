-- Friends table for user relationships
CREATE TABLE public.friends (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  friend_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, friend_id)
);

-- Enable RLS on friends
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;

-- Friends policies
CREATE POLICY "Users can view their own friend requests"
ON public.friends FOR SELECT
USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can send friend requests"
ON public.friends FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update friend requests they received"
ON public.friends FOR UPDATE
USING (auth.uid() = friend_id);

CREATE POLICY "Users can delete their own friend relationships"
ON public.friends FOR DELETE
USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Competitions table
CREATE TABLE public.competitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  creator_id UUID NOT NULL,
  starting_balance NUMERIC NOT NULL DEFAULT 10000,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  max_participants INTEGER NOT NULL DEFAULT 10 CHECK (max_participants <= 10 AND max_participants >= 2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on competitions
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;

-- Competition participants table
CREATE TABLE public.competition_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  display_name TEXT,
  balance NUMERIC NOT NULL DEFAULT 10000,
  positions JSONB NOT NULL DEFAULT '[]'::jsonb,
  trades JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'invited' CHECK (status IN ('invited', 'accepted', 'declined', 'left')),
  joined_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(competition_id, user_id)
);

-- Enable RLS on competition_participants
ALTER TABLE public.competition_participants ENABLE ROW LEVEL SECURITY;

-- Competitions policies
CREATE POLICY "Users can view competitions they are part of"
ON public.competitions FOR SELECT
USING (
  creator_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.competition_participants 
    WHERE competition_id = id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can create competitions"
ON public.competitions FOR INSERT
WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their competitions"
ON public.competitions FOR UPDATE
USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their pending competitions"
ON public.competitions FOR DELETE
USING (auth.uid() = creator_id AND status = 'pending');

-- Competition participants policies
CREATE POLICY "Users can view participants of their competitions"
ON public.competition_participants FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.competitions c
    WHERE c.id = competition_id AND (
      c.creator_id = auth.uid() OR
      EXISTS (SELECT 1 FROM public.competition_participants cp WHERE cp.competition_id = c.id AND cp.user_id = auth.uid())
    )
  )
);

CREATE POLICY "Competition creators can add participants"
ON public.competition_participants FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.competitions c
    WHERE c.id = competition_id AND c.creator_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own participation"
ON public.competition_participants FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can leave competitions"
ON public.competition_participants FOR DELETE
USING (user_id = auth.uid());

-- Triggers for updated_at
CREATE TRIGGER update_friends_updated_at
BEFORE UPDATE ON public.friends
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_competitions_updated_at
BEFORE UPDATE ON public.competitions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_competition_participants_updated_at
BEFORE UPDATE ON public.competition_participants
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
-- Allow users to find other profiles by display_name for friend requests
CREATE POLICY "Users can search profiles by display name"
ON public.profiles
FOR SELECT
USING (true);
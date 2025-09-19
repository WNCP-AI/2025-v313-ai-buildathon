-- Replace the complex operator profile visibility policy with a simple public viewing policy
-- This allows everyone to view all profiles (which only contain safe public information)

DROP POLICY IF EXISTS "Public can view operator profiles for active listings" ON public.profiles;

CREATE POLICY "Public can view all profiles" ON public.profiles
FOR SELECT USING (true);
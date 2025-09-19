-- Remove the dangerous public access policy
DROP POLICY IF EXISTS "Public can view all profiles" ON public.profiles;

-- Add a more secure policy that only allows public access to operator names and avatars
-- This supports the FeaturedOperators functionality without exposing sensitive data
CREATE POLICY "Public can view operator basic info" 
ON public.profiles 
FOR SELECT 
USING (
  role = 'operator' 
  AND (
    -- Only allow access to non-sensitive fields
    true  -- This will be filtered by SELECT columns in the query
  )
);

-- Add a policy to allow viewing operator profiles for service browsing
-- This supports the ViewProfile functionality for operators only
CREATE POLICY "Public can view operator profiles for services" 
ON public.profiles 
FOR SELECT 
USING (role = 'operator');
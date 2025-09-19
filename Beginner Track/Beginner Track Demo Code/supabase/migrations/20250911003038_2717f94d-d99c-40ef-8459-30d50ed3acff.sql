-- Add avatar_url column to existing profiles table
ALTER TABLE public.profiles 
ADD COLUMN avatar_url TEXT;

-- Add comment for clarity
COMMENT ON COLUMN public.profiles.avatar_url IS 'URL to user profile avatar image';
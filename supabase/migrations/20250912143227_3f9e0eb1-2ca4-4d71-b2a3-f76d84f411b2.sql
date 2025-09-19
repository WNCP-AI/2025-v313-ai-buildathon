-- Add RLS policy to allow public access to operator profiles when viewing listings
CREATE POLICY "Public can view operator profiles for active listings" 
ON public.profiles 
FOR SELECT 
USING (
  role = 'operator' AND EXISTS (
    SELECT 1 FROM public.listings 
    WHERE listings.operator_id = profiles.user_id 
    AND listings.is_active = true
  )
);

-- Create trigger to automatically create profiles for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, phone, role, bio, is_ai_generated)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    NEW.raw_user_meta_data->>'phone',
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'consumer'),
    NULL,
    COALESCE((NEW.raw_user_meta_data->>'is_ai_generated')::boolean, FALSE)
  );
  RETURN NEW;
END;
$$;

-- Create trigger for automatic profile creation on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
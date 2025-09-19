-- Add is_ai_generated flag to profiles table
ALTER TABLE public.profiles ADD COLUMN is_ai_generated BOOLEAN DEFAULT FALSE;

-- Update the trigger function to handle AI-generated users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, phone, role, bio, is_ai_generated)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'phone',
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'consumer'),
    NULL,
    COALESCE((NEW.raw_user_meta_data->>'is_ai_generated')::boolean, FALSE)
  );
  RETURN NEW;
END;
$$;
-- Idempotent seed for reference data and minimal mock data

-- Service areas (Detroit metro). Uses unique(name) to avoid duplicates.
INSERT INTO service_areas (name, center_lat, center_lng, radius_miles)
VALUES
  ('Downtown Detroit', 42.3314, -83.0458, 5),
  ('Midtown Detroit', 42.3564, -83.0666, 3),
  ('Corktown', 42.3316, -83.0625, 2),
  ('Royal Oak', 42.4895, -83.1446, 4),
  ('Birmingham', 42.5468, -83.2113, 3),
  ('Dearborn', 42.3223, -83.1763, 5),
  ('Grosse Pointe', 42.3861, -82.9116, 3),
  ('Ferndale', 42.4604, -83.1345, 2)
ON CONFLICT (name) DO NOTHING;

-- If at least one user exists, create a provider & listings for them
DO $$
DECLARE
  first_user UUID;
  new_provider UUID;
BEGIN
  SELECT id INTO first_user FROM auth.users ORDER BY created_at ASC LIMIT 1;

  IF first_user IS NULL THEN
    RAISE NOTICE 'No users in auth.users; skipping provider/listing mock data';
    RETURN;
  END IF;

  -- Ensure a profile exists (usually created by trigger)
  INSERT INTO profiles (id, email)
  SELECT u.id, COALESCE(u.email, CONCAT('user-', u.id::text, '@example.com'))
  FROM auth.users u
  WHERE u.id = first_user
  ON CONFLICT (id) DO NOTHING;

  -- Create provider for this user if not present
  INSERT INTO providers (user_id, type, certifications, service_areas, verified, rating, completed_jobs)
  VALUES (first_user, 'courier', ARRAY['food_handling_cert'], ARRAY['Downtown Detroit','Midtown Detroit'], true, 4.80, 27)
  ON CONFLICT (user_id) DO NOTHING;

  -- Get provider id
  SELECT id INTO new_provider FROM providers WHERE user_id = first_user;

  IF new_provider IS NULL THEN
    RAISE NOTICE 'Provider not created; skipping listings';
    RETURN;
  END IF;

  -- Two sample listings
  INSERT INTO listings (provider_id, title, description, category, price_base, price_per_mile, price_per_minute, service_radius_miles, active, images)
  VALUES
    (new_provider, 'Downtown Courier - Small Parcels', 'Fast delivery for envelopes and small boxes.', 'courier', 15.00, 1.50, 0.25, 8, true, ARRAY[]::TEXT[]),
    (new_provider, 'Food Delivery - Midtown', 'Hot meals delivered quickly across Midtown.', 'food_delivery', 8.00, 1.00, 0.20, 5, true, ARRAY[]::TEXT[])
  ON CONFLICT DO NOTHING;
END$$;



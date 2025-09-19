-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Custom types (enums)
CREATE TYPE user_role AS ENUM ('consumer', 'provider', 'admin');
CREATE TYPE provider_type AS ENUM ('courier', 'drone');
CREATE TYPE service_category AS ENUM (
  'food_delivery',
  'courier',
  'aerial_imaging',
  'site_mapping'
);
CREATE TYPE booking_status AS ENUM (
  'pending',
  'accepted',
  'in_progress',
  'completed',
  'cancelled'
);
CREATE TYPE payment_status AS ENUM (
  'pending',
  'paid',
  'failed',
  'refunded'
);

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'consumer',
  detroit_zone TEXT
);

-- Providers table
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  type provider_type NOT NULL,
  certifications TEXT[] DEFAULT '{}',
  service_areas TEXT[] DEFAULT '{}',
  rating DECIMAL(3,2) DEFAULT 0.00,
  completed_jobs INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE
);

-- Listings table
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category service_category NOT NULL,
  price_base DECIMAL(10,2) NOT NULL,
  price_per_mile DECIMAL(10,2),
  price_per_minute DECIMAL(10,2),
  service_radius_miles INTEGER DEFAULT 10,
  active BOOLEAN DEFAULT TRUE,
  images TEXT[] DEFAULT '{}'
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  consumer_id UUID NOT NULL REFERENCES profiles(id),
  provider_id UUID NOT NULL REFERENCES providers(id),
  listing_id UUID NOT NULL REFERENCES listings(id),
  status booking_status DEFAULT 'pending',
  scheduled_at TIMESTAMPTZ NOT NULL,
  pickup_address TEXT,
  pickup_lat DECIMAL(10,8),
  pickup_lng DECIMAL(11,8),
  dropoff_address TEXT NOT NULL,
  dropoff_lat DECIMAL(10,8) NOT NULL,
  dropoff_lng DECIMAL(11,8) NOT NULL,
  special_instructions TEXT,
  price_total DECIMAL(10,2) NOT NULL,
  payment_intent_id TEXT,
  payment_status payment_status DEFAULT 'pending'
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  booking_id UUID UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES profiles(id),
  reviewed_id UUID NOT NULL REFERENCES profiles(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  CHECK (reviewer_id != reviewed_id)
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  recipient_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE
);

-- Service areas table (for Detroit zones)
CREATE TABLE service_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  center_lat DECIMAL(10,8) NOT NULL,
  center_lng DECIMAL(11,8) NOT NULL,
  radius_miles INTEGER NOT NULL
);

-- Uniqueness for idempotent seeds
ALTER TABLE service_areas ADD CONSTRAINT service_areas_name_unique UNIQUE (name);

-- Indexes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_detroit_zone ON profiles(detroit_zone);
CREATE INDEX idx_providers_user_id ON providers(user_id);
CREATE INDEX idx_providers_type ON providers(type);
CREATE INDEX idx_providers_verified ON providers(verified);
CREATE INDEX idx_providers_rating ON providers(rating DESC);
CREATE INDEX idx_listings_provider_id ON listings(provider_id);
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_listings_active ON listings(active);
CREATE INDEX idx_listings_category_active ON listings(category, active);
CREATE INDEX idx_bookings_consumer_id ON bookings(consumer_id);
CREATE INDEX idx_bookings_provider_id ON bookings(provider_id);
CREATE INDEX idx_bookings_listing_id ON bookings(listing_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_scheduled_at ON bookings(scheduled_at);
CREATE INDEX idx_bookings_provider_status ON bookings(provider_id, status);
CREATE INDEX idx_messages_booking_id ON messages(booking_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_messages_read ON messages(read);
CREATE INDEX idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_reviews_reviewed_id ON reviews(reviewed_id);

-- Full-text search
CREATE INDEX idx_listings_search ON listings 
  USING GIN (to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Constraints
ALTER TABLE bookings ADD CONSTRAINT booking_future_date 
  CHECK (scheduled_at > NOW());
ALTER TABLE bookings ADD CONSTRAINT booking_dropoff_coords
  CHECK (dropoff_lat IS NOT NULL AND dropoff_lng IS NOT NULL);

-- RLS enablement
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_areas ENABLE ROW LEVEL SECURITY;

-- RLS policies
-- profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- providers
CREATE POLICY "Providers are viewable by everyone" ON providers
  FOR SELECT USING (true);
CREATE POLICY "Users can create own provider profile" ON providers
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own provider profile" ON providers
  FOR UPDATE USING (auth.uid() = user_id);

-- listings
CREATE POLICY "Active listings are viewable by everyone" ON listings
  FOR SELECT USING (active = true OR provider_id IN (
    SELECT id FROM providers WHERE user_id = auth.uid()
  ));
CREATE POLICY "Providers can create own listings" ON listings
  FOR INSERT WITH CHECK (provider_id IN (
    SELECT id FROM providers WHERE user_id = auth.uid()
  ));
CREATE POLICY "Providers can update own listings" ON listings
  FOR UPDATE USING (provider_id IN (
    SELECT id FROM providers WHERE user_id = auth.uid()
  ));
CREATE POLICY "Providers can delete own listings" ON listings
  FOR DELETE USING (provider_id IN (
    SELECT id FROM providers WHERE user_id = auth.uid()
  ));

-- bookings
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (
    consumer_id = auth.uid() OR 
    provider_id IN (SELECT id FROM providers WHERE user_id = auth.uid())
  );
CREATE POLICY "Consumers can create bookings" ON bookings
  FOR INSERT WITH CHECK (consumer_id = auth.uid());
CREATE POLICY "Users can update own bookings" ON bookings
  FOR UPDATE USING (
    consumer_id = auth.uid() OR 
    provider_id IN (SELECT id FROM providers WHERE user_id = auth.uid())
  );

-- reviews
CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);
CREATE POLICY "Users can create reviews for completed bookings" ON reviews
  FOR INSERT WITH CHECK (
    reviewer_id = auth.uid() AND
    booking_id IN (
      SELECT id FROM bookings 
      WHERE status = 'completed' 
      AND (consumer_id = auth.uid() OR provider_id IN (
        SELECT id FROM providers WHERE user_id = auth.uid()
      ))
    )
  );

-- messages
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (
    sender_id = auth.uid() OR recipient_id = auth.uid()
  );
CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    booking_id IN (
      SELECT id FROM bookings
      WHERE consumer_id = auth.uid() OR provider_id IN (
        SELECT id FROM providers WHERE user_id = auth.uid()
      )
    )
  );
CREATE POLICY "Recipients can mark messages as read" ON messages
  FOR UPDATE USING (recipient_id = auth.uid());

-- service_areas
CREATE POLICY "Service areas are viewable by everyone" ON service_areas
  FOR SELECT USING (true);

-- Functions & triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON providers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Automatic profile creation on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();



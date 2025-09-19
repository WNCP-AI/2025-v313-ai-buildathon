# SkyMarket Database Architecture

## Overview

SkyMarket uses Supabase (PostgreSQL) as its primary database, providing:
- Real-time subscriptions
- Row Level Security (RLS)
- Built-in authentication
- File storage
- Edge Functions

## Database Schema

### Core Tables Structure

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  is_ai_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User roles enum
CREATE TYPE public.user_role AS ENUM ('consumer', 'operator');

-- Service categories enum
CREATE TYPE public.service_category AS ENUM ('food_delivery', 'courier_parcel', 'aerial_imaging', 'site_mapping');

-- Booking status enum
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Service listings
CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (length(title) <= 255),
  description TEXT,
  category service_category NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  service_area_text TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Booking requests
CREATE TABLE public.booking_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  consumer_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  requirements TEXT,
  preferred_date DATE,
  preferred_time TIME,
  status booking_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

```

## Row Level Security (RLS) Policies

### Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Listings policies
CREATE POLICY "Anyone can view active listings"
  ON listings FOR SELECT
  USING (is_active = true);

CREATE POLICY "Operators can view all their own listings"
  ON listings FOR SELECT
  USING (operator_id = auth.uid());

CREATE POLICY "Operators can create listings"
  ON listings FOR INSERT
  WITH CHECK (auth.uid() = operator_id);

CREATE POLICY "Operators can update own listings"
  ON listings FOR UPDATE
  USING (auth.uid() = operator_id);

CREATE POLICY "Operators can delete own listings"
  ON listings FOR DELETE
  USING (auth.uid() = operator_id);

-- Booking requests policies
CREATE POLICY "Users can view their own bookings as consumer"
  ON booking_requests FOR SELECT
  USING (consumer_id = auth.uid());

CREATE POLICY "Operators can view bookings for their listings"
  ON booking_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = booking_requests.listing_id
      AND listings.operator_id = auth.uid()
    )
  );

CREATE POLICY "Consumers can create booking requests"
  ON booking_requests FOR INSERT
  WITH CHECK (consumer_id = auth.uid());

CREATE POLICY "Consumers can update their own booking requests"
  ON booking_requests FOR UPDATE
  USING (consumer_id = auth.uid());

CREATE POLICY "Operators can update booking requests for their listings"
  ON booking_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = booking_requests.listing_id
      AND listings.operator_id = auth.uid()
    )
  );
```

## Database Relationships

### Entity Relationship Diagram

```
auth.users (1) ──── profiles (1) ──── (n) listings
                            │
                            └──── (n) booking_requests
                                        │
                                        └──── (n) listings
```

### Foreign Key Relationships

1. **auth.users → profiles**: One-to-one (each auth user has one profile)
2. **profiles → listings**: One-to-many (operator can have multiple listings)
3. **profiles → booking_requests**: One-to-many (consumer can have multiple booking requests)
4. **listings → booking_requests**: One-to-many (listing can have multiple booking requests)

## Database Migrations

### Migration Files Structure

```bash
supabase/migrations/
├── 20240101000001_initial_schema.sql
├── 20240101000002_add_rls_policies.sql
├── 20240101000003_create_indexes.sql
├── 20240101000004_add_triggers.sql
└── 20240101000005_seed_data.sql
```

### Example Migration File

```sql
-- supabase/migrations/20240101000001_initial_schema.sql
BEGIN;

-- Create custom types
CREATE TYPE user_role AS ENUM ('consumer', 'operator');

-- Create tables
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL,
  is_ai_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('food_delivery', 'courier_parcel', 'aerial_imaging', 'site_mapping')),
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  service_area_text TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_listings_operator_id ON listings(operator_id);
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_listings_is_active ON listings(is_active);
CREATE INDEX idx_booking_requests_consumer_id ON booking_requests(consumer_id);
CREATE INDEX idx_booking_requests_listing_id ON booking_requests(listing_id);
CREATE INDEX idx_booking_requests_status ON booking_requests(status);

COMMIT;
```

## Data Access Patterns

### TypeScript Types

```typescript
// Database types generated from Supabase
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string
          phone: string | null
          role: 'consumer' | 'operator'
          bio: string | null
          avatar_url: string | null
          is_ai_generated: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Row, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Insert>
      }
      listings: {
        Row: {
          id: string
          operator_id: string
          title: string
          description: string | null
          category: 'food_delivery' | 'courier_parcel' | 'aerial_imaging' | 'site_mapping'
          price: number
          service_area_text: string | null
          image_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Row, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Insert>
      }
      booking_requests: {
        Row: {
          id: string
          consumer_id: string
          listing_id: string
          requirements: string | null
          preferred_date: string | null
          preferred_time: string | null
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Row, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Insert>
      }
    }
  }
}
```

### Data Access Layer

```typescript
// src/lib/database.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

export const supabase = createClient<Database>(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
)

// Helper functions for common queries
export const listingQueries = {
  // Get all active listings with operator info
  async getActiveListings() {
    return await supabase
      .from('listings')
      .select(`
        *,
        operator:profiles!operator_id(
          id,
          user_id,
          full_name,
          role
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
  },

  // Search listings
  async searchListings(query: string, category?: string) {
    let builder = supabase
      .from('listings')
      .select('*')
      .eq('is_active', true)
      .textSearch('title,description', query)

    if (category) {
      builder = builder.eq('category', category)
    }

    return await builder
  }
}
```

## Real-time Subscriptions

```typescript
// Subscribe to new listings
const subscribeToNewListings = () => {
  return supabase
    .channel('new-listings')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'listings',
        filter: 'is_active=eq.true'
      },
      (payload) => {
        console.log('New listing created:', payload.new)
        // Update UI with new listing
      }
    )
    .subscribe()
}

// Subscribe to listing updates
const subscribeToListingUpdates = (operatorId: string) => {
  return supabase
    .channel(`operator-listings:${operatorId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'listings',
        filter: `operator_id=eq.${operatorId}`
      },
      (payload) => {
        console.log('Listing updated:', payload.new)
        // Update operator dashboard
      }
    )
    .subscribe()
}
```

## Database Functions

### Custom PostgreSQL Functions

```sql
-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_booking_requests_updated_at
  BEFORE UPDATE ON public.booking_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
```

## Performance Optimization

### Indexes

```sql
-- Indexes for common queries
CREATE INDEX idx_listings_category_price ON listings(category, price) WHERE is_active = true;
CREATE INDEX idx_profiles_role ON profiles(role);

-- Full-text search
CREATE INDEX idx_listings_search ON listings USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));
```

### Query Optimization

```typescript
// Efficient pagination with cursor
async function getPaginatedListings(cursor?: string, limit = 20) {
  let query = supabase
    .from('listings')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (cursor) {
    query = query.lt('created_at', cursor)
  }

  return await query
}

// Batch operations for admin panel
async function updateMultipleListings(listingIds: string[], updates: Partial<Database['public']['Tables']['listings']['Update']>) {
  return await supabase
    .from('listings')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .in('id', listingIds)
}
```

## Backup and Recovery

### Automatic Backups
- Supabase provides automatic daily backups
- Point-in-time recovery available on Pro plan
- Manual snapshots can be triggered

### Export/Import

```bash
# Export schema
supabase db dump -f schema.sql

# Export data
supabase db dump --data-only -f data.sql

# Import to new instance
psql -h db.supabase.co -U postgres -d postgres -f schema.sql
psql -h db.supabase.co -U postgres -d postgres -f data.sql
```

## Security Best Practices

### 1. Use RLS Everywhere
- Never disable RLS on production tables
- Test policies thoroughly
- Use service role key only in Edge Functions

### 2. Validate Input
```typescript
// Always validate before database operations
const createBookingSchema = z.object({
  listing_id: z.string().uuid(),
  booking_date: z.date().min(new Date()),
  duration_minutes: z.number().min(30).max(480),
})

const validated = createBookingSchema.parse(input)
```

### 3. Prevent SQL Injection
```typescript
// Always use parameterized queries
// Good
const { data } = await supabase
  .from('listings')
  .select('*')
  .eq('category', userInput)

// Never do this
const query = `SELECT * FROM listings WHERE category = '${userInput}'`
```

## Monitoring and Analytics

### Database Metrics
```sql
-- Monitor slow queries
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Check table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(tablename::regclass)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename::regclass) DESC;

-- Active connections
SELECT count(*) FROM pg_stat_activity;
```

## Conclusion

The SkyMarket database architecture provides:
- **Security**: RLS policies enforce access control
- **Complete Booking System**: Full booking request and status management
- **User Profiles**: Enhanced profiles with bios and avatars
- **Performance**: Optimized indexes for common queries
- **Real-time**: Live updates via subscriptions
- **Type Safety**: Generated TypeScript types
- **AI Integration**: Support for AI-generated content via flags

This comprehensive foundation supports the full marketplace functionality including booking management, user profiles, and service listings.
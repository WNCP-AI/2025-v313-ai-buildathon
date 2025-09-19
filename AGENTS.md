# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SkyMarket is a multi-modal marketplace serving the greater Detroit area that connects consumers with courier and drone service providers for food delivery, parcel delivery, and aerial imaging services. The platform is built using Next.js 15, TypeScript, and Supabase as the unified backend platform.

## Core Architecture

### Tech Stack
- **Frontend**: Next.js 15 with App Router, React 19, TypeScript 5
- **Backend**: Supabase (PostgreSQL database, auth, storage, real-time subscriptions)
- **UI Framework**: Tailwind CSS 4 + shadcn/ui components
- **Payments**: Stripe (payments & payouts with escrow)
- **Maps**: Mapbox GL JS (geocoding and mapping for Detroit Metro area)
- **Email**: Resend (transactional emails)
- **AI**: OpenAI (content generation via AI SDK)
- **Deployment**: Vercel Edge Network

### Project Structure
```
app/                    # Next.js 15 App Router
├── (auth)/            # Authentication route group
├── api/               # API routes
├── dashboard/         # Protected dashboard routes
├── browse/            # Service discovery
├── booking/           # Booking flow
├── provider/          # Provider management
├── orders/            # Order management
├── about/             # Static pages
├── help/              
├── how-it-works/      
├── privacy/           
├── safety/            
├── terms/             
├── layout.tsx         # Root layout
└── page.tsx           # Home page

components/            # Reusable React components
├── ui/               # shadcn/ui base components
├── layout/           # Layout components (header, footer)
├── providers/        # Provider-specific components
├── consumers/        # Consumer-specific components
├── shared/           # Shared components
├── map/              # Mapbox components
├── payments/         # Stripe components
├── realtime/         # Real-time features
├── chat/             # Chat components
└── ai-elements/      # AI-powered components

lib/                   # Utility functions and integrations
├── supabase/         # Supabase client configurations
├── stripe/           # Stripe integration
├── mapbox/           # Mapbox utilities
├── utils.ts          # General utilities
├── resend.ts         # Email utilities
└── embedding.ts      # AI/ML utilities

types/                 # TypeScript type definitions
hooks/                 # Custom React hooks
utils/                 # Additional utility functions
supabase/             # Database schema and migrations
├── schema.sql        # Database schema
├── migrations/       # Database migrations
└── seed.sql          # Seed data
```

## Development Commands

### Initial Setup
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add required keys for Supabase, Stripe, Mapbox, etc.

# Run development server
npm run dev
```

### Common Development Tasks
```bash
# Run development server
npm run dev           # Next.js development server (localhost:3000)

# Type checking
npm run type-check    # Run TypeScript type checking (not in package.json - use tsc)

# Linting
npm run lint          # Run ESLint

# Build for production
npm run build         # Build Next.js application
npm run start         # Start production server
```

## Key Development Patterns

### Supabase Database Operations

**Client-side queries** - Use from components:
```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
const { data, error } = await supabase
  .from('bookings')
  .select('*')
  .eq('user_id', userId)
```

**Server-side operations** - Use in API routes and Server Components:
```typescript
import { createClient } from '@/lib/supabase/server'

const supabase = createClient()
const { data, error } = await supabase
  .from('listings')
  .insert({...})
```

**Real-time subscriptions**:
```typescript
const supabase = createClient()

useEffect(() => {
  const subscription = supabase
    .channel('bookings')
    .on('postgres_changes', 
      { event: 'UPDATE', schema: 'public', table: 'bookings' },
      (payload) => {
        // Handle real-time updates
      }
    )
    .subscribe()

  return () => subscription.unsubscribe()
}, [])
```

### Component Patterns

**Server Components (default)**:
- Use for data fetching and static content
- No 'use client' directive needed

**Client Components**:
- Add 'use client' at the top
- Use for interactivity, hooks, browser APIs

### Authentication
Uses Supabase Auth with middleware for route protection:
```typescript
// middleware.ts handles auth routing
// lib/supabase/auth.ts contains auth utilities
```

## Important Business Logic

### Service Areas
- Platform is limited to Detroit Metropolitan area
- Default map center: `{ lat: 42.3314, lng: -83.0458 }`
- Service radius: 25 miles from center
- Service validation required for all bookings
- Support for Detroit neighborhoods: Midtown, Downtown, Corktown, etc.

### User Roles
- **Consumer**: End users booking services
- **Provider**: Couriers and drone operators offering services  
- **Admin**: Platform administrators

### Booking Flow
1. User searches/browses services
2. Selects provider and configures request
3. Payment authorized (held in escrow via Stripe)
4. Provider accepts/auto-accepts booking
5. Service executed with live tracking
6. Completion confirmed and payment released
7. Two-sided ratings collected

### Compliance Requirements
- FAA Part-107 verification for drone operators
- LAANC integration for airspace checks
- Weather gating for drone operations
- Detroit-specific airspace restrictions (Detroit City Airport)

## Database Schema Key Tables

- **users**: User accounts with roles and profiles
- **listings**: Service offerings from providers
- **bookings**: Active and completed service bookings
- **payments**: Payment intents and transaction records
- **notifications**: Real-time user notifications
- **reviews**: Two-sided rating system

## Environment Variables Required

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token

# Email
RESEND_API_KEY=your_resend_api_key

# AI
OPENAI_API_KEY=your_openai_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SERVICE_AREA_CENTER_LAT=42.3314
NEXT_PUBLIC_SERVICE_AREA_CENTER_LNG=-83.0458
NEXT_PUBLIC_SERVICE_AREA_RADIUS_MILES=25
```

## Code Standards

### TypeScript
- Strict mode enabled
- Explicit types for all function parameters and returns
- Interfaces for all data structures
- Use `@/*` path aliases for imports

### File Naming
- Components: PascalCase (e.g., `BookingForm.tsx`)
- Utilities: camelCase (e.g., `calculateDistance.ts`)
- Directories: kebab-case (e.g., `booking-flow/`)
- Constants: SCREAMING_SNAKE_CASE (e.g., `DETROIT_CENTER_COORDS`)

### Import Organization
1. React/Next.js imports
2. Third-party libraries
3. Internal components (using @/* paths)
4. Internal utilities (using @/* paths)
5. Type imports (using `import type`)

### Error Handling
- Try-catch blocks for all async operations
- User-friendly error messages
- Proper error logging for debugging
- Custom error classes for domain-specific errors

### Security
- Never expose API keys in client code
- Use NEXT_PUBLIC_ prefix only for client-safe variables
- Validate all user inputs
- Authentication checks via Supabase middleware
- Service area validation for Detroit Metro

## Performance Considerations

- Use Server Components by default
- Implement proper caching strategies
- Use Supabase indexes for database queries
- Optimize images with Next.js Image component
- Dynamic imports for large components
- Real-time subscriptions only when needed

## Testing Guidelines

- Test critical business logic
- Validate Detroit service area constraints
- Test payment flows with Stripe test mode
- Verify role-based access control
- Test real-time subscription updates
- Use Supabase local development for testing
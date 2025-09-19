# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start Next.js development server on localhost:3000
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

### Testing & Validation
Run these commands before marking any tasks complete:
- `npm run lint` - Code linting and style checks
- `npx tsc --noEmit` - TypeScript type checking (no tsconfig script defined)

## Project Architecture

### Tech Stack Overview
- **Frontend**: Next.js 15.5.2 with App Router, React 19, TypeScript 5
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Payments**: Stripe with Connect for marketplace payments
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **Maps**: Mapbox GL JS for interactive maps and location services
- **Email**: Resend for transactional emails
- **AI**: OpenAI integration via @ai-sdk/openai and ai packages

### Key Directory Structure
```
app/                     # Next.js 15 App Router
├── (auth)/             # Authentication pages (login, signup, reset)
├── api/                # API routes
├── booking/            # Booking flow pages
├── browse/             # Service discovery
├── dashboard/          # User dashboards
└── globals.css         # Global styles

components/             # React components
├── ui/                 # shadcn/ui base components
├── layout/             # Header, footer, navigation (SiteHeader.tsx)
├── providers/          # Provider-specific components
├── consumers/          # Consumer-specific components
└── shared/             # Shared/common components

lib/                    # Core utilities and integrations
├── supabase/           # Database clients
│   ├── server.ts       # Server-side client (cookies)
│   ├── client.ts       # Browser client
│   ├── admin.ts        # Admin client (service role)
│   ├── auth.ts         # Auth utilities
│   └── middleware.ts   # Auth middleware
├── stripe/             # Payment processing
│   ├── client.ts       # Client-side Stripe
│   └── server.ts       # Server-side Stripe
├── utils.ts            # Utility functions
├── resend.ts           # Email service
└── embedding.ts        # AI/embeddings

types/                  # TypeScript definitions
└── database.ts         # Supabase generated types

supabase/              # Database schema and migrations
├── migrations/        # Database migration files
├── schema.sql         # Main database schema
└── seed.sql          # Seed data

.cursor/rules/         # Cursor IDE rules
├── 000-core.mdc       # Core project structure
├── 010-typescript-next.mdc  # TypeScript & Next.js rules
├── 020-supabase.mdc   # Supabase patterns
├── 030-styling-tailwind.mdc # Tailwind CSS rules
├── 040-auth-routing.mdc     # Auth & routing patterns
├── 050-data-models.mdc      # Data model alignment
└── 060-eslint-formatting.mdc # Code formatting
```

### Business Domain Architecture

SkyMarket is a Detroit-focused drone service marketplace with these core concepts:

#### User Roles
- **Consumer**: Books drone services, makes payments, tracks orders
- **Provider**: Lists services, accepts bookings, completes deliveries
- **Admin**: Platform management, user moderation, analytics

#### Service Categories (Exactly 4)
1. `food_delivery` - Restaurant and food delivery via drone
2. `courier` - Package and document delivery
3. `aerial_imaging` - Photography, videography, inspection services
4. `site_mapping` - Surveying, construction site mapping, real estate

#### Booking State Flow
```
pending → accepted → in_progress → completed
    ↓         ↓           ↓
cancelled  cancelled  cancelled
```

### Database Integration Pattern
- **Server Components**: Use `lib/supabase/server.ts` with cookies
- **Client Components**: Use `lib/supabase/client.ts` for browser
- **Admin operations**: Use `lib/supabase/admin.ts` with service role key
- **Auth middleware**: Use `lib/supabase/middleware.ts` for route protection
- **Type safety**: All database types are generated in `types/database.ts`
- **Migration preference**: Use migrations in `supabase/migrations/` over direct schema edits

### Payment Architecture
- Uses Stripe Connect for marketplace payments
- 15% platform fee automatically handled
- Escrow system: funds held until service completion
- PaymentIntent created on booking, released on completion

### Geographic Constraints
All operations must be within Detroit Metro bounds:
- Latitude: 42.0 - 42.6
- Longitude: -83.5 - -82.8
- Default map center: `{ lat: 42.3314, lng: -83.0458 }` (Downtown Detroit)
- Service radius: 25 miles from center
- Airport restrictions: 5-mile radius around Detroit City Airport

### Environment Setup
Required environment variables (see `.env.example`):
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Email & AI
RESEND_API_KEY=
OPENAI_API_KEY=

# Maps
NEXT_PUBLIC_MAPBOX_TOKEN=

# App Config (Detroit-specific)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SERVICE_AREA_CENTER_LAT=42.3314
NEXT_PUBLIC_SERVICE_AREA_CENTER_LNG=-83.0458
NEXT_PUBLIC_SERVICE_AREA_RADIUS_MILES=25
```

## Code Standards & Patterns

### From Cursor Rules (.cursor/rules/)
- Use Next.js 15 App Router exclusively (no Pages Router)
- Server Components by default, Client Components only when needed (`'use client'` directive)
- Use absolute imports via `@/*` alias (configured in tsconfig.json)
- TypeScript strict mode required with explicit types (avoid `any`)
- Import order: React/Next → third-party → internal components → internal utils → types
- Keep routes colocated: e.g., `app/browse/[category]/page.tsx`
- Detroit-specific validations for addresses and coordinates
- Zod schemas for all user input validation
- Error handling: Never swallow errors, log or bubble with context
- Keep files focused; extract helpers to `lib/*`

### Key Technical Patterns
- **Authentication**: Supabase Auth with middleware for route protection
- **Database**:
  - Generated types from Supabase (`Database['public']['Tables']['table'].Row`)
  - Never hardcode table/column names
  - Keep RLS policies in SQL migrations
  - For server actions/route handlers, create service layer for DB access
- **Payments**: Stripe Connect with escrow and automatic fee handling
- **Maps**: Mapbox with Detroit-centered defaults and geofencing
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS 4 with shadcn/ui component system
- **Async patterns**: Prefer async/await with early returns; avoid deep nesting

### Business Logic Patterns
- All coordinates must pass Detroit Metro boundary validation
- FAA Part-107 certificate verification for drone providers
- Weather condition checks before flight approval
- Maximum 400 feet AGL altitude for drone operations
- Daylight hours only for drone services (sunrise to sunset)

## Important Notes

- **Database Enums**: Align UI with SQL enums from `supabase/schema.sql`:
  - `service_category`: `food_delivery | courier | aerial_imaging | site_mapping`
  - `provider_type`: `courier | drone`
  - `booking_status`: `pending | accepted | in_progress | completed | cancelled`
  - `payment_status`: `pending | paid | failed | refunded`
- **Price Fields**: DECIMAL in DB; convert to numbers in UI with care
- **Timestamps**: Use `updated_at` ordering where available; triggers maintain timestamps
- **Detroit Focus**: All location validations and defaults center on Detroit Metro area
- **Marketplace Model**: Two-sided platform with providers, consumers, and 15% platform fee
- **Compliance**: Built-in FAA Part 107 and airspace management for drone operations
- **Payment Escrow**: Stripe Connect handles fund holding and automatic payouts
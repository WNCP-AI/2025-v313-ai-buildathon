---
MOC:
  - "[[WNCP AI MOC]]"
  - "[[ID Ventures MOC]]"
tags:
  - Type/Documentation
  - WNCP_AI
  - Client/ID_Ventures
  - hackathon-planning
  - api-documentation
created: 2025-01-14
Description: API documentation for SkyMarket - Supabase Edge Functions, third-party integrations, and authentication patterns
---

# SkyMarket API Documentation

## Overview

SkyMarket's API architecture consists of:
- **Supabase Client SDK**: Direct database access with RLS
- **Edge Functions**: Server-side business logic
- **Third-party APIs**: OpenAI, Resend
- **Real-time Subscriptions**: WebSocket connections

## Supabase Client Configuration

### Initial Setup

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: window.localStorage,
    },
    global: {
      headers: {
        'x-application-name': 'skymarket',
      },
    },
  }
)
```

## Authentication API

### User Registration

```typescript
// src/lib/auth.ts
export async function signUp(email: string, password: string, metadata: any) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata, // full_name, phone, user_type
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (!error && data.user) {
    // Create profile record
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email: data.user.email!,
        full_name: metadata.full_name,
        phone: metadata.phone,
        user_type: metadata.user_type || 'customer',
      })

    if (profileError) {
      console.error('Profile creation failed:', profileError)
    }
  }

  return { data, error }
}
```

### User Login

```typescript
export async function signIn(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  })
}

// OAuth login
export async function signInWithGoogle() {
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })
}
```

### Session Management

```typescript
// Get current user
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return { ...user, profile }
  }

  return null
}

// Listen to auth changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    console.log('User signed in:', session?.user)
  } else if (event === 'SIGNED_OUT') {
    console.log('User signed out')
  } else if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed')
  }
})

// Sign out
export async function signOut() {
  return await supabase.auth.signOut()
}
```

## Supabase Edge Functions

### Function Structure

```typescript
// supabase/functions/generate-ai-content/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse request body
    const { type, count, guidance } = await req.json()

    let result
    switch (type) {
      case 'users':
        result = await generateUsers(count, guidance)
        break
      case 'listing':
        result = await generateListing(count, guidance)
        break
      default:
        throw new Error('Invalid type')
    }

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
```

### Deploying Edge Functions

```bash
# Deploy AI content generation function
supabase functions deploy generate-ai-content

# Set secrets
supabase secrets set OPENAI_API_KEY=sk-...
supabase secrets set RESEND_API_KEY=re_...

# Test locally
supabase functions serve generate-ai-content --env-file .env.local
```

## Third-Party API Integrations


### Resend Email Integration

```typescript
// supabase/functions/send-test-email/index.ts
import { Resend } from 'https://esm.sh/resend@2.0.0'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

export async function sendTestEmail(toEmail: string) {
  const html = `
    <h2>SkyMarket Email Test</h2>
    <p>This is a test email from the SkyMarket platform.</p>
    <p>If you're receiving this, the email integration is working correctly!</p>
    <div style="border: 1px solid #ddd; padding: 20px; margin: 20px 0;">
      <p><strong>Platform:</strong> SkyMarket Drone Marketplace</p>
      <p><strong>Environment:</strong> Development/Testing</p>
      <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
    </div>
    <p style="color: #666; font-size: 14px;">This email was sent from the SkyMarket admin panel for testing purposes.</p>
  `

  try {
    const { data, error } = await resend.emails.send({
      from: 'SkyMarket <noreply@skymarket.com>',
      to: toEmail,
      subject: 'SkyMarket Email Test',
      html,
    })

    if (error) {
      console.error('Email send error:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Resend error:', error)
    throw new Error(`Email sending failed: ${error.message}`)
  }
}
```

### OpenAI Integration

```typescript
// supabase/functions/generate-ai-content/index.ts
import OpenAI from 'https://esm.sh/openai@4.20.0'

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY'),
})

export async function generateUsers(count: number, guidance: string = '') {
  const createdUsers = []

  for (let i = 0; i < count; i++) {
    const personas = [
      'tech-savvy entrepreneur', 'busy working parent', 'small business owner',
      'creative professional', 'real estate agent', 'construction manager'
    ]

    const randomPersona = personas[Math.floor(Math.random() * personas.length)]
    const roleChoice = Math.random() > 0.5 ? 'operator' : 'consumer'

    const userPrompt = `Generate 1 realistic user profile for a drone marketplace in Detroit. Create a ${randomPersona}. ${guidance}

    Return ONLY valid JSON with this exact structure:
    {
      "full_name": "First Last",
      "email": "unique.email@domain.com",
      "phone": "+1-555-000-0000",
      "role": "${roleChoice}"
    }`

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: userPrompt }],
        max_tokens: 200,
        temperature: 0.7
      })

      const content = response.choices[0].message.content.trim()
      const userData = JSON.parse(content)

      // Create user with Supabase auth
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: 'TempPassword123!',
        email_confirm: true,
        user_metadata: {
          full_name: userData.full_name,
          phone: userData.phone,
          role: userData.role,
          is_ai_generated: true
        }
      })

      if (!authError && authUser.user) {
        createdUsers.push({ ...userData, id: authUser.user.id })
      }
    } catch (error) {
      console.error('Error generating user:', error)
    }
  }

  return { success: true, users: createdUsers }
}

export async function generateListing(count: number, guidance: string) {
  // Get AI-generated operators
  const { data: operators } = await supabase
    .from('profiles')
    .select('user_id, full_name, role')
    .eq('role', 'operator')
    .eq('is_ai_generated', true)

  if (!operators || operators.length === 0) {
    throw new Error('No AI-generated operators found')
  }

  const createdListings = []

  for (let i = 0; i < count; i++) {
    const categories = ['food_delivery', 'courier_parcel', 'aerial_imaging', 'site_mapping']
    const selectedCategory = categories[Math.floor(Math.random() * categories.length)]
    const randomOperator = operators[Math.floor(Math.random() * operators.length)]

    const listingPrompt = `Generate 1 realistic service listing for a drone marketplace in Detroit. ${guidance}

    Return ONLY valid JSON with this exact structure:
    {
      "title": "Service title (max 50 chars)",
      "description": "Detailed description (150-250 words)",
      "category": "${selectedCategory}",
      "price": 45,
      "service_area_text": "Detroit and surrounding Metro Detroit areas"
    }`

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: listingPrompt }],
        max_tokens: 300,
        temperature: 0.7
      })

      const content = response.choices[0].message.content.trim()
      const listingData = JSON.parse(content)

      // Create listing in database
      const { data: listing, error } = await supabase
        .from('listings')
        .insert({
          operator_id: randomOperator.user_id,
          title: listingData.title,
          description: listingData.description,
          category: listingData.category,
          price: listingData.price,
          service_area_text: listingData.service_area_text,
          is_active: true
        })
        .select()
        .single()

      if (!error) {
        createdListings.push({ ...listing, operator_name: randomOperator.full_name })
      }
    } catch (error) {
      console.error('Error generating listing:', error)
    }
  }

  return { success: true, listings: createdListings }
}
```


## API Error Handling

### Standardized Error Response

```typescript
// src/lib/api-errors.ts
export class APIError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 400,
    public details?: any
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export function handleAPIError(error: any) {
  if (error instanceof APIError) {
    return {
      error: {
        message: error.message,
        code: error.code,
        details: error.details,
      },
      status: error.status,
    }
  }

  // Supabase errors
  if (error?.code) {
    const supabaseErrors: Record<string, string> = {
      '23505': 'This record already exists',
      '23503': 'Referenced record not found',
      '23502': 'Required field missing',
      '22P02': 'Invalid input format',
      'PGRST116': 'No rows found',
      'PGRST301': 'Database connection error',
    }

    return {
      error: {
        message: supabaseErrors[error.code] || 'Database error',
        code: error.code,
      },
      status: 400,
    }
  }

  // Generic error
  return {
    error: {
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
    },
    status: 500,
  }
}
```

### API Request Wrapper

```typescript
// src/lib/api-client.ts
export async function apiRequest<T>(
  fn: () => Promise<{ data: T | null; error: any }>
): Promise<T> {
  try {
    const { data, error } = await fn()

    if (error) {
      throw new APIError(
        error.message || 'Request failed',
        error.code || 'API_ERROR',
        error.status || 400,
        error.details
      )
    }

    if (!data) {
      throw new APIError('No data returned', 'NO_DATA', 404)
    }

    return data
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }

    throw new APIError(
      'Network error',
      'NETWORK_ERROR',
      500,
      { originalError: error }
    )
  }
}

// Usage
try {
  const listings = await apiRequest(() =>
    supabase
      .from('listings')
      .select('*')
      .eq('status', 'active')
  )

  console.log('Listings:', listings)
} catch (error) {
  console.error('API Error:', error)
  // Show error to user
}
```

## Rate Limiting

### Edge Function Rate Limiting

```typescript
// supabase/functions/_shared/rate-limit.ts
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): boolean {
  const now = Date.now()
  const userLimit = rateLimitMap.get(identifier)

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    })
    return true
  }

  if (userLimit.count >= maxRequests) {
    return false
  }

  userLimit.count++
  return true
}

// Usage in Edge Function
serve(async (req) => {
  const { data: { user } } = await supabase.auth.getUser()

  if (!rateLimit(user.id, 100, 60000)) {
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded' }),
      { status: 429 }
    )
  }

  // Process request...
})
```

## API Documentation Standards

### OpenAPI Specification

```yaml
openapi: 3.0.0
info:
  title: SkyMarket API
  version: 1.0.0
  description: Drone service marketplace API

paths:
  /rest/v1/listings:
    get:
      summary: Get all listings
      parameters:
        - name: category
          in: query
          schema:
            type: string
            enum: [food_delivery, courier_parcel, aerial_imaging, site_mapping]
        - name: is_active
          in: query
          schema:
            type: boolean
      responses:
        200:
          description: List of listings
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Listing'

  /functions/v1/generate-ai-content:
    post:
      summary: Generate AI content (users or listings)
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                type:
                  type: string
                  enum: [users, listing]
                count:
                  type: integer
                  minimum: 1
                  maximum: 50
                guidance:
                  type: string
                  description: Optional guidance for AI generation
      responses:
        200:
          description: AI content generated successfully
        401:
          description: Unauthorized
        400:
          description: Invalid request

components:
  schemas:
    Listing:
      type: object
      properties:
        id:
          type: string
          format: uuid
        title:
          type: string
        category:
          type: string
        price:
          type: number
        operator_id:
          type: string
          format: uuid

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

## Testing API Endpoints

### Integration Tests

```typescript
// tests/api.test.ts
import { describe, it, expect, beforeAll } from 'vitest'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

describe('API Endpoints', () => {
  let testUser: any

  beforeAll(async () => {
    // Create test user
    const { data } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'testpassword123',
    })
    testUser = data.user
  })

  it('should fetch active listings', async () => {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('is_active', true)

    expect(error).toBeNull()
    expect(Array.isArray(data)).toBe(true)
  })

  it('should create a profile', async () => {
    const profile = {
      user_id: testUser.id,
      full_name: 'Test User',
      phone: '+1-555-123-4567',
      role: 'consumer',
    }

    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single()

    expect(error).toBeNull()
    expect(data.id).toBeDefined()
  })

  it('should handle rate limiting', async () => {
    // Make many requests quickly
    const promises = Array(20).fill(0).map(() =>
      fetch(`${process.env.SUPABASE_URL}/functions/v1/test`, {
        headers: {
          Authorization: `Bearer ${testUser.access_token}`,
        },
      })
    )

    const responses = await Promise.all(promises)
    const rateLimited = responses.some(r => r.status === 429)

    expect(rateLimited).toBe(true)
  })
})
```

## Conclusion

The SkyMarket API provides:
- **Direct Database Access**: Via Supabase client with RLS
- **Server-side Logic**: Edge Functions for AI content generation and email notifications
- **Third-party Integrations**: OpenAI for AI content, Resend for email communications
- **Real-time Updates**: WebSocket subscriptions for booking status changes
- **Security**: Authentication, rate limiting, input validation
- **Developer Experience**: TypeScript types, error handling, testing

This architecture supports both rapid development and production scalability with focus on AI-enhanced marketplace functionality.
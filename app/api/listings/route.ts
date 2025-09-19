import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'

type ListingsInsert = Database['public']['Tables']['listings']['Insert']
type ProvidersRow = Database['public']['Tables']['providers']['Row']

const createListingSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  category: z.enum(['food_delivery', 'courier', 'aerial_imaging', 'site_mapping']),
  priceBase: z.number().nonnegative(),
  pricePerMile: z.number().nonnegative().optional().nullable(),
  pricePerMinute: z.number().nonnegative().optional().nullable(),
  serviceRadiusMiles: z.number().int().min(0).default(10),
  active: z.boolean().optional(),
})

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const category = searchParams.get('category') as
    | 'food_delivery'
    | 'courier'
    | 'aerial_imaging'
    | 'site_mapping'
    | null
  const q = searchParams.get('q')
  const active = searchParams.get('active')

  let query = supabase
    .from('listings')
    .select('id, title, description, category, price_base, price_per_mile, price_per_minute, service_radius_miles, active, provider_id, updated_at')
    .order('updated_at', { ascending: false })

  if (category) query = query.eq('category', category)
  if (active != null) query = query.eq('active', active === 'true')
  if (q) query = query.textSearch('title', q)

  const { data, error } = await query
  if (error) return NextResponse.json({ data: null, error: { code: 'INTERNAL_ERROR', message: error.message } }, { status: 500 })
  return NextResponse.json({ data, error: null })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json().catch(() => ({}))
  const parsed = createListingSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { data: null, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: parsed.error.flatten() } },
      { status: 400 },
    )
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ data: null, error: { code: 'AUTHENTICATION_REQUIRED', message: 'Login required' } }, { status: 401 })

  const { data: provider, error: providerErr } = await supabase
    .from('providers')
    .select('id')
    .eq('user_id', user.id)
    .single() as unknown as { data: Pick<ProvidersRow, 'id'> | null, error: unknown }
  if (providerErr || !provider) {
    return NextResponse.json({ data: null, error: { code: 'AUTHORIZATION_DENIED', message: 'Not a provider' } }, { status: 403 })
  }

  const p = parsed.data
  const { data, error } = await (supabase
    .from('listings')
    .insert({
      provider_id: provider.id,
      title: p.title,
      description: p.description ?? null,
      category: p.category,
      price_base: p.priceBase,
      price_per_mile: p.pricePerMile ?? null,
      price_per_minute: p.pricePerMinute ?? null,
      service_radius_miles: p.serviceRadiusMiles,
      active: p.active ?? true,
    } as ListingsInsert))
    .select('id')
    .single()

  if (error) return NextResponse.json({ data: null, error: { code: 'INTERNAL_ERROR', message: error.message } }, { status: 500 })
  return NextResponse.json({ data, error: null }, { status: 201 })
}




import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'

type ListingsUpdate = Database['public']['Tables']['listings']['Update']

const updateListingSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  category: z.enum(['food_delivery', 'courier', 'aerial_imaging', 'site_mapping']).optional(),
  priceBase: z.number().nonnegative().optional(),
  pricePerMile: z.number().nonnegative().nullable().optional(),
  pricePerMinute: z.number().nonnegative().nullable().optional(),
  serviceRadiusMiles: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
})

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('listings')
    .select('id, title, description, category, price_base, price_per_mile, price_per_minute, service_radius_miles, active, provider_id, updated_at')
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ data: null, error: { code: 'NOT_FOUND', message: error.message } }, { status: 404 })
  return NextResponse.json({ data, error: null })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const body = await request.json().catch(() => ({}))
  const parsed = updateListingSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { data: null, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: parsed.error.flatten() } },
      { status: 400 },
    )
  }

  const p = parsed.data
  const updatePayload: ListingsUpdate = {
    title: p.title,
    description: p.description ?? undefined,
    category: p.category,
    price_base: p.priceBase,
    price_per_mile: p.pricePerMile ?? undefined,
    price_per_minute: p.pricePerMinute ?? undefined,
    service_radius_miles: p.serviceRadiusMiles ?? undefined,
    active: p.active,
  }

  const { data, error } = await supabase
    .from('listings')
    .update(updatePayload)
    .eq('id', id)
    .select('id')
    .single()

  if (error) {
    const status = String(error.message || '').toLowerCase().includes('permission') ? 403 : 500
    return NextResponse.json({ data: null, error: { code: 'UPDATE_FAILED', message: error.message } }, { status })
  }
  return NextResponse.json({ data, error: null })
}

// Soft delete: mark as inactive
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('listings')
    .update({ active: false } satisfies ListingsUpdate)
    .eq('id', id)
    .select('id, active')
    .single()

  if (error) {
    const status = String(error.message || '').toLowerCase().includes('permission') ? 403 : 500
    return NextResponse.json({ data: null, error: { code: 'DELETE_FAILED', message: error.message } }, { status })
  }
  return NextResponse.json({ data, error: null })
}

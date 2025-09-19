import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/server'

const updateSchema = z.object({
  status: z.enum(['pending', 'accepted', 'in_progress', 'completed', 'cancelled']).optional(),
  // On completion, capture funds
  capture: z.boolean().optional(),
})

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params
  const { data, error } = await supabase
    .from('bookings')
    .select('id, status, scheduled_at, pickup_address, dropoff_address, special_instructions, price_total, payment_status, payment_intent_id, consumer_id, provider_id, listing:listing_id(id, title)')
    .eq('id', id)
    .single()
  if (error || !data) return NextResponse.json({ data: null, error: { code: 'RESOURCE_NOT_FOUND', message: 'Order not found' } }, { status: 404 })
  return NextResponse.json({ data, error: null })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  const body = await request.json().catch(() => ({}))
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { data: null, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: parsed.error.flatten() } },
      { status: 400 },
    )
  }

  const updates: Record<string, unknown> = {}
  if (parsed.data.status !== undefined) updates.status = parsed.data.status

  // Capture payment on completion if requested
  if (parsed.data.capture) {
    const { data: booking } = await supabase
      .from('bookings')
      .select('id, payment_intent_id, price_total')
      .eq('id', id)
      .single()
    if (booking?.payment_intent_id) {
      await stripe.paymentIntents.capture(booking.payment_intent_id)
      updates.payment_status = 'paid'
    }
  }

  if (Object.keys(updates).length === 0) return NextResponse.json({ data: { id }, error: null })

  const { error } = await supabase
    .from('bookings')
    .update(updates as never)
    .eq('id', id)
  if (error) return NextResponse.json({ data: null, error: { code: 'INTERNAL_ERROR', message: error.message } }, { status: 500 })
  return NextResponse.json({ data: { id }, error: null })
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params
  const { error } = await supabase.from('bookings').delete().eq('id', id)
  if (error) return NextResponse.json({ data: null, error: { code: 'INTERNAL_ERROR', message: error.message } }, { status: 500 })
  return NextResponse.json({ data: { id }, error: null })
}



import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/server'

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ data: null, error: { code: 'AUTHENTICATION_REQUIRED', message: 'Login required' } }, { status: 401 })

  const { data: booking } = await supabase
    .from('bookings')
    .select('id, consumer_id, provider_id, listing_id, price_total, payment_intent_id')
    .eq('id', id)
    .single()
  if (!booking) return NextResponse.json({ data: null, error: { code: 'RESOURCE_NOT_FOUND', message: 'Order not found' } }, { status: 404 })
  if (booking.consumer_id !== user.id) return NextResponse.json({ data: null, error: { code: 'AUTHORIZATION_DENIED', message: 'Not allowed' } }, { status: 403 })

  // Cancel old intent if present and cancellable
  if (booking.payment_intent_id) {
    try {
      await stripe.paymentIntents.cancel(booking.payment_intent_id)
    } catch {
      // ignore if not cancellable
    }
  }

  const amountCents = Math.round(Number(booking.price_total) * 100)
  const intent = await stripe.paymentIntents.create({
    amount: amountCents,
    currency: 'usd',
    automatic_payment_methods: { enabled: true },
    capture_method: 'manual',
    metadata: {
      booking_id: booking.id,
      listing_id: booking.listing_id,
      provider_id: booking.provider_id,
    },
  }, { idempotencyKey: `reset-intent:${booking.id}:${Date.now()}` })

  await supabase
    .from('bookings')
    .update({ payment_intent_id: intent.id })
    .eq('id', booking.id)

  return NextResponse.json({ data: { clientSecret: intent.client_secret }, error: null })
}



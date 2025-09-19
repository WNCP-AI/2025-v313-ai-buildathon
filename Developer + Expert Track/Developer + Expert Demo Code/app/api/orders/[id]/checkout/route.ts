import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/server'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ data: null, error: { code: 'AUTHENTICATION_REQUIRED', message: 'Login required' } }, { status: 401 })

  const { data: booking } = await supabase
    .from('bookings')
    .select('id, price_total, consumer_id')
    .eq('id', id)
    .single()
  if (!booking) return NextResponse.json({ data: null, error: { code: 'RESOURCE_NOT_FOUND', message: 'Order not found' } }, { status: 404 })
  if (booking.consumer_id !== user.id) return NextResponse.json({ data: null, error: { code: 'AUTHORIZATION_DENIED', message: 'Not allowed' } }, { status: 403 })

  const amountCents = Math.round(Number(booking.price_total) * 100)
  const productId = process.env.STRIPE_BOOKING_PRODUCT_ID

  // Derive base URL from request headers to avoid env mismatch in dev
  const h = await headers()
  const proto = h.get('x-forwarded-proto') || 'http'
  const host = h.get('x-forwarded-host') || h.get('host') || 'localhost:3000'
  const base = `${proto}://${host}`
  const success = `${base}/orders/${booking.id}`
  const cancel = `${base}/orders/${booking.id}`

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      productId
        ? {
            price_data: {
              product: productId,
              currency: 'usd',
              unit_amount: amountCents,
            },
            quantity: 1,
          }
        : {
            price_data: {
              currency: 'usd',
              unit_amount: amountCents,
              product_data: { name: 'Skymarket Booking' },
            },
            quantity: 1,
          },
    ],
    success_url: success,
    cancel_url: cancel,
    metadata: { booking_id: booking.id },
  })

  return NextResponse.json({ data: { id: session.id, url: session.url }, error: null })
}



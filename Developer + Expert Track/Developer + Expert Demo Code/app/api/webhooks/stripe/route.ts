import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { sendBookingEmail } from '@/lib/resend'
import type Stripe from 'stripe'

// Next.js App Router: ensure we read the raw body for Stripe signature verification
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function getRawBody(req: Request) {
  const buf = await req.arrayBuffer()
  return Buffer.from(buf)
}

export async function POST(req: Request) {
  const headerStore = await headers()
  const sig = headerStore.get('stripe-signature') as string | null
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig || !webhookSecret) {
    return NextResponse.json({ received: false }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    const rawBody = await getRawBody(req)
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err) {
    return NextResponse.json({ error: { message: (err as Error).message } }, { status: 400 })
  }

  try {
    const debug = process.env.STRIPE_WEBHOOK_DEBUG === 'true'
    if (debug) console.log('[stripe][webhook] received', { type: event.type, id: event.id })

    async function setStatusByBookingId(bookingId: string, fields: Record<string, unknown>) {
      const { error } = await supabaseAdmin.from('bookings').update(fields as never).eq('id', bookingId)
      if (error) console.error('[stripe][webhook] supabase update error (by booking)', error)
    }

    async function setStatusByPaymentIntentId(paymentIntentId: string, fields: Record<string, unknown>) {
      const { data: found, error: findErr } = await supabaseAdmin
        .from('bookings')
        .select('id')
        .eq('payment_intent_id', paymentIntentId)
        .maybeSingle()
      if (findErr) console.error('[stripe][webhook] supabase fetch by PI error', findErr)
      if (found?.id) {
        await setStatusByBookingId(found.id, fields)
      }
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const bookingId = (session.metadata as Record<string, string> | null | undefined)?.booking_id
        const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : undefined
        if (bookingId) {
          await setStatusByBookingId(bookingId, { payment_status: 'paid', payment_intent_id: paymentIntentId ?? undefined })
        } else if (paymentIntentId) {
          await setStatusByPaymentIntentId(paymentIntentId, { payment_status: 'paid' })
        }
        break
      }
      case 'payment_intent.succeeded': {
        const intent = event.data.object as Stripe.PaymentIntent
        const bookingId = intent.metadata?.booking_id
        if (bookingId) {
          await supabaseAdmin
            .from('bookings')
            .update({ payment_status: 'paid' })
            .eq('id', bookingId)

          // notify consumer and provider
          const { data: booking } = await supabaseAdmin
            .from('bookings')
            .select('id, listing_id, provider_id, consumer_id, price_total')
            .eq('id', bookingId)
            .single()
          if (booking) {
            const [{ data: listing }, { data: consumer }, { data: providerOwner }] = await Promise.all([
              supabaseAdmin.from('listings').select('title').eq('id', booking.listing_id).single(),
              supabaseAdmin.from('profiles').select('email, full_name').eq('id', booking.consumer_id).single(),
              supabaseAdmin
                .from('providers')
                .select('user_id')
                .eq('id', booking.provider_id)
                .single(),
            ])
            const { data: providerProfile } = providerOwner?.user_id
              ? await supabaseAdmin.from('profiles').select('email, full_name').eq('id', providerOwner.user_id).single()
              : { data: null as unknown as { email: string; full_name: string | null } | null }
            const subject = `Payment received: ${listing?.title ?? 'Service'} (#${booking.id.slice(0, 8)})`
            const html = `<div><h2>Payment received</h2><p>Order ${booking.id} has been paid.</p><p>Total: $${Number(booking.price_total).toFixed(2)}</p></div>`
            if (consumer?.email) await sendBookingEmail({ to: consumer.email, subject, html })
            if (providerProfile?.email) await sendBookingEmail({ to: providerProfile.email, subject, html })
          }
        }
        break
      }
      case 'payment_intent.payment_failed': {
        const intent = event.data.object as Stripe.PaymentIntent
        const bookingId = intent.metadata?.booking_id
        if (bookingId) {
          await setStatusByBookingId(bookingId, { payment_status: 'failed' })
        } else {
          await setStatusByPaymentIntentId(intent.id, { payment_status: 'failed' })
        }
        break
      }
      case 'payment_intent.canceled': {
        const intent = event.data.object as Stripe.PaymentIntent
        const bookingId = intent.metadata?.booking_id
        if (bookingId) {
          await setStatusByBookingId(bookingId, { payment_status: 'failed' })
        } else {
          await setStatusByPaymentIntentId(intent.id, { payment_status: 'failed' })
        }
        break
      }
      case 'charge.captured': {
        // Funds moved after capture (escrow release)
        const charge = event.data.object as Stripe.Charge
        const bookingId = charge.metadata?.booking_id
        if (bookingId) {
          await setStatusByBookingId(bookingId, { payment_status: 'paid' })
        } else if (typeof charge.payment_intent === 'string') {
          await setStatusByPaymentIntentId(charge.payment_intent, { payment_status: 'paid' })
        }
        break
      }
      case 'charge.succeeded': {
        const charge = event.data.object as Stripe.Charge
        const bookingId = charge.metadata?.booking_id
        if (bookingId) {
          await setStatusByBookingId(bookingId, { payment_status: 'paid' })
        } else if (typeof charge.payment_intent === 'string') {
          await setStatusByPaymentIntentId(charge.payment_intent, { payment_status: 'paid' })
        }
        break
      }
      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        const bookingId = charge.metadata?.booking_id
        if (bookingId) {
          await setStatusByBookingId(bookingId, { payment_status: 'refunded' })
        } else if (typeof charge.payment_intent === 'string') {
          await setStatusByPaymentIntentId(charge.payment_intent, { payment_status: 'refunded' })
        }
        break
      }
      case 'charge.updated': {
        const charge = event.data.object as Stripe.Charge
        if (charge.refunded) {
          const bookingId = charge.metadata?.booking_id
          if (bookingId) {
            await setStatusByBookingId(bookingId, { payment_status: 'refunded' })
          } else if (typeof charge.payment_intent === 'string') {
            await setStatusByPaymentIntentId(charge.payment_intent, { payment_status: 'refunded' })
          }
        }
        break
      }
      default:
        if (debug) console.log('[stripe][webhook] unhandled', event.type)
        break
    }
  } catch (err) {
    console.error('[stripe][webhook] handler error', err)
    return NextResponse.json({ error: { message: (err as Error).message } }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}



import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'
import { createPaymentIntentForBooking } from '@/lib/stripe/server'
import { sendBookingEmail } from '@/lib/resend'

type BookingsInsert = Database['public']['Tables']['bookings']['Insert']

const createOrderSchema = z.object({
  listingId: z.string().uuid(),
  scheduledAt: z.string().datetime(),
  pickupAddress: z.string().optional().nullable(),
  dropoffAddress: z.string().min(1),
  specialInstructions: z.string().optional().nullable(),
  // Optional inputs for flexible pricing
  distanceMiles: z.number().nonnegative().optional(),
  durationMinutes: z.number().nonnegative().optional(),
  pickupLat: z.number().optional(),
  pickupLng: z.number().optional(),
  dropoffLat: z.number().optional(),
  dropoffLng: z.number().optional(),
})

function computePriceTotal(
  listing: { price_base: number; price_per_mile: number | null; price_per_minute: number | null },
  distanceMiles?: number,
  durationMinutes?: number,
) {
  const base = Number(listing.price_base || 0)
  const perMile = Number(listing.price_per_mile || 0)
  const perMin = Number(listing.price_per_minute || 0)
  const variable = (distanceMiles ?? 0) * perMile + (durationMinutes ?? 0) * perMin
  const total = base + variable
  return Math.max(0, Math.round(total * 100) / 100)
}

function haversineMiles(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (x: number) => (x * Math.PI) / 180
  const R = 3958.8 // miles
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
  return R * c
}

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ data: null, error: { code: 'AUTHENTICATION_REQUIRED', message: 'Login required' } }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const role = searchParams.get('role') // 'consumer' | 'provider' | null

  let query = supabase
    .from('bookings')
    .select('id, status, scheduled_at, pickup_address, dropoff_address, special_instructions, price_total, consumer_id, provider_id, listing:listing_id(id, title)')
    .order('created_at', { ascending: false })

  if (role === 'provider') {
    // Filter by bookings where the current user is the provider's owner
    const { data: prov } = await supabase.from('providers').select('id').eq('user_id', user.id).single()
    if (prov?.id) query = query.eq('provider_id', prov.id)
  } else {
    query = query.eq('consumer_id', user.id)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ data: null, error: { code: 'INTERNAL_ERROR', message: error.message } }, { status: 500 })
  return NextResponse.json({ data, error: null })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ data: null, error: { code: 'AUTHENTICATION_REQUIRED', message: 'Login required' } }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const parsed = createOrderSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { data: null, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: parsed.error.flatten() } },
      { status: 400 },
    )
  }

  const p = parsed.data
  // Accept any schedule (client restricts UI). Validate only that it's a valid date string.
  const scheduledDate = new Date(p.scheduledAt)
  if (Number.isNaN(scheduledDate.valueOf())) {
    return NextResponse.json({ data: null, error: { code: 'INVALID_SCHEDULE', message: 'Invalid date/time selected' } }, { status: 400 })
  }
  const { data: listing, error: listingErr } = await supabase
    .from('listings')
    .select('id, provider_id, price_base, price_per_mile, price_per_minute')
    .eq('id', p.listingId)
    .single()
  if (listingErr || !listing) return NextResponse.json({ data: null, error: { code: 'RESOURCE_NOT_FOUND', message: 'Listing not found' } }, { status: 404 })

  let distanceMiles = p.distanceMiles
  if (
    distanceMiles === undefined &&
    typeof p.pickupLat === 'number' &&
    typeof p.pickupLng === 'number' &&
    typeof p.dropoffLat === 'number' &&
    typeof p.dropoffLng === 'number'
  ) {
    distanceMiles = haversineMiles(
      { lat: p.pickupLat, lng: p.pickupLng },
      { lat: p.dropoffLat, lng: p.dropoffLng },
    )
  }

  const priceTotal = computePriceTotal(listing, distanceMiles, p.durationMinutes)

  const bookingInsert: BookingsInsert = {
    consumer_id: user.id,
    provider_id: listing.provider_id,
    listing_id: listing.id,
    scheduled_at: scheduledDate.toISOString(),
    pickup_address: p.pickupAddress ?? null,
    pickup_lat: typeof p.pickupLat === 'number' ? p.pickupLat : null,
    pickup_lng: typeof p.pickupLng === 'number' ? p.pickupLng : null,
    dropoff_address: p.dropoffAddress,
    dropoff_lat: typeof p.dropoffLat === 'number' ? p.dropoffLat : 0,
    dropoff_lng: typeof p.dropoffLng === 'number' ? p.dropoffLng : 0,
    special_instructions: p.specialInstructions ?? null,
    price_total: priceTotal,
    payment_intent_id: null,
    payment_status: 'pending',
  }

  const { data: created, error: insertErr } = await supabase
    .from('bookings')
    .insert(bookingInsert as never)
    .select('id')
    .single()
  if (insertErr || !created) return NextResponse.json({ data: null, error: { code: 'INTERNAL_ERROR', message: insertErr?.message || 'Create failed' } }, { status: 500 })

  // Consumer email for receipt
  const { data: profile } = await supabase.from('profiles').select('email').eq('id', user.id).single()

  // Create Stripe PaymentIntent with manual capture
  const amountCents = Math.round(priceTotal * 100)
  const { paymentIntentId, clientSecret } = await createPaymentIntentForBooking({
    bookingId: created.id,
    amountCents,
    consumerEmail: profile?.email ?? null,
    listingId: listing.id,
    providerId: listing.provider_id,
  })

  await supabase
    .from('bookings')
    .update({ payment_intent_id: paymentIntentId })
    .eq('id', created.id)

  // Send confirmation emails (best-effort)
  try {
    const [{ data: listingDetail }, { data: providerRow }] = await Promise.all([
      supabase.from('listings').select('title, provider_id').eq('id', listing.id).single(),
      supabase.from('providers').select('user_id').eq('id', listing.provider_id).single(),
    ])

    const [{ data: consumerProfile }, { data: providerProfile }] = await Promise.all([
      supabase.from('profiles').select('email, full_name').eq('id', user.id).single(),
      providerRow?.user_id
        ? supabase.from('profiles').select('email, full_name').eq('id', providerRow.user_id).single()
        : Promise.resolve({ data: null } as unknown as { data: { email: string; full_name: string | null } | null }),
    ])

    const subject = `Order created: ${listingDetail?.title ?? 'Service'} (#${created.id.slice(0, 8)})`
    const html = `
      <div>
        <h2>Order Created</h2>
        <p>Order ID: <strong>${created.id}</strong></p>
        <p>Service: ${listingDetail?.title ?? 'Service'}</p>
        <p>Scheduled At: ${new Date(p.scheduledAt).toLocaleString()}</p>
        <p>Dropoff: ${p.dropoffAddress}</p>
        <p>Total: $${priceTotal.toFixed(2)}</p>
      </div>
    `
    if (consumerProfile?.email) {
      await sendBookingEmail({ to: consumerProfile.email, subject, html })
    }
    if (providerProfile?.email) {
      await sendBookingEmail({ to: providerProfile.email, subject, html })
    }
  } catch {
    // Do not fail the request on email errors
  }

  return NextResponse.json({ data: { id: created.id, clientSecret }, error: null }, { status: 201 })
}



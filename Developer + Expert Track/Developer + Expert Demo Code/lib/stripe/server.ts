import Stripe from 'stripe'

const stripeApiKey = process.env.STRIPE_SECRET_KEY

if (!stripeApiKey) {
  // Fail fast on missing configuration in server runtime
  throw new Error('Missing STRIPE_SECRET_KEY environment variable')
}

export const stripe = new Stripe(stripeApiKey)

export type CreatePaymentIntentParams = {
  bookingId: string
  amountCents: number
  currency?: string
  consumerEmail?: string | null
  listingId: string
  providerId: string
}

export async function createPaymentIntentForBooking(params: CreatePaymentIntentParams) {
  const { bookingId, amountCents, consumerEmail, listingId, providerId } = params
  const currency = params.currency ?? 'usd'

  const intent = await stripe.paymentIntents.create(
    {
      amount: amountCents,
      currency,
      // Enable dynamic payment methods
      automatic_payment_methods: { enabled: true },
      // Escrow pattern: authorize now, capture on completion
      capture_method: 'manual',
      metadata: {
        booking_id: bookingId,
        listing_id: listingId,
        provider_id: providerId,
      },
      receipt_email: consumerEmail ?? undefined,
    },
    {
      // Safeguard against duplicate requests per booking
      idempotencyKey: `booking:${bookingId}`,
    },
  )

  return {
    paymentIntentId: intent.id,
    clientSecret: intent.client_secret,
  }
}



'use client'

import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import type { StripeElementsOptions } from '@stripe/stripe-js'
import { getStripe } from '@/lib/stripe/client'
import { useCallback, useMemo, useState } from 'react'

type StripePaymentProps = {
  clientSecret: string
  onSuccess?: () => void
}

export function StripePaymentContainer(props: StripePaymentProps) {
  const stripePromise = useMemo(() => getStripe(), [])
  const options = useMemo<StripeElementsOptions>(() => ({ clientSecret: props.clientSecret }), [props.clientSecret])
  return (
    <Elements stripe={stripePromise} options={options}>
      <StripePaymentInner onSuccess={props.onSuccess} />
    </Elements>
  )
}

function StripePaymentInner({ onSuccess }: { onSuccess?: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = useCallback(async () => {
    if (!stripe || !elements) return
    setIsLoading(true)
    setError(null)
    // Validate before confirm
    const { error: submitError } = await elements.submit()
    if (submitError) {
      setIsLoading(false)
      setError(submitError.message ?? 'Validation failed')
      return
    }

    const returnUrl = `${window.location.origin}/booking/confirmation`
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
      redirect: 'if_required',
    })
    setIsLoading(false)
    if (error) {
      setError(error.message ?? 'Payment failed')
      return
    }
    if (paymentIntent && (paymentIntent.status === 'succeeded' || paymentIntent.status === 'requires_capture')) {
      onSuccess?.()
    }
  }, [stripe, elements, onSuccess])

  return (
    <div className="space-y-3">
      <PaymentElement />
      {error && <div className="text-sm text-red-600">{error}</div>}
      <button
        type="button"
        className="w-full rounded-md bg-black text-white py-2 text-sm disabled:opacity-50"
        onClick={handleSubmit}
        disabled={!stripe || isLoading}
      >
        {isLoading ? 'Processing…' : 'Pay now'}
      </button>
    </div>
  )
}



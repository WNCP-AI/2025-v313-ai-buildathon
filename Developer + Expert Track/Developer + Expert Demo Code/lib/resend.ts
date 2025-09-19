import { Resend } from 'resend'

let resendClient: Resend | null = null
const apiKey = process.env.RESEND_API_KEY
if (apiKey) {
  resendClient = new Resend(apiKey)
}

type BookingEmail = {
  to: string
  subject: string
  html: string
}

export async function sendBookingEmail(params: BookingEmail) {
  const from = process.env.RESEND_FROM_EMAIL || 'no-reply@skymarket.app'
  if (!resendClient) return
  return resendClient.emails.send({ from, to: params.to, subject: params.subject, html: params.html })
}



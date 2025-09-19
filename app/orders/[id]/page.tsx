import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import type Stripe from "stripe"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Booking = {
  id: string
  status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled"
  scheduled_at: string
  pickup_address: string | null
  dropoff_address: string
  special_instructions: string | null
  price_total: number
  consumer_id: string
  provider_id: string
  listing: { id: string; title: string }
  provider_user_id: string
  payment_intent_id?: string | null
  payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
}

async function updateStatus(formData: FormData) {
  "use server"
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const id = String(formData.get("id"))
  const next = String(formData.get("next")) as Booking["status"]

  // RLS will enforce ownership (consumer or provider)
  await supabase.from("bookings").update({ status: next }).eq("id", id)

  revalidatePath(`/orders/${id}`)
}

async function sendMessage(formData: FormData) {
  "use server"
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const bookingId = String(formData.get("bookingId"))
  const content = String(formData.get("content") || "").trim()
  if (!content) return

  // Fetch booking to determine recipient
  const { data: booking } = await supabase
    .from("bookings")
    .select("id, consumer_id, provider_id")
    .eq("id", bookingId)
    .single()

  if (!booking) return

  const { data: providerData } = await supabase
    .from("providers")
    .select("user_id")
    .eq("id", booking.provider_id)
    .single()

  const recipientId = user.id === booking.consumer_id ? providerData?.user_id : booking.consumer_id

  await supabase
    .from("messages")
    .insert({ booking_id: bookingId, sender_id: user.id, recipient_id: recipientId!, content })

  revalidatePath(`/orders/${bookingId}`)
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: booking } = await supabase
    .from("bookings")
    .select("id, status, scheduled_at, pickup_address, dropoff_address, special_instructions, price_total, payment_status, consumer_id, provider_id, payment_intent_id, listing:listing_id(id, title)")
    .eq("id", id)
    .single()

  if (!booking) redirect("/dashboard")

  const { data: provData } = await supabase
    .from("providers")
    .select("user_id")
    .eq("id", booking.provider_id)
    .single()

  const isConsumer = booking.consumer_id === user.id
  const isProvider = provData?.user_id === user.id

  // Allowed transitions (consumer "Cancel" is now shown in header help area)
  const nextActions: { label: string; next: Booking["status"] }[] = []
  if (isProvider) {
    if (booking.status === "pending") nextActions.push({ label: "Accept", next: "accepted" })
    if (booking.status === "accepted") nextActions.push({ label: "Start", next: "in_progress" })
    if (booking.status === "in_progress") nextActions.push({ label: "Complete", next: "completed" })
  }

  const { data: messages } = await supabase
    .from("messages")
    .select("id, created_at, sender_id, recipient_id, content")
    .eq("booking_id", booking.id)
    .order("created_at", { ascending: true })

  const { data: myReview } = await supabase
    .from("reviews")
    .select("id")
    .eq("booking_id", booking.id)
    .eq("reviewer_id", user.id)
    .maybeSingle()

  // If paid, attempt to compute a receipt URL from Stripe server-side
  let receiptUrl: string | null = null
  try {
    if (booking.payment_status === 'paid' && booking.payment_intent_id) {
      const { stripe } = await import('@/lib/stripe/server')
      const pi = await stripe.paymentIntents.retrieve(booking.payment_intent_id, { expand: ['latest_charge'] })
      // latest_charge may be id or expanded object
      const latest = (pi.latest_charge ?? null) as string | Stripe.Charge | null
      if (latest && typeof latest === 'object' && 'receipt_url' in latest) {
        receiptUrl = (latest as Stripe.Charge).receipt_url ?? null
      } else if (typeof latest === 'string') {
        const charge = await stripe.charges.retrieve(latest)
        receiptUrl = charge.receipt_url ?? null
      }
    }
  } catch {
    receiptUrl = null
  }

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Order #{booking.id.slice(0, 8)}</h1>
          <Link href="/dashboard"><Button variant="outline">Dashboard</Button></Link>
        </div>
      </header>

      <section className="py-10 px-4">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-8">
          <div className="space-y-6">
            {isConsumer && booking.status === 'pending' && (
              <Card>
                <CardHeader>
                  <CardTitle>Need to cancel?</CardTitle>
                  <CardDescription>Cancellation applies to the service booking. If you made a payment, funds will be released per refund policy.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form action={updateStatus} className="inline">
                    <input type="hidden" name="id" value={booking.id} />
                    <input type="hidden" name="next" value="cancelled" />
                    <Button variant="outline">Cancel booking</Button>
                  </form>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardHeader>
                <CardTitle>{booking.listing?.title}</CardTitle>
                <CardDescription>Status: {booking.status}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div><span className="text-gray-600">Scheduled:</span> {new Date(booking.scheduled_at).toLocaleString()}</div>
                {booking.pickup_address && (
                  <div><span className="text-gray-600">Pickup:</span> {booking.pickup_address}</div>
                )}
                <div><span className="text-gray-600">Dropoff:</span> {booking.dropoff_address}</div>
                {booking.special_instructions && (
                  <div><span className="text-gray-600">Notes:</span> {booking.special_instructions}</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>Chat with the other party</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-72 overflow-auto mb-4">
                  {(messages ?? []).map((m) => (
                    <div key={m.id} className="text-sm">
                      <div className="text-gray-500">
                        {m.sender_id === user.id ? "You" : "Them"} • {m.created_at ? new Date(m.created_at).toLocaleTimeString() : "Unknown time"}
                      </div>
                      <div>{m.content}</div>
                    </div>
                  ))}
                </div>
                <form action={sendMessage} className="flex gap-2">
                  <input type="hidden" name="bookingId" value={booking.id} />
                  <Input name="content" placeholder="Type a message" />
                  <Button type="submit">Send</Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <aside>
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
                <CardDescription>Total</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Price</span><span>${"" + booking.price_total}</span></div>
                </div>
                {booking.payment_status === 'paid' ? (
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full bg-green-100 text-green-800 px-3 py-1 text-xs font-semibold">Paid</div>
                      {receiptUrl && (
                        <Link href={receiptUrl} target="_blank" className="text-sm underline">View receipt</Link>
                      )}
                    </div>
                    {!receiptUrl && (
                      <div className="text-xs text-gray-500 mt-2">Receipt will be available shortly after payment is finalized.</div>
                    )}
                  </div>
                ) : booking.status === "pending" && (
                  <div className="mt-4 space-y-3">
                    <form action={startCheckout}>
                      <input type="hidden" name="id" value={booking.id} />
                      <Button className="w-full">Pay with Stripe Checkout</Button>
                    </form>
                  </div>
                )}
                <div className="mt-4 space-x-2">
                  {nextActions.map((a) => (
                    <form key={a.next} action={updateStatus} className="inline">
                      <input type="hidden" name="id" value={booking.id} />
                      <input type="hidden" name="next" value={a.next} />
                      <Button>{a.label}</Button>
                    </form>
                  ))}
                </div>

                {isConsumer && booking.status === "completed" && !myReview && (
                  <div className="mt-6">
                    <Link href={`/orders/${booking.id}/review`}><Button variant="outline">Leave a Review</Button></Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </div>
  )
}
// Remove change-payment to keep checkout simple
async function startCheckout(formData: FormData) {
  "use server"
  const id = String(formData.get('id'))
  const h = await headers()
  const proto = h.get('x-forwarded-proto') || 'http'
  const host = h.get('x-forwarded-host') || h.get('host') || 'localhost:3000'
  const base = `${proto}://${host}`
  const cookieHeader = h.get('cookie') || ''
  const res = await fetch(`${base}/api/orders/${id}/checkout`, {
    method: 'POST',
    headers: { cookie: cookieHeader },
    cache: 'no-store',
  })
  if (!res.ok) return
  const { data } = await res.json()
  if (data?.url) {
    // Next.js server action redirect
    redirect(data.url)
  }
}
// Payment Element removed for simplicity


 

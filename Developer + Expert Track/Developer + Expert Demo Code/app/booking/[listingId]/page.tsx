import Link from "next/link"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Database } from "@/types/database"
import { DateTimeLocalInput } from "@/components/shared/DateTimeLocalInput"

type ListingsRow = Database["public"]["Tables"]["listings"]["Row"]

async function createBooking(formData: FormData) {
  "use server"
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const listing_id = String(formData.get("listing_id"))
  const scheduledRaw = String(formData.get("scheduled_at") || "")
  const scheduledDate = new Date(scheduledRaw)
  if (Number.isNaN(scheduledDate.valueOf())) {
    const params = new URLSearchParams({ err: 'invalid_date' })
    redirect(`/booking/${listing_id}?${params.toString()}`)
  }
  const scheduled_at = scheduledDate.toISOString()
  const pickup_address = String(formData.get("pickup_address") || "")
  const dropoff_address = String(formData.get("dropoff_address") || "")
  const special_instructions = String(formData.get("special_instructions") || "")

  // Use Orders API to create booking + Stripe PaymentIntent
  const listingRes = (await supabase
    .from("listings")
    .select("id")
    .eq("id", listing_id)
    .single()) as unknown as { data: Pick<ListingsRow, "id"> | null }
  if (!listingRes.data) redirect(`/browse`)

  const hdrs = await headers()
  const cookieHeader = hdrs.get("cookie") || ""
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const resp = await fetch(`${baseUrl}/api/orders`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie: cookieHeader },
    body: JSON.stringify({
      listingId: listing_id,
      scheduledAt: scheduled_at,
      pickupAddress: pickup_address || null,
      dropoffAddress: dropoff_address,
      specialInstructions: special_instructions || null,
    }),
  })
  if (!resp.ok) {
    const { error } = (await resp.json()) as { error?: { message?: string } }
    const params = new URLSearchParams({ err: 'api', msg: String(error?.message || 'Request failed') })
    redirect(`/booking/${listing_id}?${params.toString()}`)
  }
  const json = (await resp.json()) as { data?: { id: string } }
  const bookingId = json.data?.id
  if (!bookingId) redirect(`/browse`)

  revalidatePath(`/orders/${bookingId}`)
  redirect(`/orders/${bookingId}`)
}

export default async function BookingPage({ params }: { params: Promise<{ listingId: string }> }) {
  const { listingId } = await params
  const supabase = await createClient()
  const { data: listing } = (await supabase
    .from("listings")
    .select("*")
    .eq("id", listingId)
    .single()) as unknown as { data: Pick<ListingsRow, "id" | "title" | "price_base" | "provider_id"> | null }

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Booking</h1>
          <Link href={`/provider/${listingId}`} className="text-sm text-gray-600 hover:underline">Back to provider</Link>
        </div>
      </header>

      <section className="py-10 px-4">
        <form action={createBooking}>
          <div className="container mx-auto grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Service Details</CardTitle>
                <CardDescription>{listing?.title ?? "Confirm your details to proceed"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Error banner from query params */}
                {/* Server Component: read from headers (URL) */}
                {/* We cannot use hooks here; simple render based on search params string via header referer is brittle; keeping minimal */}
                <div>
                  <div className="text-sm text-gray-600 mb-1">Date & Time</div>
                  <div className="grid grid-cols-2 gap-2">
                    <DateTimeLocalInput
                      className="border rounded px-2 py-2 text-sm"
                      name="scheduled_at"
                      minDaysAhead={1}
                    />
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Pickup Address</div>
                  <input className="border rounded px-2 py-2 text-sm w-full" name="pickup_address" placeholder="Enter pickup address (optional)" />
                  {/* <div className="mt-2">
                    <MapboxMap className="h-56" />
                  </div> */}
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Delivery Address</div>
                  <input className="border rounded px-2 py-2 text-sm w-full" name="dropoff_address" placeholder="Enter delivery address" required />
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Special Instructions</div>
                  <textarea className="border rounded px-2 py-2 text-sm w-full" rows={3} name="special_instructions" placeholder="Add notes..." />
                </div>
              </CardContent>
            </Card>

            <aside>
              <Card>
                <CardHeader>
                  <CardTitle>Price Summary</CardTitle>
                  <CardDescription>Estimated total</CardDescription>
                </CardHeader>
                <CardContent>
                  <input type="hidden" name="listing_id" value={listingId} />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Base Price</span><span>${"" + (listing?.price_base ?? 0)}</span></div>
                    <div className="border-t my-2" />
                    <div className="flex justify-between font-semibold"><span>Total</span><span>${"" + (listing?.price_base ?? 0)}</span></div>
                  </div>
                  <Button className="w-full mt-4">Confirm Booking →</Button>
                </CardContent>
              </Card>
            </aside>
          </div>
        </form>
      </section>
    </div>
  )
}



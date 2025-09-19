import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Database } from "@/types/database"

type ReviewsInsert = Database["public"]["Tables"]["reviews"]["Insert"]
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

async function submitReview(formData: FormData) {
  "use server"
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const booking_id = String(formData.get("booking_id"))
  const rating = Number(formData.get("rating"))
  const comment = String(formData.get("comment") || "").trim()

  // Get counterparty profile id
  const { data: booking } = await supabase
    .from("bookings")
    .select("consumer_id, provider_id")
    .eq("id", booking_id)
    .single()

  if (!booking) redirect("/dashboard")

  const { data: provider } = await supabase
    .from("providers")
    .select("user_id")
    .eq("id", booking.provider_id)
    .single()

  const reviewed_id = user.id === booking.consumer_id ? provider!.user_id : booking.consumer_id

  await (supabase
    .from("reviews")
    .insert({ booking_id, reviewer_id: user.id, reviewed_id, rating, comment: comment || null } as ReviewsInsert))

  revalidatePath(`/orders/${booking_id}`)
  redirect(`/orders/${booking_id}`)
}

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  // Ensure booking is completed and user is participant
  const { data: booking } = await supabase
    .from("bookings")
    .select("id, status, consumer_id, provider_id, listing:listing_id(title)")
    .eq("id", id)
    .single()

  if (!booking || booking.status !== "completed" || (booking.consumer_id !== user.id && (await supabase.from("providers").select("user_id").eq("id", booking.provider_id).single()).data?.user_id !== user.id)) {
    redirect(`/orders/${id}`)
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Review: {booking.listing?.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={submitReview} className="space-y-4">
              <input type="hidden" name="booking_id" value={id} />
              <div className="space-y-2">
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Input id="rating" name="rating" type="number" min={1} max={5} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment">Comment (optional)</Label>
                <Input id="comment" name="comment" />
              </div>
              <Button type="submit">Submit Review</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



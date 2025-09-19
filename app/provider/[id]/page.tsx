import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ProviderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: providerId } = await params
  const supabase = await createClient()
  const { data: provider } = await supabase
    .from("providers")
    .select("id, user_id, type, rating, verified, completed_jobs")
    .eq("id", providerId)
    .single()

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", provider?.user_id || "00000000-0000-0000-0000-000000000000")
    .single()

  const { data: listings } = await supabase
    .from("listings")
    .select("id, title, category, price_base")
    .eq("provider_id", providerId)
    .eq("active", true)
    .order("updated_at", { ascending: false })

  const { data: recentReviews } = await supabase
    .from("reviews")
    .select("rating, comment")
    .in("reviewed_id", [provider?.user_id || "00000000-0000-0000-0000-000000000000"])
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">
              <Link href="/browse" className="hover:underline">Browse</Link> / <span>Provider</span>
            </div>
            <h1 className="text-2xl font-bold mt-1">{profile?.full_name || "Provider"}</h1>
          </div>
          <Link href={`/booking/${provider?.id}`}>
            <Button>Book This Service</Button>
          </Link>
        </div>
      </header>

      <section className="py-10 px-4">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-8">
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>About This Operator</CardTitle>
                <CardDescription>
                  ⭐ {provider?.rating?.toFixed?.(1) ?? "0.0"} {provider?.verified ? "• ✓ Verified" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Completed jobs: {provider?.completed_jobs ?? 0}</p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Services Offered</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc ml-5 space-y-2">
                  {(listings ?? []).map((l) => (
                    <li key={l.id}>{l.title} — ${"" + l.price_base}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(recentReviews ?? []).map((r, idx) => (
                  <div key={idx}>
                    <div className="font-medium">Rating: {r.rating} ⭐</div>
                    {r.comment ? (
                      <div className="text-sm text-gray-600">“{r.comment}”</div>
                    ) : null}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <aside>
            <Card>
              <CardHeader>
                <CardTitle>Book This Service</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600">Date & Time</div>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <input className="border rounded px-2 py-2 text-sm" type="date" />
                      <input className="border rounded px-2 py-2 text-sm" type="time" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Location</div>
                    <input className="border rounded px-2 py-2 text-sm w-full" placeholder="Address" />
                  </div>
                  <Link href={`/booking/${provider?.id ?? providerId}`}>
                    <Button className="w-full">Book Now →</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </div>
  )
}



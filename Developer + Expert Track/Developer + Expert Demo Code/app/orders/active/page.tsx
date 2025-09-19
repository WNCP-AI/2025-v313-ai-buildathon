import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type BookingRow = {
  id: string
  status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled"
  scheduled_at: string
  pickup_address: string | null
  dropoff_address: string
  special_instructions: string | null
  price_total: number
  consumer_id: string
  provider_id: string
  listing: { id: string; title: string } | null
}

const ACTIVE_STATUSES: BookingRow["status"][] = ["pending", "accepted", "in_progress"]

function isActiveStatus(value: string): value is BookingRow["status"] {
  return (ACTIVE_STATUSES as string[]).includes(value)
}

function statusBadgeClass(status: BookingRow["status"]) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "accepted":
      return "bg-blue-100 text-blue-800"
    case "in_progress":
      return "bg-indigo-100 text-indigo-800"
    case "completed":
      return "bg-green-100 text-green-800"
    case "cancelled":
      return "bg-gray-200 text-gray-700"
    default:
      return "bg-gray-200 text-gray-700"
  }
}

export default async function ActiveOrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const q = (typeof params.q === "string" ? params.q : "").trim()
  const role = (typeof params.role === "string" ? params.role : "consumer") as
    | "consumer"
    | "provider"
  const statusParam = typeof params.status === "string" ? params.status : ""
  const from = typeof params.from === "string" ? params.from : ""
  const to = typeof params.to === "string" ? params.to : ""

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  // Provider scope (if selected)
  let providerId: string | null = null
  if (role === "provider") {
    const { data: prov } = await supabase
      .from("providers")
      .select("id")
      .eq("user_id", user.id)
      .single()
    providerId = prov?.id ?? null
  }

  // Base query for active statuses
  let query = supabase
    .from("bookings")
    .select(
      "id, status, scheduled_at, pickup_address, dropoff_address, special_instructions, price_total, consumer_id, provider_id, listing:listing_id(id, title)",
    )
    .in("status", ACTIVE_STATUSES)
    .order("scheduled_at", { ascending: false })

  if (role === "provider") {
    if (providerId) query = query.eq("provider_id", providerId)
    else {
      // No provider profile; nothing to show
      query = query.eq("provider_id", "00000000-0000-0000-0000-000000000000")
    }
  } else {
    query = query.eq("consumer_id", user.id)
  }

  if (from) {
    // include start of day
    const start = new Date(from)
    if (!Number.isNaN(start.getTime())) query = query.gte("scheduled_at", start.toISOString())
  }
  if (to) {
    const end = new Date(to)
    if (!Number.isNaN(end.getTime())) query = query.lte("scheduled_at", end.toISOString())
  }

  if (statusParam && isActiveStatus(statusParam)) {
    query = query.eq("status", statusParam)
  }

  const { data: rows, error } = await query
  if (error) {
    // Surface minimal error to user
    return (
      <div className="p-6">
        <div className="text-red-600">Failed to load orders: {error.message}</div>
      </div>
    )
  }

  // Text search on listing title / addresses (client-side for now)
  const filtered = (rows ?? []).filter((r) => {
    if (!q) return true
    const hay = [
      r.id,
      r.listing?.title ?? "",
      r.dropoff_address ?? "",
      r.pickup_address ?? "",
    ]
      .join("\n")
      .toLowerCase()
    return hay.includes(q.toLowerCase())
  }) as BookingRow[]

  // Recent orders (last 5 regardless of status)
  let recent: BookingRow[] = []
  {
    let rq = supabase
      .from("bookings")
      .select(
        "id, status, scheduled_at, pickup_address, dropoff_address, special_instructions, price_total, consumer_id, provider_id, listing:listing_id(id, title)",
      )
      .order("created_at", { ascending: false })
      .limit(5)
    if (role === "provider") {
      if (providerId) rq = rq.eq("provider_id", providerId)
      else rq = rq.eq("provider_id", "00000000-0000-0000-0000-000000000000")
    } else {
      rq = rq.eq("consumer_id", user.id)
    }
    const { data } = await rq
    recent = (data ?? []) as BookingRow[]
  }

  const allActiveStatuses: BookingRow["status"][] = ACTIVE_STATUSES

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Active Orders</h1>
          <div className="flex items-center gap-2">
            <Link href="/orders/history">
              <Button variant="outline">Order History</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="py-8 px-4">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Search & Filters</CardTitle>
                <CardDescription>Filter by text, role, status, and date</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="grid grid-cols-1 md:grid-cols-5 gap-3" method="GET">
                  <Input name="q" placeholder="Search orders" defaultValue={q} className="md:col-span-2" />
                  <select name="role" defaultValue={role} className="h-10 rounded-md border px-3 text-sm">
                    <option value="consumer">As consumer</option>
                    <option value="provider">As provider</option>
                  </select>
                  <select name="status" defaultValue={statusParam} className="h-10 rounded-md border px-3 text-sm">
                    <option value="">Any status</option>
                    {allActiveStatuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2 items-center">
                    <Input type="date" name="from" defaultValue={from} />
                    <span className="text-xs text-gray-500">to</span>
                    <Input type="date" name="to" defaultValue={to} />
                  </div>
                  <div className="md:col-span-5 flex gap-2">
                    <Button type="submit">Apply</Button>
                    <Link href="/orders/active" className="inline-flex items-center">
                      <Button type="button" variant="outline">
                        Clear
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>

            {(filtered ?? []).length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No active orders</CardTitle>
                  <CardDescription>Try adjusting your filters.</CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <div className="space-y-4">
                {(filtered ?? []).map((b) => (
                  <Card key={b.id}>
                    <CardHeader className="flex-row items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-base">
                          <Link href={`/orders/${b.id}`} className="underline">
                            {b.listing?.title || "Service"}
                          </Link>
                        </CardTitle>
                        <CardDescription>
                          {new Date(b.scheduled_at).toLocaleString()} • ${"" + b.price_total}
                        </CardDescription>
                      </div>
                      <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(b.status)}`}>
                        {b.status}
                      </div>
                    </CardHeader>
                    <CardContent className="text-sm space-y-1">
                      {b.pickup_address && (
                        <div>
                          <span className="text-gray-600">Pickup:</span> {b.pickup_address}
                        </div>
                      )}
                      <div>
                        <span className="text-gray-600">Dropoff:</span> {b.dropoff_address}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent orders</CardTitle>
                <CardDescription>Quick links</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {recent.length === 0 && <div className="text-gray-500">No recent orders</div>}
                {recent.map((r) => (
                  <div key={r.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <Link href={`/orders/${r.id}`} className="truncate block underline">
                        {r.listing?.title || "Service"}
                      </Link>
                      <div className="text-xs text-gray-500 truncate">#{r.id.slice(0, 8)} • {new Date(r.scheduled_at).toLocaleDateString()}</div>
                    </div>
                    <div className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusBadgeClass(r.status)}`}>
                      {r.status}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </div>
  )
}



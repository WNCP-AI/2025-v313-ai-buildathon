import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { Home, ListChecks, History as HistoryIcon, Settings } from "lucide-react"

type BookingRow = {
  id: string
  status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled"
  created_at: string | null
  scheduled_at: string
  price_total: number
  listing: { title: string } | null
  payment_status?: "pending" | "paid" | "failed" | "refunded" | null
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(n || 0))
}

function paymentBadgeClass(status: BookingRow["payment_status"]) {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "failed":
      return "bg-red-100 text-red-800"
    case "refunded":
      return "bg-slate-200 text-slate-800"
    default:
      return "bg-gray-200 text-gray-700"
  }
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

export default async function ConsumerDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Not logged in → show minimal message
  if (!user) {
    return (
      <div className="min-h-screen">
        <section className="py-10 px-4">
          <div className="container mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Sign in required</CardTitle>
                <CardDescription>Please log in to view your dashboard.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </div>
    )
  }

  // Counts
  const [totalCountRes, activeCountRes] = await Promise.all([
    supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('consumer_id', user.id),
    supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('consumer_id', user.id)
      .in('status', ['pending', 'accepted', 'in_progress']),
  ])

  const totalOrders = totalCountRes.count ?? 0
  const activeOrders = activeCountRes.count ?? 0

  // Recent
  const { data: recent } = await supabase
    .from('bookings')
    .select('id, status, created_at, scheduled_at, price_total, payment_status, listing:listing_id(title)')
    .eq('consumer_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10) as unknown as { data: BookingRow[] | null }

  const recentRows = (recent ?? []).map((b) => ({
    id: b.id,
    time: new Date(b.created_at ?? b.scheduled_at).toLocaleString(),
    status: b.status,
    title: b.listing?.title ?? 'Service',
    amount: formatCurrency(Number(b.price_total || 0)),
    payment: (b.payment_status ?? 'pending') as NonNullable<BookingRow["payment_status"]>,
  }))

  return (
    <div className="min-h-screen">
      <section className="py-10 px-4">
        <div className="container mx-auto">
          {/* Quick links: compact, horizontal, iconified */}
          <nav className="mb-6">
            <div className="flex flex-wrap gap-2">
              <Link
                href="/dashboard/consumer"
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm hover:bg-gray-50"
              >
                <Home className="h-4 w-4" />
                <span>Overview</span>
              </Link>
              <Link
                href="/orders/active"
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm hover:bg-gray-50"
              >
                <ListChecks className="h-4 w-4" />
                <span>Active Orders</span>
              </Link>
              <Link
                href="/orders/history"
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm hover:bg-gray-50"
              >
                <HistoryIcon className="h-4 w-4" />
                <span>Order History</span>
              </Link>
              <Link
                href="/dashboard/consumer/settings"
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm hover:bg-gray-50"
              >
                <Settings className="h-4 w-4" />
                <span>Account Settings</span>
              </Link>
            </div>
          </nav>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Active Orders</CardTitle>
                  <CardDescription>Currently in progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{activeOrders}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Orders</CardTitle>
                  <CardDescription>All time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalOrders}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Spent (last 10)</CardTitle>
                  <CardDescription>Recent orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {formatCurrency((recent ?? []).reduce((acc, r) => acc + Number(r.price_total || 0), 0))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm font-medium mb-2">
                  <div>Time</div><div>Status</div><div>Job</div><div>Payment</div><div className="text-right">Amount</div>
                </div>
                {(recentRows).map((r) => (
                  <Link
                    key={r.id}
                    href={`/orders/${r.id}`}
                    className="grid grid-cols-1 md:grid-cols-5 gap-4 py-2 border-t text-sm hover:bg-gray-50 rounded-md px-2 -mx-2"
                  >
                    <div>{r.time}</div>
                    <div>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${statusBadgeClass(r.status)}`}>
                        {r.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="underline">{r.title}</div>
                    <div>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${paymentBadgeClass(r.payment)}`}>
                        {r.payment}
                      </span>
                    </div>
                    <div className="text-right">{r.amount}</div>
                  </Link>
                ))}
                {recentRows.length === 0 && (
                  <div className="text-sm text-gray-500">No recent orders.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}



import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { Home, ListChecks, Layers, DollarSign, Plus } from "lucide-react"

type BookingStatus = "pending" | "accepted" | "in_progress" | "completed" | "cancelled"

function startOfLocalDayISO(): string {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(n || 0))
}

export default async function ProviderDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return (
      <div className="min-h-screen">
        <section className="py-10 px-4">
          <div className="container mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Sign in required</CardTitle>
                <CardDescription>Please log in to view your provider dashboard.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </div>
    )
  }

  const { data: provider } = await supabase
    .from('providers')
    .select('id, rating, completed_jobs')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!provider) {
    // Not onboarded
    return (
      <div className="min-h-screen">
        <section className="py-10 px-4">
          <div className="container mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Complete Provider Onboarding</CardTitle>
                <CardDescription>You don&apos;t have a provider profile yet.</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/provider/onboarding"><Button>Start Onboarding</Button></Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    )
  }

  const todayISO = startOfLocalDayISO()

  const [todayJobsRes, activeJobsRes, earningsRes, recentRes] = await Promise.all([
    supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('provider_id', provider.id).gte('created_at', todayISO),
    supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('provider_id', provider.id).in('status', ['pending', 'accepted', 'in_progress']),
    supabase
      .from('bookings')
      .select('price_total, status, created_at')
      .eq('provider_id', provider.id)
      .gte('created_at', todayISO),
    supabase
      .from('bookings')
      .select('id, status, created_at, scheduled_at, price_total, listing:listing_id(title)')
      .eq('provider_id', provider.id)
      .order('created_at', { ascending: false })
      .limit(8),
  ])

  const todaysJobs = todayJobsRes.count ?? 0
  const activeJobs = activeJobsRes.count ?? 0
  const earnedToday = (earningsRes.data ?? [])
    .filter((b) => (b.status as BookingStatus) === 'completed')
    .reduce((sum, b) => sum + Number(b.price_total || 0), 0)

  const recent = (recentRes.data ?? []).map((b) => ({
    id: b.id as string,
    status: b.status as BookingStatus,
    time: new Date((b.created_at as string) ?? (b.scheduled_at as string)).toLocaleString(),
    title: (b as { listing: { title: string } }).listing?.title ?? 'Service',
    amount: formatCurrency(Number(b.price_total || 0)),
  }))

  return (
    <div className="min-h-screen">
      <section className="py-10 px-4">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-[260px,1fr] gap-8">

          <div className="space-y-6">
            {/* Quick links: compact, horizontal, iconified (match consumer style) */}
            <nav className="mb-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/dashboard/provider"
                    className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm hover:bg-gray-50"
                  >
                    <Home className="h-4 w-4" />
                    <span>Overview</span>
                  </Link>
                  <Link
                    href="/dashboard/provider/active"
                    className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm hover:bg-gray-50"
                  >
                    <ListChecks className="h-4 w-4" />
                    <span>Active Jobs</span>
                  </Link>
                  <Link
                    href="/dashboard/provider/services"
                    className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm hover:bg-gray-50"
                  >
                    <Layers className="h-4 w-4" />
                    <span>Service Listings</span>
                  </Link>
                  <Link
                    href="/dashboard/provider/earnings"
                    className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm hover:bg-gray-50"
                  >
                    <DollarSign className="h-4 w-4" />
                    <span>Earnings</span>
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="/dashboard/provider/services"
                    className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm hover:bg-gray-50"
                  >
                    <Layers className="h-4 w-4" />
                    <span>Your Services</span>
                  </Link>
                  <Link href="/dashboard/provider/services/new">
                    <Button className="inline-flex items-center gap-2 rounded-full">
                      <Plus className="h-4 w-4" />
                      New Listing
                    </Button>
                  </Link>
                </div>
              </div>
            </nav>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Today&apos;s Jobs</CardTitle>
                  <CardDescription>Assigned to you</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{todaysJobs}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Earned</CardTitle>
                  <CardDescription>Today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatCurrency(earnedToday)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Avg Rating</CardTitle>
                  <CardDescription>From customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{provider.rating ? `⭐ ${Number(provider.rating).toFixed(1)}` : '—'}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Completed</CardTitle>
                  <CardDescription>All time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{provider.completed_jobs ?? 0}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Active Jobs</CardTitle>
                <CardDescription>{activeJobs} currently in progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recent.length === 0 && (
                  <div className="text-sm text-gray-500">No recent jobs.</div>
                )}
                {recent.map((j) => (
                  <Link key={j.id} href={`/orders/${j.id}`} className="flex items-center justify-between border p-3 rounded hover:bg-gray-50">
                    <div className="font-medium">{j.title}</div>
                    <div className="text-sm text-gray-600">{j.amount} • {j.time}</div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}



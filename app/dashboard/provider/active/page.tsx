import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type ActiveBooking = {
  id: string
  status: "pending" | "accepted" | "in_progress" | "completed" | "canceled"
  scheduled_at: string | null
  listing: { title: string | null } | null
}

export default async function ProviderActiveJobsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return (
      <div className="min-h-screen py-10 px-4">
        <div className="container mx-auto">
          <Card><CardHeader><CardTitle>Sign in required</CardTitle></CardHeader></Card>
        </div>
      </div>
    )
  }
  const { data: prov } = await supabase.from('providers').select('id').eq('user_id', user.id).maybeSingle()
  const providerId = prov?.id || ''
  const { data: bookingsRaw } = await supabase
    .from('bookings')
    .select('id, status, scheduled_at, listing:listing_id(title)')
    .eq('provider_id', providerId)
    .in('status', ['pending', 'accepted', 'in_progress'])
    .order('scheduled_at', { ascending: true })
  const bookings = bookingsRaw as ActiveBooking[] | null

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Active Jobs</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{(bookings?.length ?? 0)} jobs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(bookings ?? []).map((b) => (
              <Link key={b.id} href={`/orders/${b.id}`} className="flex items-center justify-between border rounded p-3 hover:bg-gray-50">
                <span className="font-medium">{b.listing?.title ?? 'Service'}</span>
                <span className="text-sm text-gray-600">{b.status.replace('_', ' ')} • {b.scheduled_at ? new Date(b.scheduled_at).toLocaleString() : ''}</span>
              </Link>
            ))}
            {(bookings?.length ?? 0) === 0 && (
              <div className="text-sm text-gray-500">No active jobs.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



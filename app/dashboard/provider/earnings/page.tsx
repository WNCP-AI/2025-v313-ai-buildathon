import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ProviderEarningsPage() {
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
  const { data: completed } = await supabase
    .from('bookings')
    .select('price_total, created_at')
    .eq('provider_id', providerId)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })

  const total = (completed ?? []).reduce((sum, b) => sum + Number(b.price_total || 0), 0)
  const last30 = (completed ?? []).filter((b) => new Date(b.created_at!).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000)
  const last30Total = last30.reduce((sum, b) => sum + Number(b.price_total || 0), 0)

  const fmt = (n: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n)

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="container mx-auto max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold">Earnings</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader><CardTitle>Total (all time)</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-bold">{fmt(total)}</div></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Last 30 days</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-bold">{fmt(last30Total)}</div></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Completed Orders</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-bold">{(completed ?? []).length}</div></CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}



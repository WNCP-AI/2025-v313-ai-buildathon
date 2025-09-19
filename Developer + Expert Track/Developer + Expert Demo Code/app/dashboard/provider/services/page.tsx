import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { requireProvider } from "@/lib/supabase/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Layers, Plus, ListChecks, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function ProviderServicesPage() {
  const supabase = await createClient()
  const provider = await requireProvider()

  const { data: listings } = await supabase
    .from("listings")
    .select("id, title, category, price_base, active, updated_at")
    .eq("provider_id", provider.id)
    .order("updated_at", { ascending: false })

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Quick links to mirror consumer style */}
        <nav className="mb-4">
          <div className="flex flex-wrap gap-2">
            <Link href="/dashboard/provider" className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm hover:bg-gray-50">
              <Home className="h-4 w-4" />
              <span>Overview</span>
            </Link>
            <Link href="/dashboard/provider/active" className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm hover:bg-gray-50">
              <ListChecks className="h-4 w-4" />
              <span>Active Jobs</span>
            </Link>
            <Link href="/dashboard/provider/services" className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm hover:bg-gray-50">
              <Layers className="h-4 w-4" />
              <span>Service Listings</span>
            </Link>
            <Link href="/dashboard/provider/earnings" className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm hover:bg-gray-50">
              <DollarSign className="h-4 w-4" />
              <span>Earnings</span>
            </Link>
          </div>
        </nav>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Your Service Listings</h1>
          <Link href="/dashboard/provider/services/new"><Button className="inline-flex items-center gap-2"><Plus className="h-4 w-4" /> New Listing</Button></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(listings ?? []).map((l) => (
            <Card key={l.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{l.title}</span>
                  <span className="text-sm text-muted-foreground">{l.active ? "Active" : "Inactive"}</span>
                </CardTitle>
                <CardDescription>{l.category} • ${"" + l.price_base}</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Link href={`/dashboard/provider/services/${l.id}/edit`}><Button variant="outline">Edit</Button></Link>
                <Link href={`/provider/${provider.id}`}><Button variant="ghost">View public</Button></Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}



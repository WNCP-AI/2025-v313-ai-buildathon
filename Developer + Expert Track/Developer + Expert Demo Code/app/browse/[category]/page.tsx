import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database } from "@/types/database"

type ServiceCategory = Database["public"]["Enums"]["service_category"]

const slugToCategory: Record<string, ServiceCategory> = {
  "food-delivery": "food_delivery",
  courier: "courier",
  "aerial-imaging": "aerial_imaging",
  "site-mapping": "site_mapping",
}

export default async function BrowseCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const mapped = slugToCategory[category]
  if (!mapped) return notFound()

  const supabase = await createClient()
  const { data: listings } = await supabase
    .from("listings")
    .select("id, title, description, price_base, provider_id")
    .eq("category", mapped)
    .eq("active", true)
    .order("updated_at", { ascending: false })

  const title = category
    .split("-")
    .map((s) => s[0]?.toUpperCase() + s.slice(1))
    .join(" ")

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{title}</h1>
          <Link href="/browse"><Button variant="outline">All Categories</Button></Link>
        </div>
      </header>
      <section className="py-10 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(listings ?? []).map((l: { id: string; title: string; description: string | null; price_base: number; provider_id: string }) => (
            <Card key={l.id}>
              <CardHeader>
                <CardTitle>{l.title}</CardTitle>
                <CardDescription>From ${"" + l.price_base}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{l.description ?? ""}</p>
                <div className="flex gap-2">
                  <Link href={`/provider/${l.provider_id}`}><Button variant="outline">Provider</Button></Link>
                  <Link href={`/booking/${l.id}`}><Button>Book</Button></Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

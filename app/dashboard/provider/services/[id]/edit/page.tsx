import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/types/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SupabaseClient } from "@supabase/supabase-js"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

async function updateListing(formData: FormData) {
  "use server"

  const supabase = (await createClient()) as SupabaseClient<Database>
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const id = String(formData.get("id"))
  const title = String(formData.get("title") || "").trim()
  const description = String(formData.get("description") || "").trim()
  const category = String(formData.get("category") || "courier") as Database['public']['Tables']['listings']['Row']['category']
  const price_base = Number(formData.get("price_base") || 0)
  const price_per_mile = Number(formData.get("price_per_mile") || 0)
  const price_per_minute = Number(formData.get("price_per_minute") || 0)
  const service_radius_miles = Number(formData.get("service_radius_miles") || 10)
  const active = String(formData.get("active") || "true") === "true"

  const payload: Database['public']['Tables']['listings']['Update'] = {
    title,
    description,
    category,
    price_base,
    price_per_mile,
    price_per_minute,
    service_radius_miles,
    active,
  }

  await supabase.from("listings").update(payload).eq("id", id)

  revalidatePath("/dashboard/provider/services")
  redirect("/dashboard/provider/services")
}

async function disableListing(formData: FormData) {
  "use server"
  const supabase = (await createClient()) as SupabaseClient<Database>
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")
  const id = String(formData.get("id"))
  await supabase.from("listings").update({ active: false }).eq("id", id)
  revalidatePath("/dashboard/provider/services")
  redirect("/dashboard/provider/services")
}

type ListingRow = Database['public']['Tables']['listings']['Row']

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = (await createClient()) as SupabaseClient<Database>
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: listing, error } = await supabase
    .from("listings")
    .select("id, title, description, category, price_base, price_per_mile, price_per_minute, service_radius_miles, active")
    .eq("id", id)
    .single()
  if (error || !listing) redirect("/dashboard/provider/services")

  const l = listing as ListingRow

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="container mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Edit Listing</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updateListing} className="space-y-6">
              <input type="hidden" name="id" value={l.id} />
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" defaultValue={l.title} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" defaultValue={l.description ?? ""} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select name="category" defaultValue={l.category}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food_delivery">Food Delivery</SelectItem>
                      <SelectItem value="courier">Courier</SelectItem>
                      <SelectItem value="aerial_imaging">Aerial Imaging</SelectItem>
                      <SelectItem value="site_mapping">Site Mapping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service_radius_miles">Service radius (miles)</Label>
                  <Input id="service_radius_miles" name="service_radius_miles" type="number" defaultValue={l.service_radius_miles ?? 10} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price_base">Base price ($)</Label>
                  <Input id="price_base" name="price_base" type="number" step="0.01" defaultValue={l.price_base} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price_per_mile">Per mile ($)</Label>
                  <Input id="price_per_mile" name="price_per_mile" type="number" step="0.01" defaultValue={l.price_per_mile ?? 0} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price_per_minute">Per minute ($)</Label>
                  <Input id="price_per_minute" name="price_per_minute" type="number" step="0.01" defaultValue={l.price_per_minute ?? 0} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="active">Status</Label>
                  <Select name="active" defaultValue={l.active ? "true" : "false"}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-3">
                <Button type="submit">Save</Button>
                <Button
                  variant="destructive"
                  formAction={disableListing}
                  name="id"
                  value={l.id}
                >
                  Disable
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



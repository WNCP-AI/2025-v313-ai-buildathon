import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Database } from "@/types/database"

async function createListing(formData: FormData) {
  "use server"

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: provider } = await supabase
    .from("providers")
    .select("id")
    .eq("user_id", user.id)
    .single()

  const title = String(formData.get("title") || "").trim()
  const description = String(formData.get("description") || "").trim()
  type ListingCategory = Database["public"]["Tables"]["listings"]["Row"]["category"]
  const category = String(formData.get("category") || "courier") as ListingCategory
  const price_base = Number(formData.get("price_base") || 0)
  const price_per_mile = Number(formData.get("price_per_mile") || 0)
  const price_per_minute = Number(formData.get("price_per_minute") || 0)
  const service_radius_miles = Number(formData.get("service_radius_miles") || 10)

  await (supabase
    .from("listings")
    .insert({
      provider_id: provider!.id,
      title,
      description,
      category,
      price_base,
      price_per_mile,
      price_per_minute,
      service_radius_miles,
      active: true,
    } as Database["public"]["Tables"]["listings"]["Insert"]))

  revalidatePath("/dashboard/provider/services")
  redirect("/dashboard/provider/services")
}

export default async function NewListingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="container mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>New Listing</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createListing} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select name="category" defaultValue="courier">
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
                  <Input id="service_radius_miles" name="service_radius_miles" type="number" defaultValue={10} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price_base">Base price ($)</Label>
                  <Input id="price_base" name="price_base" type="number" step="0.01" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price_per_mile">Per mile ($)</Label>
                  <Input id="price_per_mile" name="price_per_mile" type="number" step="0.01" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price_per_minute">Per minute ($)</Label>
                  <Input id="price_per_minute" name="price_per_minute" type="number" step="0.01" />
                </div>
              </div>
              <Button type="submit">Create</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



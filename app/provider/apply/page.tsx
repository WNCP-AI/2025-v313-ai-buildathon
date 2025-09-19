import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Database } from "@/types/database"

async function createProvider(formData: FormData) {
  "use server"

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const type = String(formData.get("type") || "courier") as "courier" | "drone"
  const certificationsRaw = String(formData.get("certifications") || "").trim()
  const serviceAreasRaw = String(formData.get("service_areas") || "").trim()

  const certifications = certificationsRaw ? certificationsRaw.split(",").map((s) => s.trim()) : []
  const service_areas = serviceAreasRaw ? serviceAreasRaw.split(",").map((s) => s.trim()) : []

  type ProvidersInsert = Database["public"]["Tables"]["providers"]["Insert"]

  await (supabase
    .from("providers")
    .insert({ user_id: user.id, type, certifications, service_areas } as ProvidersInsert)
    .select("id")
    .single())

  await (supabase
    .from("profiles")
    .update({ role: "provider" } as Database["public"]["Tables"]["profiles"]["Update"]) 
    .eq("id", user.id))

  revalidatePath("/dashboard/provider")
  redirect("/dashboard/provider")
}

export default async function ProviderApplyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: provider } = await supabase
    .from("providers")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle()

  if (provider) redirect("/dashboard/provider")

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="container mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Provider Application</CardTitle>
            <CardDescription>Tell us about your services</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createProvider} className="space-y-6">
              <div className="space-y-2">
                <Label>Provider Type</Label>
                <Select name="type" defaultValue="courier">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="courier">Courier</SelectItem>
                    <SelectItem value="drone">Drone Operator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="certifications">Certifications (comma-separated)</Label>
                <Input id="certifications" name="certifications" placeholder="Part 107, Insurance" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="service_areas">Service Areas (comma-separated)</Label>
                <Input id="service_areas" name="service_areas" placeholder="Downtown Detroit, Midtown" />
              </div>

              <div className="pt-2">
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



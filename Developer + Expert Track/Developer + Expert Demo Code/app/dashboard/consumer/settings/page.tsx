import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Database } from "@/types/database"

async function updateProfile(formData: FormData) {
  "use server"

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const full_name = String(formData.get("full_name") || "").trim()
  const phone = String(formData.get("phone") || "").trim()
  const address = String(formData.get("address") || "").trim()

  await (supabase
    .from("profiles")
    .update({ full_name, phone, address } as Database["public"]["Tables"]["profiles"]["Update"]) 
    .eq("id", user.id))

  revalidatePath("/dashboard/consumer/settings")
}

export default async function ConsumerSettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, full_name, phone, address")
    .eq("id", user.id)
    .single() as unknown as { data: { email: string; full_name: string | null; phone: string | null; address: string | null } | null }

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="container mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your profile information</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue={profile?.email ?? ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full name</Label>
                  <Input id="full_name" name="full_name" defaultValue={profile?.full_name ?? ""} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" defaultValue={profile?.phone ?? ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" name="address" defaultValue={profile?.address ?? ""} />
                </div>
              </div>
              <div className="pt-2">
                <Button type="submit">Save changes</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



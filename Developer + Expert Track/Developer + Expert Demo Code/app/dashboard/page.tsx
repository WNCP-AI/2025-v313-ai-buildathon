import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardRedirectPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single() as unknown as { data: { role: "consumer" | "provider" | "admin" | null } | null }

  if (profile?.role === "provider") {
    redirect("/dashboard/provider")
  }

  // default to consumer if missing/unknown
  redirect("/dashboard/consumer")
}



import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { ViewSwitcher } from "@/components/layout/ViewSwitcher"

export default async function SiteHeader() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let role: "consumer" | "provider" | "admin" | null = null
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()
    role = (profile as { role: typeof role } | null)?.role ?? null
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">🚁 SkyMarket</Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/browse" className="hover:underline">Browse Services</Link>
          <Link href="/how-it-works" className="hover:underline">How It Works</Link>
          <Link href="/provider/apply" className="hover:underline">Become a Provider</Link>
        </nav>
        <div className="flex items-center gap-3">
          {!user && (
            <>
              <Link href="/auth/login"><Button variant="outline">Sign In</Button></Link>
              <Link href="/auth/signup"><Button>Get Started</Button></Link>
            </>
          )}
          {user && (
            <>
              <Link href="/dashboard"><Button variant="outline">Dashboard</Button></Link>
              <ViewSwitcher role={role} />
              <form action="/auth/logout" method="post">
                <Button variant="ghost" type="submit">Sign Out</Button>
              </form>
            </>
          )}
        </div>
      </div>
    </header>
  )
}



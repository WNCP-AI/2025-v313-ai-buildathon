"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isPending, startTransition] = useTransition()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        toast.error(error.message)
        return
      }
      // Gate on email confirmation
      const user = data.user
      const emailConfirmed = !!user?.email_confirmed_at
      if (!emailConfirmed) {
        toast.message("Check your email to confirm your account")
        router.push("/auth/confirm")
        return
      }
      toast.success("Signed in")
      router.push("/dashboard")
      router.refresh()
    })
  }

  return (
    <div className="bg-card shadow-card rounded-lg p-6">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold">Sign in to SkyMarket</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <Button className="w-full" disabled={isPending}>
          Sign In
        </Button>
      </form>
      <div className="my-6 h-px bg-border" />
      {/* <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" onClick={() => signInWithProvider("google")}>Google</Button>
        <Button variant="outline" onClick={() => signInWithProvider("github")}>GitHub</Button>
      </div> */}
      <p className="text-sm text-muted-foreground mt-4 text-center">
        <Link href="/auth/reset" className="text-primary hover:underline">Forgot your password?</Link>
      </p>
      <p className="text-sm text-muted-foreground mt-6 text-center">
        Don&apos;t have an account? {" "}
        <Link href="/auth/signup" className="text-primary hover:underline">Sign up</Link>
      </p>
    </div>
  )
}



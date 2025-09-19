"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function ResetPasswordConfirmPage() {
  const supabase = createClient()
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    // If user got here via email link, they may already have a session set by Supabase
    // No-op: Supabase SSR middleware will pick up session cookie if present
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      toast.error("Passwords do not match")
      return
    }
    startTransition(async () => {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        toast.error(error.message)
        return
      }
      toast.success("Password updated. Please sign in.")
      router.push("/auth/login")
      router.refresh()
    })
  }

  return (
    <div className="bg-card shadow-card rounded-lg p-6 max-w-md mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold">Set a new password</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Enter your new password below
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>
        <Button className="w-full" disabled={isPending}>
          Update password
        </Button>
      </form>
    </div>
  )
}



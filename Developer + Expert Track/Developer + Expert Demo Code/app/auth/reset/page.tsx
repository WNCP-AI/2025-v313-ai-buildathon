"use client"

import { useState, useTransition } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function ResetPasswordRequestPage() {
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [isPending, startTransition] = useTransition()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset/confirm`,
      })
      if (error) {
        toast.error(error.message)
        return
      }
      toast.success("Check your email for a password reset link")
    })
  }

  return (
    <div className="bg-card shadow-card rounded-lg p-6 max-w-md mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold">Reset your password</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button className="w-full" disabled={isPending}>
          Send reset link
        </Button>
      </form>
    </div>
  )
}



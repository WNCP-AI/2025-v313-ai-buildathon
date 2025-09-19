"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function MessageSubscriber({ userId }: { userId: string }) {
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `recipient_id=eq.${userId}` },
        (payload: { new: { content: string } }) => {
          const content = payload.new.content
          toast.message("New message", { description: content })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  return null
}



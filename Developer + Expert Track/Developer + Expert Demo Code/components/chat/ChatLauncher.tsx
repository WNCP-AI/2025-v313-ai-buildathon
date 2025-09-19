'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { MessageCircle } from 'lucide-react'

const ChatWindow = dynamic(() => import('./ChatWindow').then(m => m.ChatWindow), { ssr: false })

export function ChatLauncher() {
  const [open, setOpen] = useState(false)
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow"
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
      {open && (
        <div className="h-[480px] w-[360px] overflow-hidden rounded-xl border bg-white shadow lg:h-[560px] lg:w-[400px]">
          <ChatWindow onClose={() => setOpen(false)} />
        </div>
      )}
    </div>
  )
}

export default ChatLauncher



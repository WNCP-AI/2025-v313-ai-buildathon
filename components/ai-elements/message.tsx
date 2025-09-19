import * as React from 'react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Bot, User2 } from 'lucide-react'

export function Message({
  children,
  from,
}: {
  children: React.ReactNode
  from: 'user' | 'assistant' | 'system'
}) {
  const isUser = from === 'user'
  return (
    <div className={cn('mb-2 flex items-end gap-2 px-2', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <Avatar className="h-6 w-6 border">
          <AvatarFallback className="bg-white text-gray-900">
            <Bot className="h-3 w-3" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'inline-block max-w-[70%] break-words rounded-2xl px-3 py-2 text-sm leading-relaxed',
          isUser
            ? 'bg-black text-white'
            : 'bg-gray-50 text-gray-900 border border-gray-200'
        )}
      >
        {children}
      </div>
      {isUser && (
        <Avatar className="h-6 w-6 border">
          <AvatarFallback className="bg-white text-gray-900">
            <User2 className="h-3 w-3" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}

export function MessageContent({ children }: { children: React.ReactNode }) {
  return <div className="whitespace-pre-wrap">{children}</div>
}



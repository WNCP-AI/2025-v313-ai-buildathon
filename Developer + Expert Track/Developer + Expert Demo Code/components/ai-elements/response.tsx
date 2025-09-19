import * as React from 'react'
import { cn } from '@/lib/utils'

export function Response({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  // Minimal wrapper: no background/border so it blends with the parent bubble.
  return <div className={cn('text-sm break-words whitespace-pre-wrap', className)}>{children}</div>
}



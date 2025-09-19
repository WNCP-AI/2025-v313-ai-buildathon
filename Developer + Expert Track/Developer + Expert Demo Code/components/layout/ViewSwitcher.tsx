'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Check } from 'lucide-react'

type Role = 'consumer' | 'provider' | 'admin' | null

export function ViewSwitcher({ role }: { role: Role }) {
  const pathname = usePathname() || ''
  const isProviderView = pathname.startsWith('/dashboard/provider') || pathname.startsWith('/provider')
  const activeView: 'consumer' | 'provider' = isProviderView ? 'provider' : 'consumer'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">{activeView.charAt(0).toUpperCase() + activeView.slice(1)}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Dashboard View</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/consumer" className="flex w-full items-center justify-between">
            <span>Consumer</span>
            {activeView === 'consumer' && <Check className="h-4 w-4" />}
          </Link>
        </DropdownMenuItem>
        {role === 'provider' && (
          <DropdownMenuItem asChild>
            <Link href="/dashboard/provider" className="flex w-full items-center justify-between">
              <span>Provider</span>
              {activeView === 'provider' && <Check className="h-4 w-4" />}
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}



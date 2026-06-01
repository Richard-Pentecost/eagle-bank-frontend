import { useState } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { MobileNav } from './mobile-nav'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useNavigate } from 'react-router'

export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-brand-border bg-white px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-md p-2 text-brand-muted hover:bg-gray-100 md:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-brand-primary md:hidden">Eagle Bank</h1>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-sm font-medium text-white">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
              <span className="hidden md:inline">{user?.name}</span>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[180px] rounded-md border border-brand-border bg-white p-1 shadow-lg"
              sideOffset={5}
              align="end"
            >
              <DropdownMenu.Item
                className="cursor-pointer rounded px-3 py-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100"
                onSelect={() => navigate('/profile')}
              >
                Profile
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 h-px bg-brand-border" />
              <DropdownMenu.Item
                className="cursor-pointer rounded px-3 py-2 text-sm text-brand-danger outline-none hover:bg-red-50 focus:bg-red-50"
                onSelect={handleLogout}
              >
                Sign out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  )
}

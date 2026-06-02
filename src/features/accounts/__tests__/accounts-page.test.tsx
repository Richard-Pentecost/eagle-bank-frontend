import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({
    user: { id: '1', name: 'James Wilson', email: 'demo@eaglebank.com' },
    isAuthenticated: true,
    isLoading: false,
  }),
}))

import { Component as AccountsPage } from '../accounts-page'

function renderAccounts() {
  localStorage.setItem('eagle-bank-token', 'test-token-user-1')
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AccountsPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('AccountsPage', () => {
  it('renders the page heading', () => {
    renderAccounts()
    expect(screen.getByRole('heading', { name: /accounts/i })).toBeInTheDocument()
  })

  it('displays accounts after loading', async () => {
    renderAccounts()

    await waitFor(
      () => {
        expect(screen.getAllByText('Current Account').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Savings Account').length).toBeGreaterThan(0)
      },
      { timeout: 3000 },
    )
  })

  it('shows account count', async () => {
    renderAccounts()

    await waitFor(
      () => {
        expect(screen.getByText(/4 accounts/)).toBeInTheDocument()
      },
      { timeout: 3000 },
    )
  })

  it('displays status badges', async () => {
    renderAccounts()

    await waitFor(
      () => {
        const activeBadges = screen.getAllByText('active')
        expect(activeBadges.length).toBeGreaterThan(0)
      },
      { timeout: 3000 },
    )
  })

  it('displays account numbers', async () => {
    renderAccounts()

    await waitFor(
      () => {
        expect(screen.getAllByText(/\d{8}/).length).toBeGreaterThan(0)
      },
      { timeout: 3000 },
    )
  })
})

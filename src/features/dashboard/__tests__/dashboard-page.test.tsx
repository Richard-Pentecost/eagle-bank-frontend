import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock useAuth to avoid AuthProvider complexity in unit tests
vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({
    user: { id: '1', name: 'James Wilson', email: 'demo@eaglebank.com' },
    isAuthenticated: true,
    isLoading: false,
  }),
}))

import { Component as DashboardPage } from '../dashboard-page'

function renderDashboard() {
  localStorage.setItem('eagle-bank-token', 'test-token-user-1')
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('DashboardPage', () => {
  it('renders the greeting with user name', async () => {
    renderDashboard()
    await waitFor(() => {
      expect(screen.getByText(/james/i)).toBeInTheDocument()
    })
  })

  it('displays summary card titles', async () => {
    renderDashboard()

    await waitFor(
      () => {
        expect(screen.getByText('Total Balance')).toBeInTheDocument()
        expect(screen.getByText('Monthly Deposits')).toBeInTheDocument()
        expect(screen.getByText('Monthly Withdrawals')).toBeInTheDocument()
      },
      { timeout: 3000 },
    )
  })

  it('shows recent transactions section', async () => {
    renderDashboard()

    await waitFor(
      () => {
        expect(screen.getByText('Recent Transactions')).toBeInTheDocument()
      },
      { timeout: 3000 },
    )
  })

  it('shows quick actions section', async () => {
    renderDashboard()

    await waitFor(
      () => {
        expect(screen.getByText('Quick Actions')).toBeInTheDocument()
      },
      { timeout: 3000 },
    )
  })
})

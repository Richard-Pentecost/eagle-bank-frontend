import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({
    user: { id: '1', name: 'James Wilson', email: 'demo@eaglebank.com' },
    isAuthenticated: true,
    isLoading: false,
  }),
}))

import { Component as TransactionsPage } from '../transactions-page'

function renderTransactions() {
  localStorage.setItem('eagle-bank-token', 'test-token-user-1')
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <TransactionsPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('TransactionsPage', () => {
  it('renders the page heading', () => {
    renderTransactions()
    expect(screen.getByRole('heading', { name: /transactions/i })).toBeInTheDocument()
  })

  it('displays transactions after loading', async () => {
    renderTransactions()

    await waitFor(
      () => {
        const buttons = screen.getAllByRole('button')
        // Filter buttons should exist plus transaction row buttons
        expect(buttons.length).toBeGreaterThan(3)
      },
      { timeout: 3000 },
    )
  })

  it('shows filter controls', () => {
    renderTransactions()

    expect(screen.getByLabelText(/account/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/from/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/to$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/sort by/i)).toBeInTheDocument()
  })

  it('has a clear filters button', () => {
    renderTransactions()
    expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument()
  })

  it('shows pagination when there are multiple pages', async () => {
    renderTransactions()

    await waitFor(
      () => {
        expect(screen.getByText(/page 1 of/i)).toBeInTheDocument()
      },
      { timeout: 3000 },
    )
  })

  it('opens transaction detail dialog when a transaction is clicked', async () => {
    renderTransactions()

    await waitFor(
      () => {
        const transactionButtons = screen.getAllByRole('button').filter(
          (btn) => btn.closest('li') !== null,
        )
        expect(transactionButtons.length).toBeGreaterThan(0)
      },
      { timeout: 3000 },
    )

    const transactionButtons = screen.getAllByRole('button').filter(
      (btn) => btn.closest('li') !== null,
    )
    await userEvent.click(transactionButtons[0])

    await waitFor(() => {
      expect(screen.getByText('Transaction Details')).toBeInTheDocument()
    })
  })
})

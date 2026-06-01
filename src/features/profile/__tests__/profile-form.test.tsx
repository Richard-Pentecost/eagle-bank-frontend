import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock useAuth to avoid AuthProvider auth flow in tests
vi.mock('@/providers/auth-provider', () => ({
  useAuth: () => ({
    user: { id: '1', name: 'James Wilson', email: 'demo@eaglebank.com' },
    isAuthenticated: true,
    isLoading: false,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

import { Component as ProfilePage } from '../profile-page'

function renderProfile() {
  localStorage.setItem('eagle-bank-token', 'test-token-user-1')
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('ProfilePage', () => {
  it('loads and displays profile information', async () => {
    renderProfile()

    await waitFor(
      () => {
        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
      },
      { timeout: 3000 },
    )
  })

  it('disables save button when form is not dirty', async () => {
    renderProfile()

    await waitFor(
      () => {
        expect(screen.getByRole('button', { name: /save changes/i })).toBeDisabled()
      },
      { timeout: 3000 },
    )
  })

  it('enables save button when form is modified', async () => {
    renderProfile()

    await waitFor(
      () => {
        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
      },
      { timeout: 3000 },
    )

    const nameInput = screen.getByLabelText(/full name/i)
    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'New Name')

    expect(screen.getByRole('button', { name: /save changes/i })).toBeEnabled()
  })

  it('shows email field as disabled', async () => {
    renderProfile()

    await waitFor(
      () => {
        expect(screen.getByLabelText(/^email$/i)).toBeDisabled()
      },
      { timeout: 3000 },
    )
  })

  it('shows validation error when name is cleared', async () => {
    renderProfile()

    await waitFor(
      () => {
        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
      },
      { timeout: 3000 },
    )

    const nameInput = screen.getByLabelText(/full name/i)
    await userEvent.clear(nameInput)
    await userEvent.click(screen.getByRole('button', { name: /save changes/i }))

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    })
  })
})

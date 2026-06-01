import { describe, it, expect } from 'vitest'
import { renderWithProviders, screen, userEvent, waitFor } from '@/test/test-utils'
import { RegisterPage } from '../register-page'

describe('RegisterPage', () => {
  it('renders registration form with all fields', () => {
    renderWithProviders(<RegisterPage />, { initialEntries: ['/register'] })

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    renderWithProviders(<RegisterPage />, { initialEntries: ['/register'] })

    await userEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    })
  })

  it('shows error when passwords do not match', async () => {
    renderWithProviders(<RegisterPage />, { initialEntries: ['/register'] })

    await userEvent.type(screen.getByLabelText(/full name/i), 'Test User')
    await userEvent.type(screen.getByLabelText(/^email$/i), 'test@example.com')
    await userEvent.type(screen.getByLabelText(/^password$/i), 'password123')
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'different123')
    await userEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    })
  })

  it('shows error for short password', async () => {
    renderWithProviders(<RegisterPage />, { initialEntries: ['/register'] })

    await userEvent.type(screen.getByLabelText(/full name/i), 'Test User')
    await userEvent.type(screen.getByLabelText(/^email$/i), 'test@example.com')
    await userEvent.type(screen.getByLabelText(/^password$/i), 'short')
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'short')
    await userEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument()
    })
  })

  it('has a link to the login page', () => {
    renderWithProviders(<RegisterPage />, { initialEntries: ['/register'] })
    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/login')
  })
})

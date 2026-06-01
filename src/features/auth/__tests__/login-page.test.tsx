import { describe, it, expect } from 'vitest'
import { renderWithProviders, screen, userEvent, waitFor } from '@/test/test-utils'
import { LoginPage } from '../login-page'

describe('LoginPage', () => {
  it('renders login form with all fields', () => {
    renderWithProviders(<LoginPage />, { initialEntries: ['/login'] })

    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    renderWithProviders(<LoginPage />, { initialEntries: ['/login'] })

    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })

  it('shows validation error for invalid email', async () => {
    renderWithProviders(<LoginPage />, { initialEntries: ['/login'] })

    await userEvent.type(screen.getByLabelText(/email/i), 'notanemail')
    await userEvent.type(screen.getByLabelText(/password/i), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument()
    })
  })

  it('shows error message for invalid credentials', async () => {
    renderWithProviders(<LoginPage />, { initialEntries: ['/login'] })

    await userEvent.type(screen.getByLabelText(/email/i), 'wrong@email.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'wrongpassword')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument()
    })
  })

  it('shows demo credentials hint', () => {
    renderWithProviders(<LoginPage />, { initialEntries: ['/login'] })
    expect(screen.getByText(/demo@eaglebank.com/)).toBeInTheDocument()
  })

  it('has a link to the register page', () => {
    renderWithProviders(<LoginPage />, { initialEntries: ['/login'] })
    expect(screen.getByRole('link', { name: /create one/i })).toHaveAttribute('href', '/register')
  })

  it('marks email field as invalid when validation fails', async () => {
    renderWithProviders(<LoginPage />, { initialEntries: ['/login'] })

    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toHaveAttribute('aria-invalid', 'true')
    })
  })
})

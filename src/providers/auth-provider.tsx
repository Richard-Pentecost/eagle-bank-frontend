import { useState, useEffect, useCallback, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { authResponseSchema, userSchema } from '@/types'
import type { User } from '@/types'
import { AuthContext } from '@/providers/auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [user, setUser] = useState<User | null>(null)
  const token = localStorage.getItem('eagle-bank-token')
  const [isLoading, setIsLoading] = useState(!!token)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return

    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Session expired')
        return res.json()
      })
      .then((data) => {
        const parsed = userSchema.parse(data.user)
        setUser(parsed)
      })
      .catch(() => {
        localStorage.removeItem('eagle-bank-token')
      })
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const raw = await res.json()
      if (!res.ok) throw new Error(raw.message || 'Login failed')
      const data = authResponseSchema.parse(raw)
      queryClient.clear()
      localStorage.setItem('eagle-bank-token', data.token)
      setUser(data.user)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [queryClient])

  const register = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const raw = await res.json()
      if (!res.ok) throw new Error(raw.message || 'Registration failed')
      const data = authResponseSchema.parse(raw)
      queryClient.clear()
      localStorage.setItem('eagle-bank-token', data.token)
      setUser(data.user)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [queryClient])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      localStorage.removeItem('eagle-bank-token')
      queryClient.clear()
      setUser(null)
    }
  }, [queryClient])

  const clearError = useCallback(() => setError(null), [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}


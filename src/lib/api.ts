import type { ZodType } from 'zod'

export class ApiError extends Error {
  status: number
  errors?: Record<string, string[]>

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

interface ApiClientOptions extends RequestInit {
  schema?: ZodType
}

export async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const { schema, ...fetchOptions } = options
  const token = localStorage.getItem('eagle-bank-token')

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  }

  if (token) {
    ;(headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(endpoint, {
    ...fetchOptions,
    headers,
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({ message: 'An error occurred' }))

    if (response.status === 401) {
      localStorage.removeItem('eagle-bank-token')
      window.location.href = '/login'
    }

    throw new ApiError(data.message || 'An error occurred', response.status, data.errors)
  }

  const data = await response.json()

  if (schema) {
    return schema.parse(data) as T
  }

  return data as T
}

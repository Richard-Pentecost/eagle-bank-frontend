import type { User } from '@/types'
import { createDefaultAccounts } from './accounts'
import { createDefaultTransactions } from './transactions'

export const users: (User & { password: string })[] = [
  {
    id: '1',
    name: 'James Wilson',
    email: 'demo@eaglebank.com',
    password: 'password123',
    phone: '07700 900123',
    address: {
      line1: '42 Maple Street',
      line2: 'Flat 3',
      city: 'London',
      postcode: 'EC2A 4NE',
      country: 'United Kingdom',
    },
    avatarUrl: undefined,
    createdAt: '2024-01-15T10:30:00Z',
  },
]

let nextUserId = 2

export function findUserByEmail(email: string) {
  return users.find((u) => u.email === email)
}

export function createUser(name: string, email: string, password: string) {
  const user = {
    id: String(nextUserId++),
    name,
    email,
    password,
    phone: '',
    address: { line1: '', city: '', postcode: '', country: 'United Kingdom' },
    avatarUrl: undefined,
    createdAt: new Date().toISOString(),
  }
  users.push(user)

  const newAccounts = createDefaultAccounts(user.id)
  createDefaultTransactions(newAccounts.map((a) => a.id))

  return user
}

// Simple token store — pre-seed a test token for user "1"
const tokens = new Map<string, string>([['test-token-user-1', '1']])

export function createToken(userId: string): string {
  const token = `eagle-token-${userId}-${Date.now()}`
  tokens.set(token, userId)
  return token
}

export function getUserIdFromToken(token: string): string | undefined {
  return tokens.get(token)
}

export function removeToken(token: string) {
  tokens.delete(token)
}

export function updateUser(userId: string, updates: Partial<User>) {
  const index = users.findIndex((u) => u.id === userId)
  if (index === -1) return null
  users[index] = { ...users[index], ...updates }
  return users[index]
}

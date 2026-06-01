import type { Account } from '@/types'

export const accounts: Account[] = [
  {
    id: 'acc-1',
    userId: '1',
    name: 'Current Account',
    accountNumber: '12345678',
    sortCode: '01-02-03',
    type: 'savings',
    balance: 4250.75,
    currency: 'GBP',
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'acc-2',
    userId: '1',
    name: 'Savings Account',
    accountNumber: '87654321',
    sortCode: '01-02-03',
    type: 'savings',
    balance: 12800.0,
    currency: 'GBP',
    status: 'active',
    createdAt: '2024-02-01T09:00:00Z',
  },
  {
    id: 'acc-3',
    userId: '1',
    name: 'Credit Card',
    accountNumber: '11223344',
    sortCode: '01-02-03',
    type: 'credit',
    balance: -1340.5,
    currency: 'GBP',
    status: 'active',
    createdAt: '2024-03-10T14:00:00Z',
  },
  {
    id: 'acc-4',
    userId: '1',
    name: 'ISA Account',
    accountNumber: '55667788',
    sortCode: '01-02-03',
    type: 'savings',
    balance: 8500.0,
    currency: 'GBP',
    status: 'frozen',
    createdAt: '2024-01-20T11:00:00Z',
  },
]

export function getAccountsByUserId(userId: string) {
  return accounts.filter((a) => a.userId === userId)
}

export function getAccountById(id: string) {
  return accounts.find((a) => a.id === id)
}

import type { Transaction } from '@/types'
import { subDays, format } from 'date-fns'

const categories = [
  'Groceries',
  'Salary',
  'Rent',
  'Entertainment',
  'Transport',
  'Utilities',
  'Dining',
  'Shopping',
  'Healthcare',
  'Transfer',
]

const descriptions: Record<string, string[]> = {
  deposit: ['Monthly Salary', 'Freelance Payment', 'Refund - Amazon', 'Interest Payment', 'Birthday Gift'],
  withdrawal: [
    'Tesco Groceries',
    'Amazon Prime',
    'Netflix Subscription',
    'TFL Oyster',
    'Nando\'s Restaurant',
    'Electricity Bill',
    'Water Bill',
    'Council Tax',
    'Gym Membership',
    'Coffee Shop',
  ],
  transfer: ['Transfer to Savings', 'Transfer to Current', 'Payment to John', 'Rent Payment', 'Shared Bills'],
}

const counterparties: Record<string, string[]> = {
  deposit: ['Acme Corp', 'Client Inc', 'Amazon', 'Eagle Bank', 'Family'],
  withdrawal: ['Tesco', 'Amazon', 'Netflix', 'TFL', 'Nando\'s', 'British Gas', 'Thames Water', 'Council', 'PureGym', 'Costa Coffee'],
  transfer: ['Savings Account', 'Current Account', 'John Smith', 'Landlord', 'Flatmate'],
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateTransactions(): Transaction[] {
  const txns: Transaction[] = []
  const now = new Date()
  const accountIds = ['acc-1', 'acc-2', 'acc-3']
  const types: Transaction['type'][] = ['deposit', 'withdrawal', 'transfer']

  for (let i = 0; i < 50; i++) {
    const type = types[i % 3 === 0 ? 0 : i % 3 === 1 ? 1 : 2]
    // Ensure ~60% of transactions fall within the current month
    const currentDay = now.getDate()
    const daysAgo = i < 30
      ? Math.floor(Math.random() * Math.max(currentDay, 1))
      : Math.floor(Math.random() * 90)
    const date = subDays(now, daysAgo)
    const amount =
      type === 'deposit'
        ? Math.round((Math.random() * 3000 + 100) * 100) / 100
        : Math.round((Math.random() * 500 + 5) * 100) / 100

    txns.push({
      id: `txn-${i + 1}`,
      accountId: randomItem(accountIds),
      type,
      amount,
      currency: 'GBP',
      description: randomItem(descriptions[type]),
      category: randomItem(categories),
      date: format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      status: Math.random() > 0.05 ? 'completed' : Math.random() > 0.5 ? 'pending' : 'failed',
      counterparty: randomItem(counterparties[type]),
    })
  }

  return txns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export const transactions = generateTransactions()

let nextTxnIndex = transactions.length + 1

export function createDefaultTransactions(accountIds: string[]): Transaction[] {
  const now = new Date()
  const types: Transaction['type'][] = ['deposit', 'withdrawal', 'transfer']
  const newTxns: Transaction[] = []

  for (let i = 0; i < 15; i++) {
    const type = types[i % 3]
    const currentDay = now.getDate()
    const daysAgo = i < 10
      ? Math.floor(Math.random() * Math.max(currentDay, 1))
      : Math.floor(Math.random() * 30)
    const date = subDays(now, daysAgo)
    const amount =
      type === 'deposit'
        ? Math.round((Math.random() * 2000 + 200) * 100) / 100
        : Math.round((Math.random() * 300 + 10) * 100) / 100

    newTxns.push({
      id: `txn-${nextTxnIndex++}`,
      accountId: randomItem(accountIds),
      type,
      amount,
      currency: 'GBP',
      description: randomItem(descriptions[type]),
      category: randomItem(categories),
      date: format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      status: Math.random() > 0.05 ? 'completed' : 'pending',
      counterparty: randomItem(counterparties[type]),
    })
  }

  newTxns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  transactions.push(...newTxns)
  return newTxns
}

export function getTransactionById(id: string) {
  return transactions.find((t) => t.id === id)
}

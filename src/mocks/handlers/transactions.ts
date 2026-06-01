import { http, HttpResponse, delay } from 'msw'
import { transactions, getTransactionById } from '../data/transactions'
import { getAccountsByUserId } from '../data/accounts'
import { getUserIdFromToken } from '../data/users'

export const transactionsHandlers = [
  http.get('/api/transactions', async ({ request }) => {
    await delay(300)
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const userId = getUserIdFromToken(token)
    if (!userId) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const userAccounts = getAccountsByUserId(userId)
    const userAccountIds = new Set(userAccounts.map((a) => a.id))

    const url = new URL(request.url)
    const accountId = url.searchParams.get('accountId')
    const type = url.searchParams.get('type')
    const dateFrom = url.searchParams.get('dateFrom')
    const dateTo = url.searchParams.get('dateTo')
    const sortBy = url.searchParams.get('sortBy') || 'date'
    const sortOrder = url.searchParams.get('sortOrder') || 'desc'
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')

    // Only include transactions for accounts owned by this user
    let filtered = transactions.filter((t) => userAccountIds.has(t.accountId))

    if (accountId) {
      filtered = filtered.filter((t) => t.accountId === accountId)
    }
    if (type) {
      filtered = filtered.filter((t) => t.type === type)
    }
    if (dateFrom) {
      filtered = filtered.filter((t) => t.date >= dateFrom)
    }
    if (dateTo) {
      filtered = filtered.filter((t) => t.date <= dateTo + 'T23:59:59Z')
    }

    filtered.sort((a, b) => {
      const aVal = sortBy === 'amount' ? a.amount : new Date(a.date).getTime()
      const bVal = sortBy === 'amount' ? b.amount : new Date(b.date).getTime()
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
    })

    const total = filtered.length
    const totalPages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const data = filtered.slice(start, start + limit)

    return HttpResponse.json({
      data,
      meta: { page, limit, total, totalPages },
    })
  }),

  http.get('/api/transactions/:id', async ({ params, request }) => {
    await delay(200)
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const userId = getUserIdFromToken(token)
    if (!userId) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const transaction = getTransactionById(params.id as string)
    if (!transaction) {
      return HttpResponse.json({ message: 'Transaction not found' }, { status: 404 })
    }

    // Verify the transaction belongs to a user-owned account
    const userAccounts = getAccountsByUserId(userId)
    const userAccountIds = new Set(userAccounts.map((a) => a.id))
    if (!userAccountIds.has(transaction.accountId)) {
      return HttpResponse.json({ message: 'Transaction not found' }, { status: 404 })
    }

    return HttpResponse.json({ data: transaction })
  }),
]

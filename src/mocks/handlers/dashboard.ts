import { http, HttpResponse, delay } from 'msw'
import { getAccountsByUserId } from '../data/accounts'
import { transactions } from '../data/transactions'
import { getUserIdFromToken } from '../data/users'
import { startOfMonth } from 'date-fns'

export const dashboardHandlers = [
  http.get('/api/dashboard', async ({ request }) => {
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

    const accounts = getAccountsByUserId(userId)
    const accountIds = new Set(accounts.map((a) => a.id))
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)

    const userTransactions = transactions.filter((t) => accountIds.has(t.accountId))

    const monthStart = startOfMonth(new Date()).toISOString()
    const monthlyTxns = userTransactions.filter((t) => t.date >= monthStart)

    const monthlyDeposits = monthlyTxns
      .filter((t) => t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0)

    const monthlyWithdrawals = monthlyTxns
      .filter((t) => t.type === 'withdrawal')
      .reduce((sum, t) => sum + t.amount, 0)

    const recentTransactions = userTransactions.slice(0, 5)

    return HttpResponse.json({
      data: {
        totalBalance,
        monthlyDeposits,
        monthlyWithdrawals,
        recentTransactions,
        accounts,
      },
    })
  }),
]

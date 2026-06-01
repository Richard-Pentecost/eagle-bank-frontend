import { http, HttpResponse, delay } from 'msw'
import { getAccountsByUserId, getAccountById } from '../data/accounts'
import { getUserIdFromToken } from '../data/users'

export const accountsHandlers = [
  http.get('/api/accounts', async ({ request }) => {
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
    return HttpResponse.json({ data: accounts })
  }),

  http.get('/api/accounts/:id', async ({ params, request }) => {
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

    const account = getAccountById(params.id as string)
    if (!account || account.userId !== userId) {
      return HttpResponse.json({ message: 'Account not found' }, { status: 404 })
    }

    return HttpResponse.json({ data: account })
  }),
]

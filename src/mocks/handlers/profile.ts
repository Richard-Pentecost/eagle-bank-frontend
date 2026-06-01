import { http, HttpResponse, delay } from 'msw'
import { getUserIdFromToken, users, updateUser } from '../data/users'
import type { User } from '@/types'

export const profileHandlers = [
  http.get('/api/profile', async ({ request }) => {
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

    const user = users.find((u) => u.id === userId)
    if (!user) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const { password: _, ...userWithoutPassword } = user
    return HttpResponse.json({ data: userWithoutPassword })
  }),

  http.put('/api/profile', async ({ request }) => {
    await delay(400)
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const userId = getUserIdFromToken(token)
    if (!userId) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const updates = (await request.json()) as Partial<User>
    const updated = updateUser(userId, updates)
    if (!updated) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const { password: _, ...userWithoutPassword } = updated
    return HttpResponse.json({ data: userWithoutPassword })
  }),

  http.post('/api/profile/avatar', async ({ request }) => {
    await delay(500)
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const userId = getUserIdFromToken(token)
    if (!userId) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Mock avatar URL
    const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${userId}`
    updateUser(userId, { avatarUrl })

    return HttpResponse.json({ data: { avatarUrl } })
  }),
]

import { http, HttpResponse, delay } from 'msw'
import {
  findUserByEmail,
  createUser,
  createToken,
  getUserIdFromToken,
  removeToken,
  users,
} from '../data/users'

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    await delay(400)
    const { email, password } = (await request.json()) as { email: string; password: string }

    const user = findUserByEmail(email)
    if (!user || user.password !== password) {
      return HttpResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 },
      )
    }

    const token = createToken(user.id)
    const { password: _, ...userWithoutPassword } = user
    return HttpResponse.json({ user: userWithoutPassword, token })
  }),

  http.post('/api/auth/register', async ({ request }) => {
    await delay(400)
    const { name, email, password } = (await request.json()) as {
      name: string
      email: string
      password: string
    }

    if (findUserByEmail(email)) {
      return HttpResponse.json(
        { message: 'An account with this email already exists' },
        { status: 409 },
      )
    }

    if (password.length < 8) {
      return HttpResponse.json(
        { message: 'Password must be at least 8 characters' },
        { status: 400 },
      )
    }

    const user = createUser(name, email, password)
    const token = createToken(user.id)
    const { password: _, ...userWithoutPassword } = user
    return HttpResponse.json({ user: userWithoutPassword, token }, { status: 201 })
  }),

  http.post('/api/auth/logout', async ({ request }) => {
    await delay(100)
    const authHeader = request.headers.get('Authorization')
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      removeToken(token)
    }
    return HttpResponse.json({ message: 'Logged out' })
  }),

  http.get('/api/auth/me', async ({ request }) => {
    await delay(200)
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const userId = getUserIdFromToken(token)
    if (!userId) {
      return HttpResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    const user = users.find((u) => u.id === userId)
    if (!user) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const { password: _, ...userWithoutPassword } = user
    return HttpResponse.json({ user: userWithoutPassword })
  }),
]

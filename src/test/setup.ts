import '@testing-library/jest-dom/vitest'
import { server } from '@/mocks/server'
import { beforeAll, afterAll, afterEach } from 'vitest'

// Mock matchMedia for jsdom (used by useReducedMotion)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }))
afterAll(() => server.close())
afterEach(() => {
  server.resetHandlers()
  localStorage.clear()
})

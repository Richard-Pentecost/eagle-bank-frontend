import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { formatCurrency, formatAccountNumber, getGreeting, formatDate } from '../formatters'

describe('formatCurrency', () => {
  it('formats positive amounts in GBP', () => {
    expect(formatCurrency(1234.56)).toBe('£1,234.56')
  })

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('£0.00')
  })

  it('formats negative amounts', () => {
    expect(formatCurrency(-500)).toBe('-£500.00')
  })
})

describe('formatAccountNumber', () => {
  it('masks all but last 4 digits', () => {
    expect(formatAccountNumber('12345678')).toBe('****5678')
  })

  it('handles short numbers', () => {
    expect(formatAccountNumber('1234')).toBe('****1234')
  })
})

describe('getGreeting', () => {
  it('returns Good morning before noon', () => {
    vi.setSystemTime(new Date('2026-01-15T09:00:00'))
    expect(getGreeting()).toBe('Good morning')
  })

  it('returns Good afternoon between noon and 6pm', () => {
    vi.setSystemTime(new Date('2026-01-15T14:00:00'))
    expect(getGreeting()).toBe('Good afternoon')
  })

  it('returns Good evening after 6pm', () => {
    vi.setSystemTime(new Date('2026-01-15T20:00:00'))
    expect(getGreeting()).toBe('Good evening')
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  beforeEach(() => {
    vi.useFakeTimers()
  })
})

describe('formatDate', () => {
  it('formats old dates as dd MMM yyyy', () => {
    expect(formatDate('2024-03-15T10:30:00Z')).toBe('15 Mar 2024')
  })
})

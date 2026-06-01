import { describe, it, expect } from 'vitest'
import { ApiError } from '../api'

describe('ApiError', () => {
  it('creates an error with message and status', () => {
    const error = new ApiError('Not found', 404)
    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(ApiError)
    expect(error.message).toBe('Not found')
    expect(error.status).toBe(404)
    expect(error.name).toBe('ApiError')
  })

  it('includes field-level errors when provided', () => {
    const errors = { email: ['Email is required'] }
    const error = new ApiError('Validation failed', 400, errors)
    expect(error.errors).toEqual(errors)
  })

  it('has no errors by default', () => {
    const error = new ApiError('Server error', 500)
    expect(error.errors).toBeUndefined()
  })
})

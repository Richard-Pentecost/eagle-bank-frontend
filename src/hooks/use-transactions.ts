import { useMemo } from 'react'
import { useApi } from './use-api'
import { transactionsResponseSchema, type Transaction, type PaginatedResponse } from '@/types'

interface TransactionFilters {
  accountId?: string
  type?: string
  dateFrom?: string
  dateTo?: string
  sortBy?: 'date' | 'amount'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export function useTransactions(filters: TransactionFilters = {}) {
  const endpoint = useMemo(() => {
    const params = new URLSearchParams()
    if (filters.accountId) params.set('accountId', filters.accountId)
    if (filters.type) params.set('type', filters.type)
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom)
    if (filters.dateTo) params.set('dateTo', filters.dateTo)
    if (filters.sortBy) params.set('sortBy', filters.sortBy)
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder)
    params.set('page', String(filters.page || 1))
    params.set('limit', String(filters.limit || 10))
    return `/api/transactions?${params.toString()}`
  }, [filters.accountId, filters.type, filters.dateFrom, filters.dateTo, filters.sortBy, filters.sortOrder, filters.page, filters.limit])

  const queryKey = useMemo(
    () => ['transactions', filters],
    [filters],
  )

  const { data, isLoading, error, retry } = useApi<PaginatedResponse<Transaction>>(
    queryKey,
    endpoint,
    { schema: transactionsResponseSchema },
  )

  return {
    transactions: data?.data ?? [],
    meta: data?.meta ?? { page: 1, limit: 10, total: 0, totalPages: 0 },
    isLoading,
    error,
    retry,
  }
}

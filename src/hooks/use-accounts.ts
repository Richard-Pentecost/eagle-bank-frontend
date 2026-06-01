import { useApi } from './use-api'
import { accountsResponseSchema, accountResponseSchema, type Account } from '@/types'

export function useAccounts() {
  const { data, isLoading, error, retry } = useApi<{ data: Account[] }>(
    ['accounts'],
    '/api/accounts',
    { schema: accountsResponseSchema },
  )
  return { accounts: data?.data ?? [], isLoading, error, retry }
}

export function useAccount(id: string) {
  const { data, isLoading, error, retry } = useApi<{ data: Account }>(
    ['accounts', id],
    `/api/accounts/${id}`,
    { schema: accountResponseSchema },
  )
  return { account: data?.data ?? null, isLoading, error, retry }
}

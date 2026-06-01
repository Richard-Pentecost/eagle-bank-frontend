import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import type { ZodType } from 'zod'

interface UseApiOptions {
  schema?: ZodType
}

export function useApi<T>(queryKey: unknown[], endpoint: string | null, options?: UseApiOptions) {
  const { data, isLoading, error, refetch } = useQuery<T>({
    queryKey,
    queryFn: () => apiClient<T>(endpoint!, { schema: options?.schema }),
    enabled: !!endpoint,
  })

  return {
    data: data ?? null,
    isLoading,
    error: error ? (error as Error).message : null,
    retry: refetch,
  }
}

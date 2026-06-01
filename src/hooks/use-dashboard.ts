import { useApi } from './use-api'
import { dashboardResponseSchema, type DashboardData } from '@/types'

export function useDashboard() {
  const { data, isLoading, error, retry } = useApi<{ data: DashboardData }>(
    ['dashboard'],
    '/api/dashboard',
    { schema: dashboardResponseSchema },
  )
  return { dashboard: data?.data ?? null, isLoading, error, retry }
}

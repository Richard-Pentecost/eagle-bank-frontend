import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '@/providers/auth-provider'
import { AppShell } from '@/components/layout/app-shell'
import { Spinner } from '@/components/ui/spinner'

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}

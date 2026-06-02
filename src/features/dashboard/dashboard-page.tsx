import { useMemo, memo } from 'react'
import { usePageTitle } from '@/hooks/use-page-title'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { useAuth } from '@/hooks/use-auth'
import { useDashboard } from '@/hooks/use-dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorMessage } from '@/components/feedback/error-message'
import { EmptyState } from '@/components/feedback/empty-state'
import { Button } from '@/components/ui/button'
import { TransactionRow } from '@/components/ui/transaction-row'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { formatCurrency, getGreeting } from '@/lib/formatters'
import { fadeIn, staggerContainer } from '@/lib/animations'

export function Component() {
  usePageTitle('Dashboard')
  const prefersReducedMotion = useReducedMotion()
  const { user } = useAuth()
  const { dashboard, isLoading, error, retry } = useDashboard()
  const firstName = useMemo(() => user?.name?.split(' ')[0] || 'User', [user?.name])

  if (error) {
    return <ErrorMessage message={error} onRetry={retry} />
  }

  return (
    <motion.div
      className="space-y-6"
      initial={prefersReducedMotion ? false : 'hidden'}
      animate="visible"
      variants={prefersReducedMotion ? undefined : staggerContainer}
    >
      <motion.div variants={prefersReducedMotion ? undefined : fadeIn}>
        <h1 className="text-2xl font-bold text-brand-primary">
          {getGreeting()}, {firstName}
        </h1>
        <p className="text-brand-muted">Here's your financial overview</p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" variants={prefersReducedMotion ? undefined : fadeIn}>
        <SummaryCard
          title="Total Balance"
          value={dashboard ? formatCurrency(dashboard.totalBalance) : undefined}
          isLoading={isLoading}
          icon={
            <svg className="h-5 w-5 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <SummaryCard
          title="Monthly Deposits"
          value={dashboard ? formatCurrency(dashboard.monthlyDeposits) : undefined}
          isLoading={isLoading}
          variant="success"
          icon={
            <svg className="h-5 w-5 text-brand-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          }
        />
        <SummaryCard
          title="Monthly Withdrawals"
          value={dashboard ? formatCurrency(dashboard.monthlyWithdrawals) : undefined}
          isLoading={isLoading}
          variant="danger"
          icon={
            <svg className="h-5 w-5 text-brand-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
          }
        />
      </motion.div>

      <motion.div className="grid gap-6 lg:grid-cols-2" variants={prefersReducedMotion ? undefined : fadeIn}>
        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Link
              to="/transactions"
              className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-brand-primary hover:bg-gray-100"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : dashboard?.recentTransactions.length ? (
              <ul className="space-y-3" role="list">
                {dashboard.recentTransactions.map((txn) => (
                  <li key={txn.id}>
                    <TransactionRow transaction={txn} />
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState title="No transactions yet" description="Your recent transactions will appear here" />
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Link
              to="/accounts"
              className="inline-flex h-11 items-center justify-center rounded-md border border-brand-border bg-white px-4 text-sm font-medium text-brand-primary hover:bg-gray-50"
            >
              View Accounts
            </Link>
            <Link
              to="/transactions"
              className="inline-flex h-11 items-center justify-center rounded-md border border-brand-border bg-white px-4 text-sm font-medium text-brand-primary hover:bg-gray-50"
            >
              Transactions
            </Link>
            <Link
              to="/profile"
              className="inline-flex h-11 items-center justify-center rounded-md border border-brand-border bg-white px-4 text-sm font-medium text-brand-primary hover:bg-gray-50"
            >
              Edit Profile
            </Link>
            <Button variant="outline" disabled>
              New Transfer
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

Component.displayName = 'DashboardPage'

const SummaryCard = memo(function SummaryCard({
  title,
  value,
  isLoading,
  icon,
  variant,
}: {
  title: string
  value?: string
  isLoading: boolean
  icon: React.ReactNode
  variant?: 'success' | 'danger'
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <div className="rounded-full bg-gray-50 p-3">{icon}</div>
        <div>
          <p className="text-sm text-brand-muted">{title}</p>
          {isLoading ? (
            <Skeleton className="mt-1 h-7 w-24" />
          ) : (
            <p
              className={`text-2xl font-bold ${
                variant === 'success'
                  ? 'text-brand-success'
                  : variant === 'danger'
                    ? 'text-brand-danger'
                    : 'text-brand-primary'
              }`}
            >
              {value}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
})

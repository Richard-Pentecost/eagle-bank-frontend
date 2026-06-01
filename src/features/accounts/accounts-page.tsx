import { memo } from 'react'
import { usePageTitle } from '@/hooks/use-page-title'
import { Link } from 'react-router'
import { useAccounts } from '@/hooks/use-accounts'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorMessage } from '@/components/feedback/error-message'
import { EmptyState } from '@/components/feedback/empty-state'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { formatCurrency, formatAccountNumber } from '@/lib/formatters'
import type { Account } from '@/types'

export function Component() {
  usePageTitle('Accounts')
  const { accounts, isLoading, error, retry } = useAccounts()

  if (error) return <ErrorMessage message={error} onRetry={retry} />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-primary">Accounts</h1>
        <p className="text-brand-muted">
          {isLoading ? 'Loading...' : `${accounts.length} account${accounts.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {isLoading ? (
        <AccountsSkeleton />
      ) : accounts.length === 0 ? (
        <EmptyState title="No accounts" description="You don't have any accounts yet." />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead>Number</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>
                        <Link
                          to={`/accounts/${account.id}`}
                          className="font-medium text-brand-primary hover:underline"
                        >
                          {account.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span aria-label={`Account number ${account.accountNumber}`}>
                          {formatAccountNumber(account.accountNumber)}
                        </span>
                      </TableCell>
                      <TableCell className="capitalize">{account.type}</TableCell>
                      <TableCell>
                        <StatusBadge status={account.status} />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(account.balance)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>

          {/* Mobile Cards */}
          <ul className="space-y-3 md:hidden" role="list">
            {accounts.map((account) => (
              <li key={account.id}>
                <AccountCard account={account} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

Component.displayName = 'AccountsPage'

const StatusBadge = memo(function StatusBadge({ status }: { status: Account['status'] }) {
  const variant = status === 'active' ? 'success' : status === 'frozen' ? 'warning' : 'danger'
  return (
    <Badge variant={variant} className="capitalize">
      {status}
    </Badge>
  )
})

const AccountCard = memo(function AccountCard({ account }: { account: Account }) {
  return (
    <Link to={`/accounts/${account.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-brand-primary">{account.name}</h3>
              <p className="text-sm text-brand-muted" aria-label={`Account number ${account.accountNumber}`}>
                {formatAccountNumber(account.accountNumber)} &middot; <span className="capitalize">{account.type}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-brand-primary">{formatCurrency(account.balance)}</p>
              <StatusBadge status={account.status} />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
})

function AccountsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

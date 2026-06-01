import { useParams, Link } from 'react-router'
import { usePageTitle } from '@/hooks/use-page-title'
import { useAccount } from '@/hooks/use-accounts'
import { useTransactions } from '@/hooks/use-transactions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { ErrorMessage } from '@/components/feedback/error-message'
import { EmptyState } from '@/components/feedback/empty-state'
import { TransactionRow } from '@/components/ui/transaction-row'
import { formatCurrency } from '@/lib/formatters'

export function Component() {
  const { id } = useParams<{ id: string }>()
  const { account, isLoading, error, retry } = useAccount(id!)
  usePageTitle(account?.name ?? 'Account')
  const { transactions, isLoading: txnLoading } = useTransactions({
    accountId: id,
    limit: 10,
  })

  if (error) return <ErrorMessage message={error} onRetry={retry} />

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!account) return <ErrorMessage message="Account not found" />

  const statusVariant =
    account.status === 'active' ? 'success' : account.status === 'frozen' ? 'warning' : 'danger'

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-brand-muted">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link to="/dashboard" className="hover:text-brand-primary">
              Dashboard
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to="/accounts" className="hover:text-brand-primary">
              Accounts
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-brand-primary font-medium" aria-current="page">
            {account.name}
          </li>
        </ol>
      </nav>

      {/* Account Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-brand-primary">{account.name}</h1>
                <Badge variant={statusVariant} className="capitalize">
                  {account.status}
                </Badge>
              </div>
              <div className="mt-2 space-y-1 text-sm text-brand-muted">
                <p>Account: {account.accountNumber}</p>
                <p>Sort Code: {account.sortCode}</p>
                <p className="capitalize">Type: {account.type}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-brand-muted">Available Balance</p>
              <p className="text-3xl font-bold text-brand-primary">
                {formatCurrency(account.balance)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {txnLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <EmptyState title="No transactions" description="No transactions found for this account" />
          ) : (
            <ul className="space-y-3" role="list">
              {transactions.map((txn) => (
                <li key={txn.id} className="border-b border-brand-border pb-3 last:border-0 last:pb-0">
                  <TransactionRow transaction={txn} showCounterparty />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

Component.displayName = 'AccountDetailPage'

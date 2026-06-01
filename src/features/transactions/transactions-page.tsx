import { useState, useCallback, memo } from 'react'
import { usePageTitle } from '@/hooks/use-page-title'
import { useSearchParams } from 'react-router'
import { useTransactions } from '@/hooks/use-transactions'
import { useAccounts } from '@/hooks/use-accounts'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorMessage } from '@/components/feedback/error-message'
import { EmptyState } from '@/components/feedback/empty-state'
import { PageHeader } from '@/components/ui/page-header'
import { formatCurrency, formatDate } from '@/lib/formatters'
import * as Dialog from '@radix-ui/react-dialog'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import type { Transaction } from '@/types'

export function Component() {
  usePageTitle('Transactions')
  const [searchParams, setSearchParams] = useSearchParams()
  const { accounts } = useAccounts()

  const accountId = searchParams.get('accountId') || undefined
  const type = searchParams.get('type') || undefined
  const dateFrom = searchParams.get('dateFrom') || undefined
  const dateTo = searchParams.get('dateTo') || undefined
  const sortBy = (searchParams.get('sortBy') as 'date' | 'amount') || 'date'
  const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'
  const page = parseInt(searchParams.get('page') || '1')

  const { transactions, meta, isLoading, error, retry } = useTransactions({
    accountId,
    type,
    dateFrom,
    dateTo,
    sortBy,
    sortOrder,
    page,
    limit: 10,
  })

  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null)

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        if (value) {
          next.set(key, value)
        } else {
          next.delete(key)
        }
        if (key !== 'page') next.set('page', '1')
        return next
      })
    },
    [setSearchParams],
  )

  const clearFilters = () => {
    setSearchParams(new URLSearchParams())
  }

  if (error) return <ErrorMessage message={error} onRetry={retry} />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description={isLoading ? 'Loading...' : `${meta.total} transaction${meta.total !== 1 ? 's' : ''}`}
      />

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="min-w-[140px]">
              <Label htmlFor="account-filter">Account</Label>
              <Select
                id="account-filter"
                value={accountId || ''}
                onChange={(e) => updateParam('accountId', e.target.value || null)}
                className="mt-1"
              >
                <option value="">All accounts</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </Select>
            </div>

            <div className="min-w-[130px]">
              <Label htmlFor="type-filter">Type</Label>
              <Select
                id="type-filter"
                value={type || ''}
                onChange={(e) => updateParam('type', e.target.value || null)}
                className="mt-1"
              >
                <option value="">All types</option>
                <option value="deposit">Deposit</option>
                <option value="withdrawal">Withdrawal</option>
                <option value="transfer">Transfer</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="date-from">From</Label>
              <Input
                id="date-from"
                type="date"
                value={dateFrom || ''}
                onChange={(e) => updateParam('dateFrom', e.target.value || null)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="date-to">To</Label>
              <Input
                id="date-to"
                type="date"
                value={dateTo || ''}
                onChange={(e) => updateParam('dateTo', e.target.value || null)}
                className="mt-1"
              />
            </div>

            <div className="min-w-[130px]">
              <Label htmlFor="sort-filter">Sort by</Label>
              <Select
                id="sort-filter"
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [sb, so] = e.target.value.split('-')
                  updateParam('sortBy', sb)
                  updateParam('sortOrder', so)
                }}
                className="mt-1"
              >
                <option value="date-desc">Date (newest)</option>
                <option value="date-asc">Date (oldest)</option>
                <option value="amount-desc">Amount (high)</option>
                <option value="amount-asc">Amount (low)</option>
              </Select>
            </div>

            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-0 divide-y divide-brand-border">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <EmptyState
              title="No transactions found"
              description="Try adjusting your filters."
              action={
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <ul className="divide-y divide-brand-border" role="list">
              {transactions.map((txn) => (
                <li key={txn.id}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-accent"
                    onClick={() => setSelectedTxn(txn)}
                  >
                    <div className="flex items-center gap-3">
                      <TransactionIcon type={txn.type} />
                      <div>
                        <p className="text-sm font-medium text-brand-primary">{txn.description}</p>
                        <p className="text-xs text-brand-muted">
                          {formatDate(txn.date)} &middot; {txn.counterparty}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-sm font-semibold ${
                          txn.type === 'deposit' ? 'text-brand-success' : 'text-brand-danger'
                        }`}
                      >
                        {txn.type === 'deposit' ? '+' : '-'}{formatCurrency(txn.amount)}
                      </span>
                      <div className="mt-0.5">
                        <Badge
                          variant={
                            txn.status === 'completed'
                              ? 'success'
                              : txn.status === 'pending'
                                ? 'warning'
                                : 'danger'
                          }
                          className="capitalize"
                        >
                          {txn.status}
                        </Badge>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <nav aria-label="Pagination" className="flex items-center justify-between">
          <p className="text-sm text-brand-muted">
            Page {meta.page} of {meta.totalPages} ({meta.total} results)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => updateParam('page', String(page - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= meta.totalPages}
              onClick={() => updateParam('page', String(page + 1))}
            >
              Next
            </Button>
          </div>
        </nav>
      )}

      {/* Transaction Detail Dialog */}
      <TransactionDetailDialog
        transaction={selectedTxn}
        onClose={() => setSelectedTxn(null)}
      />
    </div>
  )
}

Component.displayName = 'TransactionsPage'

const TransactionIcon = memo(function TransactionIcon({ type }: { type: Transaction['type'] }) {
  const color =
    type === 'deposit' ? 'text-brand-success bg-green-50' : type === 'transfer' ? 'text-blue-600 bg-blue-50' : 'text-brand-danger bg-red-50'

  return (
    <div className={`rounded-full p-2 ${color}`} aria-hidden="true">
      {type === 'deposit' ? (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
        </svg>
      ) : type === 'withdrawal' ? (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
        </svg>
      ) : (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      )}
    </div>
  )
})

function TransactionDetailDialog({
  transaction,
  onClose,
}: {
  transaction: Transaction | null
  onClose: () => void
}) {
  return (
    <Dialog.Root open={!!transaction} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl focus:outline-none">
          <Dialog.Title className="text-lg font-semibold text-brand-primary">
            Transaction Details
          </Dialog.Title>
          <VisuallyHidden.Root>
            <Dialog.Description>Details for this transaction</Dialog.Description>
          </VisuallyHidden.Root>

          {transaction && (
            <dl className="mt-4 space-y-3 text-sm">
              <DetailRow label="Description" value={transaction.description} />
              <DetailRow label="Type" value={transaction.type} className="capitalize" />
              <DetailRow
                label="Amount"
                value={`${transaction.type === 'deposit' ? '+' : '-'}${formatCurrency(transaction.amount)}`}
              />
              <DetailRow label="Date" value={formatDate(transaction.date)} />
              <DetailRow label="Status" value={transaction.status} className="capitalize" />
              <DetailRow label="Category" value={transaction.category} />
              {transaction.counterparty && (
                <DetailRow label="Counterparty" value={transaction.counterparty} />
              )}
              <DetailRow label="Reference" value={transaction.id} />
            </dl>
          )}

          <div className="mt-6 flex justify-end">
            <Dialog.Close asChild>
              <Button variant="outline">Close</Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function DetailRow({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className="flex justify-between border-b border-brand-border pb-2 last:border-0">
      <dt className="text-brand-muted">{label}</dt>
      <dd className={`font-medium text-brand-primary ${className || ''}`}>{value}</dd>
    </div>
  )
}

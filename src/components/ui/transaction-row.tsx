import { memo } from 'react'
import { formatCurrency, formatDate } from '@/lib/formatters'
import type { Transaction } from '@/types'

interface TransactionRowProps {
  transaction: Transaction
  showCounterparty?: boolean
}

export const TransactionRow = memo(function TransactionRow({
  transaction,
  showCounterparty = false,
}: TransactionRowProps) {
  const isPositive = transaction.type === 'deposit'

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-brand-primary">{transaction.description}</p>
        <p className="text-xs text-brand-muted">
          {formatDate(transaction.date)}
          {showCounterparty && transaction.counterparty && <> &middot; {transaction.counterparty}</>}
        </p>
      </div>
      <span
        className={`text-sm font-semibold ${isPositive ? 'text-brand-success' : 'text-brand-danger'}`}
      >
        {isPositive ? '+' : '-'}{formatCurrency(transaction.amount)}
      </span>
    </div>
  )
})

import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns'

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
})

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount)
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  if (isToday(date)) return `Today, ${format(date, 'HH:mm')}`
  if (isYesterday(date)) return `Yesterday, ${format(date, 'HH:mm')}`
  return format(date, 'dd MMM yyyy')
}

export function formatRelativeDate(dateString: string): string {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true })
}


export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

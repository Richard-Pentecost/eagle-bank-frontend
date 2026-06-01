import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

const variants = {
  error: 'bg-red-50 text-brand-danger',
  success: 'bg-green-50 text-brand-success',
  info: 'bg-blue-50 text-blue-700',
}

interface AlertProps {
  variant: keyof typeof variants
  children: ReactNode
  className?: string
}

export function Alert({ variant, children, className }: AlertProps) {
  return (
    <div
      className={cn('rounded-md p-3 text-sm', variants[variant], className)}
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live="polite"
    >
      {children}
    </div>
  )
}

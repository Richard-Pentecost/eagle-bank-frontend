import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const variants = {
  default: 'bg-gray-100 text-brand-primary',
  success: 'bg-green-50 text-brand-success',
  warning: 'bg-amber-50 text-brand-warning',
  danger: 'bg-red-50 text-brand-danger',
  info: 'bg-blue-50 text-blue-700',
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variants
}

export function Badge({ variant = 'default', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}

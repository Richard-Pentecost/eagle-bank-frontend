import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        aria-invalid={error || undefined}
        className={cn(
          'flex h-11 w-full rounded-md border bg-white px-3 py-2 text-sm transition-colors',
          'placeholder:text-brand-muted/60',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-1',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error
            ? 'border-brand-danger focus-visible:ring-brand-danger'
            : 'border-brand-border',
          className,
        )}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

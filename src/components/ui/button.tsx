import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'
import { Spinner } from './spinner'

const variants = {
  default: 'bg-brand-primary text-white hover:bg-brand-primary/90',
  secondary: 'bg-gray-100 text-brand-primary hover:bg-gray-200',
  destructive: 'bg-brand-danger text-white hover:bg-brand-danger/90',
  outline: 'border border-brand-border bg-white text-brand-primary hover:bg-gray-50',
  ghost: 'text-brand-primary hover:bg-gray-100',
  link: 'text-brand-accent underline-offset-4 hover:underline',
}

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
  icon: 'h-10 w-10',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  isLoading?: boolean
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', isLoading, asChild, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(
          'inline-flex cursor-pointer items-center justify-center gap-2 rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className,
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Spinner size="sm" />}
        {children}
      </Comp>
    )
  },
)
Button.displayName = 'Button'

import { forwardRef, type InputHTMLAttributes, useId } from 'react'
import { Input } from './input'
import { Label } from './label'
import { cn } from '@/lib/utils'

export interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, hint, className, id: externalId, ...props }, ref) => {
    const generatedId = useId()
    const id = externalId || generatedId
    const errorId = `${id}-error`
    const hintId = `${id}-hint`

    return (
      <div className={cn('space-y-2', className)}>
        <Label htmlFor={id}>{label}</Label>
        <Input
          ref={ref}
          id={id}
          error={!!error}
          aria-describedby={
            [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined
          }
          {...props}
        />
        {hint && !error && (
          <p id={hintId} className="text-xs text-brand-muted">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} className="text-sm text-brand-danger" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  },
)
FormField.displayName = 'FormField'

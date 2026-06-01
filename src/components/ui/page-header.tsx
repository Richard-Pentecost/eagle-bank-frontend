import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  className?: string
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <div className={cn(className)}>
      <h1 className="text-2xl font-bold text-brand-primary">{title}</h1>
      {description && <p className="text-brand-muted">{description}</p>}
    </div>
  )
}

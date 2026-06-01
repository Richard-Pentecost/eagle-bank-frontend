import { Link } from 'react-router'

export function Component() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-brand-primary">404</h1>
      <h2 className="mt-4 text-xl font-semibold text-brand-primary">Page not found</h2>
      <p className="mt-2 text-brand-muted">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-brand-primary px-4 text-sm font-medium text-white hover:bg-brand-primary/90"
      >
        Go to Dashboard
      </Link>
    </div>
  )
}

Component.displayName = 'NotFoundPage'

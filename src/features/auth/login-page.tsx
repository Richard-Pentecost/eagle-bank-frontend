import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useLocation } from 'react-router'
import { useAuth } from '@/providers/auth-provider'
import { loginSchema, type LoginFormData } from '@/lib/validators'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { usePageTitle } from '@/hooks/use-page-title'

export function LoginPage() {
  usePageTitle('Sign In')
  const { login, isLoading, error, clearError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string })?.from || '/dashboard'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearError()
      await login(data.email, data.password)
      navigate(from, { replace: true })
    } catch {
      // Error is handled by auth context
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-brand-primary">Eagle Bank</h1>
          <p className="mt-2 text-brand-muted">Sign in to your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <CardContent className="space-y-4">
              {error && (
                <div
                  className="rounded-md bg-red-50 p-3 text-sm text-brand-danger"
                  role="alert"
                  aria-live="polite"
                >
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  error={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  {...register('email')}
                />
                {errors.email && (
                  <p id="email-error" className="text-sm text-brand-danger" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  error={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  {...register('password')}
                />
                {errors.password && (
                  <p id="password-error" className="text-sm text-brand-danger" role="alert">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex-col gap-4">
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Sign in
              </Button>
              <p className="text-center text-sm text-brand-muted">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-brand-accent hover:underline">
                  Create one
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-4 rounded-md bg-blue-50 p-3 text-center text-sm text-blue-700">
          Demo: <strong>demo@eaglebank.com</strong> / <strong>password123</strong>
        </div>
      </div>
    </div>
  )
}

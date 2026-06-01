import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useLocation } from 'react-router'
import { useAuth } from '@/providers/auth-provider'
import { loginSchema, type LoginFormData } from '@/lib/validators'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Alert } from '@/components/feedback/alert'
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
              {error && <Alert variant="error">{error}</Alert>}

              <FormField
                label="Email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
              />

              <FormField
                label="Password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                error={errors.password?.message}
                {...register('password')}
              />
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

        <Alert variant="info" className="mt-4 text-center">
          Demo: <strong>demo@eaglebank.com</strong> / <strong>password123</strong>
        </Alert>
      </div>
    </div>
  )
}

import { useEffect, useRef, useState, useMemo } from 'react'
import { usePageTitle } from '@/hooks/use-page-title'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useProfile } from '@/hooks/use-profile'
import { profileSchema, type ProfileFormData } from '@/lib/validators'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { ErrorMessage } from '@/components/feedback/error-message'
import * as Avatar from '@radix-ui/react-avatar'

export function Component() {
  usePageTitle('Profile')
  const {
    profile,
    isLoading,
    error,
    retry,
    updateProfile,
    uploadAvatar,
    saving,
    saveError,
    saveSuccess,
  } = useProfile()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        phone: profile.phone || '',
        address: {
          line1: profile.address?.line1 || '',
          line2: profile.address?.line2 || '',
          city: profile.address?.city || '',
          postcode: profile.address?.postcode || '',
          country: profile.address?.country || 'United Kingdom',
        },
      })
    }
  }, [profile, reset])

  const onSubmit = async (data: ProfileFormData) => {
    await updateProfile(data)
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => setAvatarPreview(reader.result as string)
    reader.readAsDataURL(file)

    await uploadAvatar(file)
  }

  const initials = useMemo(() => {
    if (!profile?.name) return 'U'
    return profile.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }, [profile?.name])

  if (error) return <ErrorMessage message={error} onRetry={retry} />

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-primary">Profile</h1>
        <p className="text-brand-muted">Manage your personal information</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Avatar Section */}
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <Avatar.Root className="relative h-24 w-24 overflow-hidden rounded-full">
              <Avatar.Image
                src={avatarPreview || profile?.avatarUrl}
                alt={profile?.name || 'User avatar'}
                className="h-full w-full object-cover"
              />
              <Avatar.Fallback className="flex h-full w-full items-center justify-center bg-brand-primary text-2xl font-semibold text-white">
                {initials}
              </Avatar.Fallback>
            </Avatar.Root>
            <h2 className="mt-4 text-lg font-semibold">{profile?.name}</h2>
            <p className="text-sm text-brand-muted">{profile?.email}</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
              aria-label="Upload avatar image"
            />
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => fileInputRef.current?.click()}
              disabled={saving}
            >
              Change avatar
            </Button>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              {saveError && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-brand-danger" role="alert">
                  {saveError}
                </div>
              )}
              {saveSuccess && (
                <div
                  className="rounded-md bg-green-50 p-3 text-sm text-brand-success"
                  role="status"
                  aria-live="polite"
                >
                  Profile updated successfully
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    error={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    {...register('name')}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-sm text-brand-danger">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={profile?.email || ''} disabled />
                  <p className="text-xs text-brand-muted">Email cannot be changed</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="07700 900123"
                  error={!!errors.phone}
                  {...register('phone')}
                />
                {errors.phone && (
                  <p className="text-sm text-brand-danger">{errors.phone.message}</p>
                )}
              </div>

              <fieldset>
                <legend className="text-sm font-medium text-brand-primary mb-3">Address</legend>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="line1">Address line 1</Label>
                    <Input
                      id="line1"
                      error={!!errors.address?.line1}
                      aria-describedby={errors.address?.line1 ? 'line1-error' : undefined}
                      {...register('address.line1')}
                    />
                    {errors.address?.line1 && (
                      <p id="line1-error" className="text-sm text-brand-danger">{errors.address.line1.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="line2">Address line 2 (optional)</Label>
                    <Input id="line2" {...register('address.line2')} />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        error={!!errors.address?.city}
                        {...register('address.city')}
                      />
                      {errors.address?.city && (
                        <p className="text-sm text-brand-danger">{errors.address.city.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="postcode">Postcode</Label>
                      <Input
                        id="postcode"
                        error={!!errors.address?.postcode}
                        {...register('address.postcode')}
                      />
                      {errors.address?.postcode && (
                        <p className="text-sm text-brand-danger">{errors.address.postcode.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        error={!!errors.address?.country}
                        {...register('address.country')}
                      />
                      {errors.address?.country && (
                        <p className="text-sm text-brand-danger">{errors.address.country.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </fieldset>

              <div className="flex gap-3 pt-4">
                <Button type="submit" isLoading={saving} disabled={!isDirty}>
                  Save changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => reset()}
                  disabled={!isDirty || saving}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

Component.displayName = 'ProfilePage'

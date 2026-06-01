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
import { FormField } from '@/components/ui/form-field'
import { Spinner } from '@/components/ui/spinner'
import { ErrorMessage } from '@/components/feedback/error-message'
import { Alert } from '@/components/feedback/alert'
import { PageHeader } from '@/components/ui/page-header'
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

  const profileName = profile?.name
  const initials = useMemo(() => {
    if (!profileName) return 'U'
    return profileName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }, [profileName])

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
      <PageHeader title="Profile" description="Manage your personal information" />

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
              {saveError && <Alert variant="error">{saveError}</Alert>}
              {saveSuccess && <Alert variant="success">Profile updated successfully</Alert>}

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="Full name"
                  error={errors.name?.message}
                  {...register('name')}
                />

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={profile?.email || ''} disabled />
                  <p className="text-xs text-brand-muted">Email cannot be changed</p>
                </div>
              </div>

              <FormField
                label="Phone number"
                type="tel"
                placeholder="07700 900123"
                error={errors.phone?.message}
                {...register('phone')}
              />

              <fieldset>
                <legend className="text-sm font-medium text-brand-primary mb-3">Address</legend>
                <div className="space-y-4">
                  <FormField
                    label="Address line 1"
                    error={errors.address?.line1?.message}
                    {...register('address.line1')}
                  />

                  <FormField
                    label="Address line 2 (optional)"
                    {...register('address.line2')}
                  />

                  <div className="grid gap-4 sm:grid-cols-3">
                    <FormField
                      label="City"
                      error={errors.address?.city?.message}
                      {...register('address.city')}
                    />

                    <FormField
                      label="Postcode"
                      error={errors.address?.postcode?.message}
                      {...register('address.postcode')}
                    />

                    <FormField
                      label="Country"
                      error={errors.address?.country?.message}
                      {...register('address.country')}
                    />
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

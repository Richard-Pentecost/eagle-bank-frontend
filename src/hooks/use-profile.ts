import { useApi } from './use-api'
import { apiClient } from '@/lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { userResponseSchema, type User } from '@/types'

export function useProfile() {
  const queryClient = useQueryClient()
  const { data, isLoading, error, retry } = useApi<{ data: User }>(
    ['profile'],
    '/api/profile',
    { schema: userResponseSchema },
  )

  const [saveSuccess, setSaveSuccess] = useState(false)

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<User>) =>
      apiClient('/api/profile', {
        method: 'PUT',
        body: JSON.stringify(updates),
        schema: userResponseSchema,
      }),
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: ['profile'] })
      const previous = queryClient.getQueryData<{ data: User }>(['profile'])
      if (previous) {
        queryClient.setQueryData(['profile'], {
          data: { ...previous.data, ...updates },
        })
      }
      return { previous }
    },
    onError: (_err, _updates, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['profile'], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    },
  })

  const avatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('avatar', file)
      const token = localStorage.getItem('eagle-bank-token')
      await fetch('/api/profile/avatar', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })

  return {
    profile: data?.data ?? null,
    isLoading,
    error,
    retry,
    updateProfile: updateMutation.mutateAsync,
    uploadAvatar: avatarMutation.mutateAsync,
    saving: updateMutation.isPending || avatarMutation.isPending,
    saveError: updateMutation.error?.message || avatarMutation.error?.message || null,
    saveSuccess,
  }
}

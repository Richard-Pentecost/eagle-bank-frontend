import { createBrowserRouter, Navigate } from 'react-router'
import { ProtectedRoute } from './protected-route'

import { LoginPage } from '@/features/auth/login-page'
import { RegisterPage } from '@/features/auth/register-page'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        lazy: () => import('@/features/dashboard/dashboard-page'),
      },
      {
        path: 'accounts',
        lazy: () => import('@/features/accounts/accounts-page'),
      },
      {
        path: 'accounts/:id',
        lazy: () => import('@/features/accounts/account-detail-page'),
      },
      {
        path: 'transactions',
        lazy: () => import('@/features/transactions/transactions-page'),
      },
      {
        path: 'profile',
        lazy: () => import('@/features/profile/profile-page'),
      },
    ],
  },
  {
    path: '*',
    lazy: () => import('@/components/feedback/not-found-page'),
  },
])

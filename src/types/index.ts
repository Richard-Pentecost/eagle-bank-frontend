import { z } from 'zod'

// --- Domain Schemas ---

export const addressSchema = z.object({
  line1: z.string(),
  line2: z.string().optional(),
  city: z.string(),
  postcode: z.string(),
  country: z.string(),
})

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address: addressSchema,
  avatarUrl: z.string().optional(),
  createdAt: z.string(),
})

export const accountSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  accountNumber: z.string(),
  sortCode: z.string(),
  type: z.enum(['savings', 'credit']),
  balance: z.number(),
  currency: z.string(),
  status: z.enum(['active', 'frozen', 'closed']),
  createdAt: z.string(),
})

export const transactionSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  type: z.enum(['deposit', 'withdrawal', 'transfer']),
  amount: z.number(),
  currency: z.string(),
  description: z.string(),
  category: z.string(),
  date: z.string(),
  status: z.enum(['completed', 'pending', 'failed']),
  counterparty: z.string().optional(),
})

export const dashboardDataSchema = z.object({
  totalBalance: z.number(),
  monthlyDeposits: z.number(),
  monthlyWithdrawals: z.number(),
  recentTransactions: z.array(transactionSchema),
  accounts: z.array(accountSchema),
})

export const paginationMetaSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
})

// --- API Response Schemas ---

export const authResponseSchema = z.object({
  user: userSchema,
  token: z.string(),
})

export const userResponseSchema = z.object({
  data: userSchema,
})

export const accountsResponseSchema = z.object({
  data: z.array(accountSchema),
})

export const accountResponseSchema = z.object({
  data: accountSchema,
})

export const dashboardResponseSchema = z.object({
  data: dashboardDataSchema,
})

export const transactionsResponseSchema = z.object({
  data: z.array(transactionSchema),
  meta: paginationMetaSchema,
})

export const transactionResponseSchema = z.object({
  data: transactionSchema,
})

// --- Derived Types ---

export type Address = z.infer<typeof addressSchema>
export type User = z.infer<typeof userSchema>
export type Account = z.infer<typeof accountSchema>
export type Transaction = z.infer<typeof transactionSchema>
export type DashboardData = z.infer<typeof dashboardDataSchema>
export type PaginationMeta = z.infer<typeof paginationMetaSchema>

export type AuthResponse = z.infer<typeof authResponseSchema>
export type PaginatedResponse<T> = { data: T[]; meta: PaginationMeta }

export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
}

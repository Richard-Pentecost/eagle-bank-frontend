import { authHandlers } from './auth'
import { accountsHandlers } from './accounts'
import { transactionsHandlers } from './transactions'
import { dashboardHandlers } from './dashboard'
import { profileHandlers } from './profile'

export const handlers = [
  ...authHandlers,
  ...accountsHandlers,
  ...transactionsHandlers,
  ...dashboardHandlers,
  ...profileHandlers,
]

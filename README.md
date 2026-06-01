# Eagle Bank Frontend

A responsive banking frontend platform built with React and TypeScript. This application integrates with mock APIs (MSW) to provide a modern, accessible, secure, and performant user experience.

## Demo Credentials

- **Email:** `demo@eaglebank.com`
- **Password:** `password123`

You can also register a new account. New users are automatically seeded with a Current Account (£1,500), a Savings Account (£3,200), and 15 sample transactions so the dashboard, accounts, and transactions pages are populated immediately after sign-up.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`. MSW (Mock Service Worker) will automatically intercept API requests in development.

### Build

```bash
npm run build
npm run preview
```

### Testing

```bash
npm run test          # Run tests once
npm run test:watch    # Run tests in watch mode
```

## Tech Stack

| Category | Choice | Rationale |
|----------|--------|-----------|
| Framework | React 19 + TypeScript | Type safety, component model, ecosystem maturity |
| Build Tool | Vite | Fast dev server, optimized builds, native ESM |
| Styling | Tailwind CSS v4 | Utility-first, rapid prototyping, small bundle |
| UI Primitives | Radix UI | Unstyled, accessible components with full ARIA support |
| Routing | React Router v7 | Industry standard, lazy loading, protected routes |
| Forms | react-hook-form + Zod | Performant forms with schema-based validation |
| Mock API | MSW (Mock Service Worker) | Realistic API mocking at the network level |
| Server State | TanStack Query (React Query) | Caching, background refetch, request deduplication, mutations |
| Testing | Vitest + React Testing Library | Fast, Vite-native testing with user-centric assertions |
| Animations | Framer Motion | Declarative animations respecting reduced motion |
| Utilities | date-fns, clsx, tailwind-merge | Lightweight, tree-shakeable utilities |

## Architecture & Folder Structure

```
src/
  components/
    ui/              # Design system primitives (Button, Input, Card, Table, etc.)
    layout/          # App shell components (Header, Sidebar, MobileNav)
    feedback/        # Error boundary, empty states, error messages, 404
  features/
    auth/            # Login & Register pages
    dashboard/       # Dashboard with summary cards, recent transactions
    accounts/        # Account listing (responsive table/card) + detail page
    transactions/    # Filterable, sortable, paginated transaction list
    profile/         # Profile editing with avatar upload
  hooks/             # Shared data-fetching hooks (useApi, useAccounts, etc.)
  lib/               # Utilities: API client, formatters, validators, animations
  mocks/
    data/            # Seed data (users, accounts, transactions)
    handlers/        # MSW request handlers for all endpoints
  providers/         # AuthProvider (React Context)
  routes/            # Route definitions + ProtectedRoute wrapper
  types/             # Shared TypeScript interfaces
```

### Design Decisions

- **Feature-based structure**: Each feature (auth, dashboard, accounts, etc.) is self-contained with its own components, making the codebase scalable and easy to navigate.
- **Custom hooks for data fetching**: Every API call is wrapped in a hook (e.g., `useAccounts`, `useTransactions`) that returns `{ data, isLoading, error, retry }` for consistent loading/error/retry patterns.
- **MSW for mocking**: Mock Service Worker intercepts requests at the network level, making mocks realistic and identical between development and testing.
- **Radix UI + Tailwind**: Radix provides accessible primitives (focus trapping, keyboard navigation, ARIA) while Tailwind handles visual styling. This separation ensures accessibility isn't sacrificed for aesthetics.

## State Management

- **Authentication state**: React Context (`AuthProvider`) stores the current user, loading state, and auth methods. Token persisted in `localStorage` and validated via `GET /api/auth/me` on app load.
- **Server state**: TanStack Query manages all API data with automatic caching (2-minute stale time), background refetching on window focus, request deduplication, and `useMutation` for profile updates with cache invalidation. A thin `useApi` wrapper standardises the return shape across hooks.
- **Form state**: Managed by `react-hook-form` with Zod schema validation. Forms are uncontrolled for performance.
- **URL state**: Transaction filters are synced to URL search params (`useSearchParams`) for bookmarkable/shareable filter states.

## Performance Considerations

- **Route-based code splitting**: All feature pages use React Router's `lazy()` for automatic code splitting. Each page loads as a separate chunk.
- **Optimized rendering**: `React.memo` on list item components (`AccountCard`, `StatusBadge`, `TransactionIcon`, `SummaryCard`, `TransactionItem`), `useMemo` for derived calculations (`firstName`, `initials`, query keys).
- **Skeleton loading**: Layout-matching skeleton placeholders prevent content layout shift.
- **No unnecessary re-renders**: Form state managed by react-hook-form (uncontrolled inputs), auth context memoized with `useCallback`.
- **Small bundle**: Radix UI components are individually importable. Tailwind CSS tree-shakes unused styles.

## Accessibility

- **Semantic HTML**: Proper heading hierarchy, `<nav>`, `<main>`, `<ul>`, `<table>` with `<thead>`/`<th>`, `<fieldset>/<legend>` for form groups.
- **Keyboard navigation**: All interactive elements are focusable and operable via keyboard. Visible focus rings on all interactive elements.
- **ARIA attributes**: `aria-invalid` on form fields with errors, `aria-describedby` linking error messages, `aria-live="polite"` for dynamic content updates, `aria-label` on icon-only buttons and masked account numbers.
- **Screen reader support**: Skip-to-content link, `aria-hidden` on decorative icons, meaningful alt text.
- **Focus management**: Radix Dialog provides automatic focus trapping. Mobile nav uses Radix Dialog for proper focus management.
- **Colour contrast**: Brand colours meet WCAG AA contrast ratios (4.5:1 for text).
- **Reduced motion**: Framer Motion animations respect `prefers-reduced-motion`.

## Mock API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/register` | Register a new account |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/dashboard` | Dashboard summary data |
| GET | `/api/accounts` | List all accounts |
| GET | `/api/accounts/:id` | Get account details |
| GET | `/api/transactions` | List transactions (with filtering, sorting, pagination) |
| GET | `/api/transactions/:id` | Get transaction details |
| GET | `/api/profile` | Get user profile |
| PUT | `/api/profile` | Update user profile |
| POST | `/api/profile/avatar` | Upload avatar (mock) |

## Testing Strategy

Tests focus on critical user flows and component behaviour:

- **Authentication**: Login/register form validation, error handling, credential checking
- **Components**: Button variants, loading states, error boundary recovery
- **Dashboard**: Data rendering, loading skeletons, quick action links
- **Profile**: Form editing, validation, disabled fields

Tests use MSW's `setupServer` for consistent API mocking in the test environment.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint |
| `npm run storybook` | Launch Storybook component explorer |
| `npm run build-storybook` | Build static Storybook site |

See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for full component API documentation.

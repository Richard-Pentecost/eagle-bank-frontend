# Eagle Bank Design System

A component-driven design system built on Radix UI primitives and Tailwind CSS. Every component is accessible, composable, and themeable through shared design tokens.

Run `npm run storybook` to browse components interactively.

---

## Design Tokens

All tokens are defined in `src/styles/globals.css` via Tailwind's `@theme` directive.

### Colours

| Token | Value | Usage |
|-------|-------|-------|
| `brand-primary` | `#0f172a` | Text, headings, primary buttons |
| `brand-accent` | `#996d00` | Focus rings, spinners, links (WCAG AA on white) |
| `brand-accent-hover` | `#7a5700` | Accent hover state |
| `brand-success` | `#16a34a` | Deposits, active status, success messages |
| `brand-danger` | `#dc2626` | Withdrawals, errors, destructive actions |
| `brand-warning` | `#f59e0b` | Frozen status, pending states |
| `brand-muted` | `#64748b` | Secondary text, descriptions |
| `brand-bg` | `#f8fafc` | Page background |
| `brand-card` | `#ffffff` | Card surfaces |
| `brand-border` | `#e2e8f0` | Borders, dividers |

### Border Radius

| Token | Value |
|-------|-------|
| `radius-sm` | `0.375rem` (6px) |
| `radius-md` | `0.5rem` (8px) |
| `radius-lg` | `0.75rem` (12px) |
| `radius-xl` | `1rem` (16px) |

### Typography

**Font family:** Inter, ui-sans-serif, system-ui, sans-serif

Loaded asynchronously from Google Fonts with `preconnect` hints. Falls back to system fonts if unavailable.

---

## Utility: `cn()`

**File:** `src/lib/utils.ts`

Merges Tailwind classes using `clsx` + `tailwind-merge`. Use this in every component to allow consumers to override styles without conflicts.

```tsx
import { cn } from '@/lib/utils'

cn('px-4 py-2', isActive && 'bg-brand-primary', className)
```

---

## Components

### Button

**File:** `src/components/ui/button.tsx`

Primary interactive element with multiple visual variants and sizes.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'secondary' \| 'destructive' \| 'outline' \| 'ghost' \| 'link'` | `'default'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg' \| 'icon'` | `'md'` | Size preset |
| `isLoading` | `boolean` | `false` | Shows spinner, disables button |
| `asChild` | `boolean` | `false` | Renders child element via Radix Slot |
| `disabled` | `boolean` | `false` | Disables interaction |

#### Variants

| Variant | Appearance |
|---------|------------|
| `default` | Navy background, white text |
| `secondary` | Light gray background, navy text |
| `destructive` | Red background, white text |
| `outline` | White background, border, navy text |
| `ghost` | Transparent, navy text, gray hover |
| `link` | Gold text with underline on hover |

#### Sizes

| Size | Height | Padding |
|------|--------|---------|
| `sm` | 36px | `px-3` |
| `md` | 44px | `px-4` |
| `lg` | 48px | `px-6` |
| `icon` | 40x40px | none |

#### Usage

```tsx
<Button variant="default" size="md">Save</Button>
<Button variant="destructive" isLoading>Deleting...</Button>
<Button variant="outline" disabled>Unavailable</Button>
```

#### Accessibility

- Minimum touch target of 44px (md size)
- Visible focus ring (`ring-2 ring-brand-accent`)
- `disabled` state removes pointer events and reduces opacity
- `isLoading` sets `disabled` and adds `<Spinner>` with `role="status"`

---

### Input

**File:** `src/components/ui/input.tsx`

Text input with built-in error state. Integrates with react-hook-form via `forwardRef`.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `error` | `boolean` | `false` | Shows red border and error focus ring |
| `type` | `string` | `'text'` | HTML input type |
| All `InputHTMLAttributes` | | | Standard HTML input props |

#### Usage

```tsx
<Input placeholder="you@example.com" />
<Input error aria-describedby="email-error" />
```

#### Accessibility

- Sets `aria-invalid="true"` when `error` is true
- Pair with `aria-describedby` pointing to an error message element
- Visible focus ring changes to red in error state

---

### Label

**File:** `src/components/ui/label.tsx`

Wraps Radix UI's `Label` primitive for accessible form labels.

#### Usage

```tsx
<Label htmlFor="email">Email address</Label>
<Input id="email" />
```

---

### Card

**File:** `src/components/ui/card.tsx`

Composable card container with five sub-components.

#### Sub-components

| Component | Element | Purpose |
|-----------|---------|---------|
| `Card` | `<div>` | Outer container with border and shadow |
| `CardHeader` | `<div>` | Title area with padding |
| `CardTitle` | `<h3>` | Card heading |
| `CardDescription` | `<p>` | Subtitle in muted text |
| `CardContent` | `<div>` | Main content area |
| `CardFooter` | `<div>` | Bottom action area |

#### Usage

```tsx
<Card>
  <CardHeader>
    <CardTitle>Account Summary</CardTitle>
    <CardDescription>Your current balance</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-2xl font-bold">£4,250.75</p>
  </CardContent>
  <CardFooter>
    <Button size="sm">View Details</Button>
  </CardFooter>
</Card>
```

---

### Badge

**File:** `src/components/ui/badge.tsx`

Status indicator pill for labelling states.

#### Variants

| Variant | Background | Text | Usage |
|---------|------------|------|-------|
| `default` | Gray | Navy | General labels |
| `success` | Green tint | Green | Active, completed |
| `warning` | Amber tint | Amber | Frozen, pending |
| `danger` | Red tint | Red | Closed, failed |
| `info` | Blue tint | Blue | Informational |

#### Usage

```tsx
<Badge variant="success">Active</Badge>
<Badge variant="danger">Closed</Badge>
```

---

### Skeleton

**File:** `src/components/ui/skeleton.tsx`

Animated placeholder for loading states. Matches the dimensions of the content it replaces.

#### Usage

```tsx
<Skeleton className="h-4 w-32" />  {/* Text line */}
<Skeleton className="h-10 w-full" /> {/* Input */}
<Skeleton className="h-24 w-24 rounded-full" /> {/* Avatar */}
```

#### Accessibility

- `aria-hidden="true"` — hidden from screen readers
- Uses `animate-pulse` (disabled when `prefers-reduced-motion` is set)

---

### Spinner

**File:** `src/components/ui/spinner.tsx`

SVG-based loading indicator in the brand accent colour.

#### Sizes

| Size | Dimensions |
|------|------------|
| `sm` | 16x16px |
| `md` | 24x24px |
| `lg` | 40x40px |

#### Usage

```tsx
<Spinner size="lg" />
```

#### Accessibility

- `role="status"` and `aria-label="Loading"` for screen readers

---

### Table

**File:** `src/components/ui/table.tsx`

Semantic HTML table with responsive overflow wrapper.

#### Sub-components

| Component | Element | Purpose |
|-----------|---------|---------|
| `Table` | `<table>` | Wrapped in scrollable `<div>` |
| `TableHeader` | `<thead>` | Column headers |
| `TableBody` | `<tbody>` | Data rows |
| `TableRow` | `<tr>` | Row with hover highlight |
| `TableHead` | `<th>` | Header cell, muted text |
| `TableCell` | `<td>` | Data cell |

#### Usage

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead className="text-right">Balance</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Current Account</TableCell>
      <TableCell className="text-right">£4,250.75</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

## Feedback Components

### EmptyState

**File:** `src/components/feedback/empty-state.tsx`

Centered placeholder for pages or sections with no data.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | Yes | Main message |
| `description` | `string` | No | Supporting text |
| `icon` | `ReactNode` | No | Icon above title |
| `action` | `ReactNode` | No | CTA button |

```tsx
<EmptyState
  title="No transactions found"
  description="Try adjusting your filters."
  action={<Button size="sm" onClick={clearFilters}>Clear filters</Button>}
/>
```

---

### ErrorMessage

**File:** `src/components/feedback/error-message.tsx`

Error state with optional retry action.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | No | Defaults to "Something went wrong" |
| `message` | `string` | Yes | Error description |
| `onRetry` | `() => void` | No | Shows "Try again" button |

```tsx
<ErrorMessage
  message="Failed to load accounts"
  onRetry={() => retry()}
/>
```

#### Accessibility

- `role="alert"` announces error to screen readers

---

### ErrorBoundary

**File:** `src/components/feedback/error-boundary.tsx`

React error boundary that catches render errors and displays a fallback UI.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | Components to wrap |
| `fallback` | `ReactNode` | No | Custom error UI |

```tsx
<ErrorBoundary>
  <DashboardPage />
</ErrorBoundary>
```

Default fallback shows "Something went wrong" with a "Try again" button that resets the error state.

---

## Patterns

### Component conventions

- UI primitives (Button, Input, Label, Card, Table) use `React.forwardRef` for ref forwarding
- UI primitives accept `className` and merge via `cn()` so consumers can override styles
- Named exports everywhere (except lazy-loaded pages which use default)
- List item components wrapped in `React.memo` for render optimisation

### Form pattern

Every form uses `react-hook-form` + `zod` + these components:

```tsx
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
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
```

### Loading / Error / Empty pattern

Every data-dependent section handles all three states:

```tsx
if (error) return <ErrorMessage message={error} onRetry={retry} />
if (isLoading) return <Skeleton className="h-40 w-full" />
if (data.length === 0) return <EmptyState title="No items" />
return <DataList data={data} />
```

### Focus management

- All interactive elements have `focus-visible:ring-2 focus-visible:ring-brand-accent`
- Radix Dialog provides automatic focus trapping
- Skip-to-content link as first focusable element in the app shell

### Reduced motion

- CSS: `@media (prefers-reduced-motion: reduce)` disables all animations and transitions globally
- JS: `useReducedMotion()` hook disables Framer Motion variants conditionally

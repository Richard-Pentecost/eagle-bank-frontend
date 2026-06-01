import type { Meta, StoryObj } from '@storybook/react-vite'
import { Skeleton } from './skeleton'

const meta = {
  title: 'UI/Skeleton',
  component: Skeleton,
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { className: 'h-4 w-48' },
}

export const CardSkeleton: Story = {
  render: () => (
    <div className="max-w-md space-y-3 rounded-lg border border-brand-border p-6">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-4 w-52" />
      <Skeleton className="h-10 w-24" />
    </div>
  ),
}

export const ListSkeleton: Story = {
  render: () => (
    <div className="max-w-md space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  ),
}

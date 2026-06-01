import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmptyState } from './empty-state'
import { Button } from '../ui/button'

const meta = {
  title: 'Feedback/EmptyState',
  component: EmptyState,
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'No transactions found',
    description: 'Try adjusting your filters.',
  },
}

export const WithAction: Story = {
  args: {
    title: 'No accounts',
    description: "You don't have any accounts yet.",
    action: <Button size="sm">Create Account</Button>,
  },
}

export const WithIcon: Story = {
  args: {
    title: 'No results',
    description: 'We couldn\'t find what you\'re looking for.',
    icon: (
      <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
}

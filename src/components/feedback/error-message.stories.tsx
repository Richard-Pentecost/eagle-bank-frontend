import type { Meta, StoryObj } from '@storybook/react-vite'
import { ErrorMessage } from './error-message'

const meta = {
  title: 'Feedback/ErrorMessage',
  component: ErrorMessage,
} satisfies Meta<typeof ErrorMessage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    message: 'Failed to load data. Please check your connection.',
  },
}

export const WithCustomTitle: Story = {
  args: {
    title: 'Connection lost',
    message: 'Unable to reach the server. Please try again later.',
  },
}

export const WithRetry: Story = {
  args: {
    message: 'An unexpected error occurred.',
    onRetry: () => alert('Retrying...'),
  },
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './badge'

const meta = {
  title: 'UI/Badge',
  component: Badge,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'danger', 'info'],
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: 'Default' },
}

export const Success: Story = {
  args: { children: 'Active', variant: 'success' },
}

export const Warning: Story = {
  args: { children: 'Frozen', variant: 'warning' },
}

export const Danger: Story = {
  args: { children: 'Closed', variant: 'danger' },
}

export const Info: Story = {
  args: { children: 'Pending', variant: 'info' },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="success">Active</Badge>
      <Badge variant="warning">Frozen</Badge>
      <Badge variant="danger">Closed</Badge>
      <Badge variant="info">Pending</Badge>
    </div>
  ),
}

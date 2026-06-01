import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from './label'
import { Input } from './input'

const meta = {
  title: 'UI/Label',
  component: Label,
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: 'Email address' },
}

export const WithInput: Story = {
  render: () => (
    <div className="max-w-sm space-y-2">
      <Label htmlFor="name">Full name</Label>
      <Input id="name" placeholder="John Doe" />
    </div>
  ),
}

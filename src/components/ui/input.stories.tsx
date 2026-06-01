import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from './input'
import { Label } from './label'

const meta = {
  title: 'UI/Input',
  component: Input,
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { placeholder: 'Enter text...' },
}

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  ),
}

export const ErrorState: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="email-err">Email</Label>
      <Input id="email-err" type="email" error aria-describedby="email-error" value="notanemail" />
      <p id="email-error" className="text-sm text-brand-danger">Please enter a valid email</p>
    </div>
  ),
}

export const Disabled: Story = {
  args: { placeholder: 'Disabled', disabled: true },
}

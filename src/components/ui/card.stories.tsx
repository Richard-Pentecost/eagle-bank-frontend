import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card'
import { Button } from './button'

const meta = {
  title: 'UI/Card',
  component: Card,
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content with any elements inside.</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button size="sm">Save</Button>
        <Button size="sm" variant="outline">Cancel</Button>
      </CardFooter>
    </Card>
  ),
}

export const Simple: Story = {
  render: () => (
    <Card className="max-w-md">
      <CardContent className="pt-6">
        <p className="text-2xl font-bold">£4,250.75</p>
        <p className="text-sm text-brand-muted">Current Balance</p>
      </CardContent>
    </Card>
  ),
}

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/home')({
  component: () => <div>Hello "/app/home"!</div>,
})

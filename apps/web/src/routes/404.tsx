import { createFileRoute } from '@tanstack/react-router'
import { NotFoundPage } from '@/components/error-pages'

export const Route = createFileRoute('/404')({
  component: NotFoundPage,
})

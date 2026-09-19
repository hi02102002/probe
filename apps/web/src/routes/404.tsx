import { createFileRoute, notFound } from '@tanstack/react-router'
import { NotFoundPage } from '@/components/error-pages'

export const Route = createFileRoute('/404')({
  beforeLoad: () => {
    throw notFound()
  },
  component: NotFoundPage,
})

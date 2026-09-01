import { createFileRoute } from '@tanstack/react-router'
import { LocalizedNotFound } from '@/components/error-pages'

export const Route = createFileRoute('/{-$locale}/404')({
  component: LocalizedNotFound,
})

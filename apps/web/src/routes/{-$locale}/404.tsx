import { createFileRoute } from '@tanstack/react-router'
import { NotFoundPage } from '@/components/error-pages'
import { LocalizedLink } from '@/components/localized-link'

export const Route = createFileRoute('/{-$locale}/404')({
  component: NotFoundComponent,
})

export function NotFoundComponent() {
  return <NotFoundPage homeLink={<LocalizedLink to="/" />} />
}

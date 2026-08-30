import { createFileRoute } from '@tanstack/react-router'
import { NotFoundComponent } from './404'

export const Route = createFileRoute('/{-$locale}/$')({
  component: NotFoundComponent,
})

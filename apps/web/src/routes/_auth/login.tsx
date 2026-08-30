import { createFileRoute } from '@tanstack/react-router'

import z from 'zod'
import { LoginForm } from '@/features/auth'
import { generateAppSeo } from '@/lib/seo'

export const Route = createFileRoute('/_auth/login')({
  component: RouteComponent,
  head: () => generateAppSeo({
    pathname: '/login',
    title: 'Login',
  }),
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
})

function RouteComponent() {
  const { redirect } = Route.useSearch()

  return <LoginForm redirectTo={redirect} />
}

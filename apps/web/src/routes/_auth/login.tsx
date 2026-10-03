import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'
import { generateAppSeo } from '@/lib/seo'
import { LoginForm } from './_components/email-auth-forms'

export const Route = createFileRoute('/_auth/login')({
  component: RouteComponent,
  head: () => generateAppSeo({
    pathname: '/login',
    robots: {
      follow: false,
      index: false,
    },
    title: 'Login',
  }),
  validateSearch: z.object({
    // Set by Better Auth when an OAuth callback fails.
    error: z.string().optional().catch(undefined),
    redirect: z.string().optional(),
  }),
})

function RouteComponent() {
  const { error, redirect } = Route.useSearch()

  return <LoginForm initialError={error ? 'Sign-in failed. Please try again.' : undefined} redirectTo={redirect} />
}

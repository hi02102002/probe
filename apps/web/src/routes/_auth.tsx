import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

import { AuthLayout } from '@/features/auth'

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  beforeLoad: async ({ context, search }) => {
    const redirectProps: Parameters<typeof redirect>[0] = search.redirect
      ? { href: search.redirect }
      : {
          to: '/dashboard',
        }

    if (context.session) {
      throw redirect(redirectProps)
    }

    return { session: context.session }
  },
})

import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { AuthLayout } from '@/features/auth'

export const Route = createFileRoute('/_auth')({
  beforeLoad: async ({ context, search }) => {
    if (context.session) {
      if (search.redirect) {
        throw redirect({ href: search.redirect })
      }

      throw redirect({
        to: '/dashboard',
      })
    }

    return { session: context.session }
  },
  component: AuthLayout,
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
})

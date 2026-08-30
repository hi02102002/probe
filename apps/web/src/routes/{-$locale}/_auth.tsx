import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

import { AuthLayout } from '@/features/auth'

export const Route = createFileRoute('/{-$locale}/_auth')({
  component: AuthLayout,
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  beforeLoad: async ({ context, params, search }) => {
    if (context.session) {
      if (search.redirect) {
        throw redirect({ href: search.redirect })
      }

      throw redirect({
        to: '/{-$locale}/dashboard',
        params: { locale: params.locale },
      })
    }

    return { session: context.session }
  },
})

import { createFileRoute, redirect } from '@tanstack/react-router'

/**
 * The dashboard index is the endpoints list — /dashboard/endpoints is the
 * real page, so send visitors straight there instead of rendering a stub.
 */
export const Route = createFileRoute('/_protected/dashboard/')({
  beforeLoad: () => {
    throw redirect({ to: '/dashboard/endpoints' })
  },
})

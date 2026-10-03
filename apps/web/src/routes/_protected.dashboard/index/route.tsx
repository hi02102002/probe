import { createFileRoute } from '@tanstack/react-router'
import { generateAppSeo } from '@/lib/seo'
import { DashboardPage } from './_components/dashboard-page'

export const Route = createFileRoute('/_protected/dashboard/')({
  component: DashboardRouteComponent,
  context: ({ context }) => {
    const statsOptions = context.orpc.dashboard.stats.queryOptions({
      input: {},
    })

    const trendOptions = context.orpc.dashboard.trend.queryOptions({
      input: {},
    })

    const recentRequestsOptions = context.orpc.dashboard.recentRequests.queryOptions({
      input: {
        query: {
          limit: 10,
        },
      },
    })

    return {
      recentRequestsOptions,
      statsOptions,
      trendOptions,
    }
  },
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(context.statsOptions).catch(() => undefined),
      context.queryClient.ensureQueryData(context.trendOptions).catch(() => undefined),
      context.queryClient.ensureQueryData(context.recentRequestsOptions).catch(() => undefined),
    ])
  },
  head: () => generateAppSeo({
    description: 'Overview of your endpoints and captured webhook activity.',
    pathname: '/dashboard',
    robots: {
      follow: false,
      index: false,
    },
    title: 'Dashboard',
  }),
})

function DashboardRouteComponent() {
  return <DashboardPage />
}

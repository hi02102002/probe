import { getDashboardStats, getRecentRequests } from '@repo/db/queries/dashboard'
import { mapDatabaseError } from '#/orpc/errors/map-database-error.js'
import { authenticated, pub } from '#/orpc/os.js'

export const dashboardRouter = pub.dashboard.router({
  recentRequests: authenticated.dashboard.recentRequests.handler(async ({ context, input }) => {
    const result = await getRecentRequests(context.db, {
      limit: input.query.limit,
      userId: context.user.id,
    })

    if (result.isErr()) {
      throw mapDatabaseError(result.error)
    }

    return { items: result.value }
  }),
  stats: authenticated.dashboard.stats.handler(async ({ context }) => {
    const result = await getDashboardStats(context.db, context.user.id)

    if (result.isErr()) {
      throw mapDatabaseError(result.error)
    }

    return result.value
  }),
})

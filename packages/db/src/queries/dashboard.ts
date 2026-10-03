import { and, count, desc, eq, gte } from 'drizzle-orm'
import { withDb } from '../helpers/with-db.js'
import { endpoint, webhook_request } from '../postgres/schema.js'

const DAY_MS = 24 * 60 * 60 * 1000

export const getDashboardStats = withDb(async (db, userId: string) => {
  const now = Date.now()
  const since24h = new Date(now - 1 * DAY_MS)
  const since7d = new Date(now - 7 * DAY_MS)

  const [
    endpointsResult,
    activeEndpointsResult,
    requests24hResult,
    requests7dResult,
  ] = await Promise.all([
    db
      .select({ value: count() })
      .from(endpoint)
      .where(eq(endpoint.userId, userId)),
    db
      .select({ value: count() })
      .from(endpoint)
      .where(and(eq(endpoint.userId, userId), eq(endpoint.status, 'active'))),
    db
      .select({ value: count() })
      .from(webhook_request)
      .innerJoin(endpoint, eq(endpoint.id, webhook_request.endpointId))
      .where(and(
        eq(endpoint.userId, userId),
        gte(webhook_request.createdAt, since24h),
      )),
    db
      .select({ value: count() })
      .from(webhook_request)
      .innerJoin(endpoint, eq(endpoint.id, webhook_request.endpointId))
      .where(and(
        eq(endpoint.userId, userId),
        gte(webhook_request.createdAt, since7d),
      )),
  ])

  return {
    stats: {
      activeEndpoints: activeEndpointsResult[0]?.value ?? 0,
      endpoints: endpointsResult[0]?.value ?? 0,
      requests24h: requests24hResult[0]?.value ?? 0,
      requests7d: requests7dResult[0]?.value ?? 0,
    },
  }
})

export interface GetRecentRequestsInput {
  readonly userId: string
  readonly limit: number
}

export const getRecentRequests = withDb(async (db, input: GetRecentRequestsInput) => {
  return await db
    .select({
      createdAt: webhook_request.createdAt,
      endpointId: webhook_request.endpointId,
      endpointName: endpoint.name,
      id: webhook_request.id,
      method: webhook_request.method,
      size: webhook_request.size,
      statusCode: webhook_request.statusCode,
      url: webhook_request.url,
    })
    .from(webhook_request)
    .innerJoin(endpoint, eq(endpoint.id, webhook_request.endpointId))
    .where(eq(endpoint.userId, input.userId))
    .orderBy(desc(webhook_request.createdAt), desc(webhook_request.id))
    .limit(input.limit)
})

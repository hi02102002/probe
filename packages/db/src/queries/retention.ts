import type { PostgresDatabase } from '../postgres/index.js'
import { and, eq, inArray, lt } from 'drizzle-orm'
import { withDb } from '../helpers/with-db.js'
import { endpoint, forward_log, replay_log, user, webhook_request } from '../postgres/schema.js'

const BATCH_SIZE = 5_000
const MAX_ROUNDS = 20

export interface DeleteExpiredOptions {
  /**
   * When true, only rows belonging to endpoints owned by free-plan users
   * are deleted (the short-retention tier).
   */
  readonly freePlanOnly?: boolean
}

function freePlanEndpointIds(db: PostgresDatabase) {
  return db
    .select({ id: endpoint.id })
    .from(endpoint)
    .innerJoin(user, eq(user.id, endpoint.userId))
    .where(eq(user.plan, 'free'))
}

export const deleteExpiredWebhookRequests = withDb(async (db, cutoff: Date, options?: DeleteExpiredOptions) => {
  const scopeCondition = options?.freePlanOnly
    ? inArray(webhook_request.endpointId, freePlanEndpointIds(db))
    : undefined

  let total = 0

  for (let round = 0; round < MAX_ROUNDS; round++) {
    const batch = await db
      .select({ id: webhook_request.id })
      .from(webhook_request)
      .where(and(lt(webhook_request.createdAt, cutoff), scopeCondition))
      .limit(BATCH_SIZE)

    if (batch.length === 0) {
      break
    }

    const deleted = await db
      .delete(webhook_request)
      .where(inArray(webhook_request.id, batch.map(row => row.id)))
      .returning({ id: webhook_request.id })

    total += deleted.length

    if (batch.length < BATCH_SIZE) {
      break
    }
  }

  return total
})

export const deleteExpiredReplayLogs = withDb(async (db, cutoff: Date, options?: DeleteExpiredOptions) => {
  const scopeCondition = options?.freePlanOnly
    ? inArray(replay_log.endpointId, freePlanEndpointIds(db))
    : undefined

  let total = 0

  for (let round = 0; round < MAX_ROUNDS; round++) {
    const batch = await db
      .select({ id: replay_log.id })
      .from(replay_log)
      .where(and(lt(replay_log.createdAt, cutoff), scopeCondition))
      .limit(BATCH_SIZE)

    if (batch.length === 0) {
      break
    }

    const deleted = await db
      .delete(replay_log)
      .where(inArray(replay_log.id, batch.map(row => row.id)))
      .returning({ id: replay_log.id })

    total += deleted.length

    if (batch.length < BATCH_SIZE) {
      break
    }
  }

  return total
})

export const deleteExpiredForwardLogs = withDb(async (db, cutoff: Date, options?: DeleteExpiredOptions) => {
  const scopeCondition = options?.freePlanOnly
    ? inArray(forward_log.endpointId, freePlanEndpointIds(db))
    : undefined

  let total = 0

  for (let round = 0; round < MAX_ROUNDS; round++) {
    const batch = await db
      .select({ id: forward_log.id })
      .from(forward_log)
      .where(and(lt(forward_log.createdAt, cutoff), scopeCondition))
      .limit(BATCH_SIZE)

    if (batch.length === 0) {
      break
    }

    const deleted = await db
      .delete(forward_log)
      .where(inArray(forward_log.id, batch.map(row => row.id)))
      .returning({ id: forward_log.id })

    total += deleted.length

    if (batch.length < BATCH_SIZE) {
      break
    }
  }

  return total
})

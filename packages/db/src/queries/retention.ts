import { inArray, lt } from 'drizzle-orm'
import { withDb } from '../helpers/with-db.js'
import { forward_log, replay_log, webhook_request } from '../postgres/schema.js'

const BATCH_SIZE = 5_000
const MAX_ROUNDS = 20

export const deleteExpiredWebhookRequests = withDb(async (db, cutoff: Date) => {
  let total = 0

  for (let round = 0; round < MAX_ROUNDS; round++) {
    const batch = await db
      .select({ id: webhook_request.id })
      .from(webhook_request)
      .where(lt(webhook_request.createdAt, cutoff))
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

export const deleteExpiredReplayLogs = withDb(async (db, cutoff: Date) => {
  let total = 0

  for (let round = 0; round < MAX_ROUNDS; round++) {
    const batch = await db
      .select({ id: replay_log.id })
      .from(replay_log)
      .where(lt(replay_log.createdAt, cutoff))
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

export const deleteExpiredForwardLogs = withDb(async (db, cutoff: Date) => {
  let total = 0

  for (let round = 0; round < MAX_ROUNDS; round++) {
    const batch = await db
      .select({ id: forward_log.id })
      .from(forward_log)
      .where(lt(forward_log.createdAt, cutoff))
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

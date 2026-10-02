import type { CronJob } from './types.js'
import {
  deleteExpiredForwardLogs,
  deleteExpiredReplayLogs,
  deleteExpiredWebhookRequests,
} from '@repo/db'
import { createLogger } from 'evlog'
import { getDatabase } from '#/db.js'
import { env } from '#/env.js'

const DAY_MS = 24 * 60 * 60 * 1000

export function retentionCutoff(now: Date, days: number): Date {
  return new Date(now.getTime() - days * DAY_MS)
}

async function purgeExpiredRows(): Promise<void> {
  if (env.RETENTION_DAYS <= 0) {
    return
  }

  const log = createLogger({ job: { name: 'retention' } })
  const db = getDatabase()
  const cutoff = retentionCutoff(new Date(), env.RETENTION_DAYS)

  try {
    const results = await Promise.allSettled([
      deleteExpiredWebhookRequests(db, cutoff),
      deleteExpiredReplayLogs(db, cutoff),
      deleteExpiredForwardLogs(db, cutoff),
    ])

    let total = 0
    let failed = false

    for (const result of results) {
      if (result.status === 'rejected') {
        failed = true
        continue
      }

      if (result.value.isErr()) {
        failed = true
        continue
      }

      total += result.value.value
    }

    if (failed) {
      log.error('Retention purge failed for some tables')
      return
    }

    if (total > 0) {
      log.set({ retention: { olderThanDays: env.RETENTION_DAYS, removed: total } })
    }
  }
  catch (error) {
    log.error('Retention purge failed', {
      error: error instanceof Error ? error.message : String(error),
    })
  }
  finally {
    log.emit()
  }
}

/**
 * Purges webhook requests, replay and forward logs older than
 * RETENTION_DAYS (0 disables it). Concurrent runs across API instances are
 * harmless because the deletes are idempotent.
 */
export const retentionJob: CronJob = {
  name: 'retention',
  run: purgeExpiredRows,
  runOnBoot: true,
  schedule: '0 3 * * *',
}

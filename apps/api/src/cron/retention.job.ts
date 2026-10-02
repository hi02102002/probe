import {
  deleteExpiredForwardLogs,
  deleteExpiredReplayLogs,
  deleteExpiredWebhookRequests,
  type DeleteExpiredOptions,
} from '@repo/db'
import { createLogger } from 'evlog'
import { PLAN_LIMITS } from '@repo/utils'
import { getDatabase } from '#/db.js'
import { env } from '#/env.js'
import type { CronJob } from './types.js'

const DAY_MS = 24 * 60 * 60 * 1000

export function retentionCutoff(now: Date, days: number): Date {
  return new Date(now.getTime() - days * DAY_MS)
}

interface PurgeScope {
  readonly label: string
  readonly cutoff: Date
  readonly options?: DeleteExpiredOptions
}

function summarize(results: Awaited<ReturnType<typeof runScope>>): { failed: boolean, total: number } {
  let total = 0
  let failed = false

  for (const result of results) {
    if (result.status === 'rejected' || result.value.isErr()) {
      failed = true
      continue
    }

    total += result.value.value
  }

  return { failed, total }
}

function runScope(db: ReturnType<typeof getDatabase>, scope: PurgeScope) {
  return Promise.allSettled([
    deleteExpiredWebhookRequests(db, scope.cutoff, scope.options),
    deleteExpiredReplayLogs(db, scope.cutoff, scope.options),
    deleteExpiredForwardLogs(db, scope.cutoff, scope.options),
  ])
}

async function purgeExpiredRows(): Promise<void> {
  if (env.RETENTION_DAYS <= 0) {
    return
  }

  const log = createLogger({ job: { name: 'retention' } })
  const db = getDatabase()
  const now = new Date()

  const scopes: readonly PurgeScope[] = [
    { cutoff: retentionCutoff(now, env.RETENTION_DAYS), label: 'global' },
    {
      cutoff: retentionCutoff(now, PLAN_LIMITS.free.retentionDays),
      label: 'free-tier',
      options: { freePlanOnly: true },
    },
  ]

  try {
    const summaries = await Promise.all(
      scopes.map(async scope => ({ scope, ...summarize(await runScope(db, scope)) })),
    )

    let allFailed = true

    for (const { failed, scope, total } of summaries) {
      if (!failed) {
        allFailed = false
      }

      if (total > 0) {
        log.set({ retention: { [scope.label]: { olderThanDays: Math.round((now.getTime() - scope.cutoff.getTime()) / DAY_MS), removed: total } } })
      }
    }

    if (allFailed) {
      log.error('Retention purge failed for some tables')
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
 * Purges expired data in two tiers: everything older than RETENTION_DAYS
 * regardless of plan (0 disables), plus free-plan users' data older than the
 * free tier's shorter window. Concurrent runs across API instances are
 * harmless because the deletes are idempotent.
 */
export const retentionJob: CronJob = {
  name: 'retention',
  run: purgeExpiredRows,
  runOnBoot: true,
  schedule: '0 3 * * *',
}

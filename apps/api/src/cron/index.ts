import type { CronJob } from './types.js'
import process from 'node:process'
import cron from 'node-cron'
import { retentionJob } from './retention.job.js'

const BOOT_DELAY_MS = 30_000

const jobs: readonly CronJob[] = [
  retentionJob,
]

/**
 * Registers every cron job. Each job also gets one run shortly after boot
 * (when it opts in via runOnBoot), so a fresh deploy catches up immediately
 * instead of waiting for its first schedule slot.
 */
export function startCronJobs(): void {
  for (const job of jobs) {
    if (!cron.validate(job.schedule)) {
      process.stdout.write(`⚠️ Invalid cron schedule for job '${job.name}': ${job.schedule}\n`)
      continue
    }

    cron.schedule(job.schedule, () => void job.run(), { name: job.name })

    if (job.runOnBoot) {
      const timeout = setTimeout(() => void job.run(), BOOT_DELAY_MS)

      timeout.unref()
    }
  }
}

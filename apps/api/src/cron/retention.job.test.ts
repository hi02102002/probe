import type { Mock } from 'vitest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { startCronJobs } from './index.js'
import { retentionCutoff, retentionJob } from './retention.job.js'

const mocks = vi.hoisted(() => ({
  env: { RETENTION_DAYS: 30 },
  getDatabase: vi.fn(),
  deleteExpiredWebhookRequests: vi.fn(),
  deleteExpiredReplayLogs: vi.fn(),
  deleteExpiredForwardLogs: vi.fn(),
  cronSchedule: vi.fn(() => ({ stop: vi.fn() })),
  cronValidate: vi.fn(() => true),
}))

vi.mock('node-cron', () => ({
  default: {
    schedule: mocks.cronSchedule,
    validate: mocks.cronValidate,
  },
}))

vi.mock('#/env.js', () => ({ env: mocks.env }))

vi.mock('#/db.js', () => ({ getDatabase: mocks.getDatabase }))

vi.mock('@repo/db', () => ({
  deleteExpiredWebhookRequests: mocks.deleteExpiredWebhookRequests,
  deleteExpiredReplayLogs: mocks.deleteExpiredReplayLogs,
  deleteExpiredForwardLogs: mocks.deleteExpiredForwardLogs,
}))

function successResult(value: number): { isErr: () => false, value: number } {
  return { isErr: () => false, value }
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-10-03T12:00:00Z'))
  mocks.getDatabase.mockReturnValue({ query: {} })
  for (const mock of [mocks.deleteExpiredWebhookRequests, mocks.deleteExpiredReplayLogs, mocks.deleteExpiredForwardLogs] as Mock[]) {
    mock.mockReset()
    mock.mockResolvedValue(successResult(0))
  }
})

afterEach(() => {
  vi.useRealTimers()
})

describe('retentionCutoff', () => {
  it('subtracts the retention days from now', () => {
    const now = new Date('2026-10-03T12:00:00Z')

    expect(retentionCutoff(now, 30)).toEqual(new Date('2026-09-03T12:00:00Z'))
    expect(retentionCutoff(now, 1)).toEqual(new Date('2026-10-02T12:00:00Z'))
  })
})

describe('retentionJob.run', () => {
  it('purges all three tables with the retention cutoff', async () => {
    mocks.env.RETENTION_DAYS = 30
    mocks.deleteExpiredWebhookRequests.mockResolvedValue(successResult(3))
    mocks.deleteExpiredReplayLogs.mockResolvedValue(successResult(2))
    mocks.deleteExpiredForwardLogs.mockResolvedValue(successResult(1))

    await retentionJob.run()

    const cutoff = retentionCutoff(new Date('2026-10-03T12:00:00Z'), 30)
    expect(mocks.deleteExpiredWebhookRequests).toHaveBeenCalledExactlyOnceWith(expect.anything(), cutoff)
    expect(mocks.deleteExpiredReplayLogs).toHaveBeenCalledExactlyOnceWith(expect.anything(), cutoff)
    expect(mocks.deleteExpiredForwardLogs).toHaveBeenCalledExactlyOnceWith(expect.anything(), cutoff)
  })

  it('does nothing when retention is disabled', async () => {
    mocks.env.RETENTION_DAYS = 0

    await retentionJob.run()

    expect(mocks.getDatabase).not.toHaveBeenCalled()
    expect(mocks.deleteExpiredWebhookRequests).not.toHaveBeenCalled()
    mocks.env.RETENTION_DAYS = 30
  })

  it('keeps the process alive when a purge round fails', async () => {
    mocks.env.RETENTION_DAYS = 7
    mocks.deleteExpiredWebhookRequests.mockRejectedValue(new Error('database unavailable'))

    await expect(retentionJob.run()).resolves.toBeUndefined()
    mocks.env.RETENTION_DAYS = 30
  })
})

describe('startCronJobs', () => {
  it('registers the retention job and runs it shortly after boot', async () => {
    startCronJobs()

    expect(mocks.cronValidate).toHaveBeenCalledWith(retentionJob.schedule)
    expect(mocks.cronSchedule).toHaveBeenCalledWith(
      retentionJob.schedule,
      expect.any(Function),
      { name: retentionJob.name },
    )

    await vi.advanceTimersByTimeAsync(30_000)

    // Fake timers advanced the mocked clock by the 30s boot delay.
    const cutoff = retentionCutoff(new Date('2026-10-03T12:00:30Z'), 30)
    expect(mocks.deleteExpiredWebhookRequests).toHaveBeenCalledExactlyOnceWith(expect.anything(), cutoff)
  })

  it('skips jobs with an invalid schedule', () => {
    mocks.cronValidate.mockReturnValue(false)

    startCronJobs()

    expect(mocks.cronSchedule).not.toHaveBeenCalled()
    mocks.cronValidate.mockReturnValue(true)
  })
})

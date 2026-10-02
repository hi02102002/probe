export interface CronJob {
  readonly name: string
  readonly run: () => Promise<void>
  readonly runOnBoot: boolean
  readonly schedule: string
}

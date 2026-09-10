import { os } from '#/orpc/os.js'

export const systemRouter = os.system.router({
  health: os.system.health.handler(() => ({
    service: 'probe-api',
    status: 'ok',
  })),
})

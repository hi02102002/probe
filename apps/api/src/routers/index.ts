import { os } from '#/libs/orpc/os.js'

export const router = os.router({
  system: {
    health: os.system.health.handler(() => ({
      service: 'probe-api',
      status: 'ok',
    })),
  },
})

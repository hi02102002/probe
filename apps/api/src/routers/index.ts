import { os } from '#/libs/orpc/os.js'
import { endpointRouter } from './endpoint.router.js'

export const router = os.router({
  endpoint: endpointRouter,
  system: {
    health: os.system.health.handler(() => ({
      service: 'probe-api',
      status: 'ok',
    })),
  },
})

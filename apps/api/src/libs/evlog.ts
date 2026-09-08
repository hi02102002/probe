import {
  createAppEnricher,
  createCloudflareEnricher,
  getProductionSamplingConfig,
} from '@repo/utils'
import { initLogger } from 'evlog'
import { createAuthMiddleware } from 'evlog/better-auth'
import { getAuth } from '#/auth.js'

initLogger({
  env: {
    service: 'probe-api',
  },
  sampling: getProductionSamplingConfig(),
})

export { createAppEnricher, createCloudflareEnricher }

let identifyAuth: ReturnType<typeof createAuthMiddleware> | undefined

export function getAuthIdentifier() {
  identifyAuth ??= createAuthMiddleware(getAuth(), {
    exclude: ['/api/auth/**'],
  })

  return identifyAuth
}

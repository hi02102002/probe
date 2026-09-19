import process from 'node:process'
import { definePlugin } from 'nitro'
import { useRuntimeConfig } from 'nitro/runtime-config'

export default definePlugin((nitroApp) => {
  const config = useRuntimeConfig()
  const buildVersion = (config.app as { buildVersion?: string })?.buildVersion
    || process.env.COMMIT_HASH
    || 'latest'
  const etagValue = `"${buildVersion}"`

  nitroApp.hooks.hook('request', (event) => {
    try {
      const anyEvent = event as any
      anyEvent.res?.headers?.set?.('ETag', etagValue)
    }
    catch {}
  })

  nitroApp.hooks.hook('response', (res, event) => {
    try {
      if (!res.headers.has('ETag')) {
        res.headers.set('ETag', etagValue)
      }
    }
    catch {}
    try {
      const anyEvent = event as any
      anyEvent.res?.headers?.set?.('ETag', etagValue)
    }
    catch {}
  })
})

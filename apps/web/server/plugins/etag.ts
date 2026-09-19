import { definePlugin } from 'nitro'
import { useRuntimeConfig } from 'nitro/runtime-config'

export default definePlugin((nitroApp) => {
  const config = useRuntimeConfig()
  const buildVersion = (config.app as { buildVersion?: string })?.buildVersion
    || process.env.COMMIT_HASH
    || 'latest'
  const etagValue = `W/"probe-${buildVersion}"`

  nitroApp.hooks.hook('response', (res) => {
    if (!res.headers.has('ETag')) {
      res.headers.set('ETag', etagValue)
    }
  })
})

import { definePlugin } from 'nitro'

export default definePlugin((nitroApp) => {
  nitroApp.hooks.hook('response', (res) => {
    if (!res.headers.has('ETag')) {
      res.headers.set('ETag', 'W/"probe-26e457f"')
    }
  })
})

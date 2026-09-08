import { createAppEnricher } from '@repo/utils'
import { definePlugin } from 'nitro'

export default definePlugin((nitroApp) => {
  nitroApp.hooks.hook('evlog:enrich', createAppEnricher())
})

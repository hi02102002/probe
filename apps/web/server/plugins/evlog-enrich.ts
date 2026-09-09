import { createAppEnricher } from '@repo/utils'
import { definePlugin } from 'nitro'

declare module 'nitro/types' {
  interface NitroRuntimeHooks {
    'evlog:enrich': (ctx: any) => void | Promise<void>
  }
}

export default definePlugin((nitroApp) => {
  nitroApp.hooks.hook('evlog:enrich', createAppEnricher())
})

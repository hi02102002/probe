import type { TailSamplingContext } from '@repo/utils'
import { createAppEnricher } from '@repo/utils'
import { definePlugin } from 'nitro'

declare module 'nitro/types' {
  interface NitroRuntimeHooks {
    'evlog:emit:keep': (ctx: TailSamplingContext) => void | Promise<void>
    'evlog:enrich': (ctx: any) => void | Promise<void>
  }
}

export default definePlugin((nitroApp) => {
  nitroApp.hooks.hook('evlog:enrich', createAppEnricher())

  nitroApp.hooks.hook('evlog:emit:keep', (ctx) => {
    // Force-keep events for premium or enterprise users
    const user = ctx.context?.user as { isPremium?: boolean, plan?: string } | undefined
    if (user?.isPremium || user?.plan === 'enterprise') {
      ctx.shouldKeep = true
    }
  })
})

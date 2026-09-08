import type { EnrichContext } from 'evlog'
import type { EnricherOptions } from 'evlog/enrichers'
import { createDefaultEnrichers } from 'evlog/enrichers'
import { composeEnrichers, defineEnricher, getHeader } from 'evlog/toolkit'

export type { EnrichContext, EnricherOptions }

export interface CloudflareInfo {
  rayId?: string
  colo?: string
  connectingIp?: string
  continent?: string
  postalCode?: string
  timezone?: string
}

export function createCloudflareEnricher(
  options: EnricherOptions = {},
): (ctx: EnrichContext) => void {
  return defineEnricher(
    {
      name: 'cf',
      field: 'cf',
      compute: ({ headers }) => {
        if (!headers)
          return undefined

        const rayId = getHeader(headers, 'cf-ray')
        const colo = rayId?.split('-')[1]
        const connectingIp = getHeader(headers, 'cf-connecting-ip')
        const continent = getHeader(headers, 'cf-ipcontinent')
        const postalCode = getHeader(headers, 'cf-postal-code')
        const timezone = getHeader(headers, 'cf-timezone')

        if (!rayId && !connectingIp && !continent && !postalCode && !timezone) {
          return undefined
        }

        return {
          rayId,
          colo,
          connectingIp,
          continent,
          postalCode,
          timezone,
        }
      },
    },
    options,
  )
}

export function createAppEnricher(
  options: EnricherOptions = {},
): (ctx: EnrichContext) => Promise<void> {
  return composeEnrichers(
    [
      createDefaultEnrichers(options),
      createCloudflareEnricher(options),
    ],
    { name: 'app-enricher' },
  )
}

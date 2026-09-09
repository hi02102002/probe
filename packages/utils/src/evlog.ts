import type {
  EnrichContext,
  SamplingConfig,
  SamplingRates,
  TailSamplingCondition,
  TailSamplingContext,
} from 'evlog'
import type { EnricherOptions } from 'evlog/enrichers'
import { createDefaultEnrichers } from 'evlog/enrichers'

function getHeader(
  headers: Record<string, unknown> | undefined,
  name: string,
): string | undefined {
  if (!headers)
    return undefined
  if (typeof headers[name] === 'string')
    return headers[name] as string
  const lowerName = name.toLowerCase()
  if (typeof headers[lowerName] === 'string')
    return headers[lowerName] as string
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === lowerName && typeof value === 'string')
      return value
  }
  return undefined
}

function defineEnricher(
  def: {
    name: string
    field: string
    compute: (ctx: EnrichContext) => unknown
  },
  options: EnricherOptions = {},
): (ctx: EnrichContext) => void {
  const { name, field, compute } = def
  return (ctx: EnrichContext) => {
    let computed: unknown
    try {
      computed = compute(ctx)
    }
    catch (err) {
      console.error(`[evlog/${name}] enrich failed:`, err)
      return
    }
    if (computed === undefined || !field)
      return
    const target = (ctx.event as Record<string, unknown>)[field]
    if (target && typeof target === 'object' && typeof computed === 'object') {
      ;(ctx.event as Record<string, unknown>)[field] = options.overwrite
        ? { ...(target as Record<string, unknown>), ...(computed as Record<string, unknown>) }
        : { ...(computed as Record<string, unknown>), ...(target as Record<string, unknown>) }
    }
    else {
      ;(ctx.event as Record<string, unknown>)[field] = computed
    }
  }
}

function composeEnrichers(
  enrichers: Array<(ctx: EnrichContext) => void | Promise<void>>,
  options: { name?: string } = {},
): (ctx: EnrichContext) => Promise<void> {
  const label = options.name ?? 'compose-enrichers'
  return async (ctx: EnrichContext) => {
    for (const enricher of enrichers) {
      try {
        await enricher(ctx)
      }
      catch (err) {
        console.error(`[evlog/${label}] enrich failed:`, err)
      }
    }
  }
}

export type {
  EnrichContext,
  EnricherOptions,
  SamplingConfig,
  SamplingRates,
  TailSamplingCondition,
  TailSamplingContext,
}

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

export const defaultSamplingConfig: SamplingConfig = {
  rates: {
    info: 10,
    warn: 50,
    debug: 0,
    error: 100,
  },
  keep: [
    { status: 400 },
    { duration: 1000 },
    { path: '/api/critical/**' },
  ],
}

declare const process: { env?: Record<string, string | undefined> } | undefined

export function getProductionSamplingConfig(
  isProduction = typeof process !== 'undefined' && process.env?.NODE_ENV === 'production',
): SamplingConfig | undefined {
  return isProduction ? defaultSamplingConfig : undefined
}

export async function enrichLogger(
  log?: { set: (fields: Record<string, unknown>) => void },
  headers?: unknown,
) {
  if (!log || !headers)
    return

  const safeHeaders: Record<string, string> = {}
  if (typeof (headers as { forEach?: unknown }).forEach === 'function') {
    (headers as Headers).forEach((value, key) => {
      safeHeaders[key] = value
    })
  }
  else if (typeof headers === 'object' && headers !== null) {
    for (const [key, value] of Object.entries(headers)) {
      if (typeof value === 'string')
        safeHeaders[key] = value
    }
  }

  const enrich = createAppEnricher()
  const ctx = { event: {} as Record<string, unknown>, headers: safeHeaders }
  await enrich(ctx as any)
  if (Object.keys(ctx.event).length > 0) {
    log.set(ctx.event)
  }
}

import type { endpoint_rule } from '@repo/db/schema'
import type { MiddlewareHandler } from 'hono'
import { Buffer } from 'node:buffer'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { getEndpointByToken } from '@repo/db'
import { getDatabase } from '#/db.js'
import { safeFetch } from '#/libs/safe-fetch.js'
import { assertPublicHttpUrl } from '#/libs/ssrf.js'

type EndpointRule = typeof endpoint_rule.$inferSelect

const FORWARD_TIMEOUT_MS = 10_000

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function computeSignature(body: string, secret: string): string {
  return createHmac('sha256', secret).update(body).digest('hex')
}

function isSignatureProvidedValid(provided: string | undefined, expected: string): boolean {
  if (!provided) {
    return false
  }

  const normalized = provided.trim().toLowerCase()
  const candidate = normalized.startsWith('sha256=') ? normalized.slice('sha256='.length) : normalized
  const candidateBuffer = Buffer.from(candidate, 'utf8')
  const expectedBuffer = Buffer.from(expected, 'utf8')

  return candidateBuffer.length === expectedBuffer.length && timingSafeEqual(candidateBuffer, expectedBuffer)
}

async function forwardCapturedRequest(
  rule: EndpointRule,
  options: {
    readonly contentType: string | undefined
    readonly log: { error: (message: string, data?: unknown) => void } | undefined
    readonly method: string
    readonly rawBody: string
  },
): Promise<void> {
  const targetUrl = rule.forwardTargetUrl

  if (!targetUrl) {
    return
  }

  try {
    const url = await assertPublicHttpUrl(targetUrl)
    const headers = new Headers()

    const contentType = options.contentType
    if (contentType) {
      headers.set('content-type', contentType)
    }

    if (rule.signatureEnabled && rule.signatureHeaderName && rule.signatureSecret) {
      headers.set(
        rule.signatureHeaderName,
        `sha256=${computeSignature(options.rawBody, rule.signatureSecret)}`,
      )
    }

    await safeFetch(url, {
      body: options.method === 'GET' ? undefined : options.rawBody || undefined,
      headers,
      method: options.method,
      signal: AbortSignal.timeout(FORWARD_TIMEOUT_MS),
    })
  }
  catch (forwardError) {
    options.log?.error('Failed to forward ingested webhook', {
      endpointRuleId: rule.id,
      error: forwardError instanceof Error ? forwardError.message : String(forwardError),
      targetUrl,
    })
  }
}

export const ingestRulesMiddleware: MiddlewareHandler = async (c, next) => {
  const match = c.req.path.match(/^\/api\/e\/([^/]+)$/)

  if (!match) {
    return next()
  }

  const db = getDatabase()
  const endpoint = await getEndpointByToken(db, match[1]!)

  if (endpoint.isErr() || endpoint.value.status !== 'active') {
    return next()
  }

  const rule = await db.query.endpoint_rule.findFirst({
    where: { endpointId: endpoint.value.id },
  })

  if (!rule) {
    return next()
  }

  const rawBody = await c.req.raw.clone().text().catch(() => '')

  if (rule.signatureEnabled && rule.signatureHeaderName && rule.signatureSecret) {
    const provided = c.req.header(rule.signatureHeaderName)
    const expected = computeSignature(rawBody, rule.signatureSecret)

    if (!isSignatureProvidedValid(provided, expected)) {
      return c.json({ error: 'Invalid webhook signature' }, 401)
    }
  }

  if (rule.delayEnabled && rule.delayMs && rule.delayMs > 0) {
    await sleep(Math.min(rule.delayMs, 10_000))
  }

  await next()

  if (rule.customResponseEnabled && c.res.status === 200) {
    const headers = new Headers(c.res.headers)
    headers.set('content-type', rule.customContentType || 'application/json')
    c.res = new Response(rule.customResponseBody ?? '', {
      headers,
      status: rule.customStatusCode ?? 200,
    })
  }

  if (rule.forwardEnabled) {
    void forwardCapturedRequest(rule, {
      contentType: c.req.header('content-type'),
      log: c.get('log'),
      method: c.req.method,
      rawBody,
    })
  }
}

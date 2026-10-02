import type { Context } from 'hono'
import type { Mock } from 'vitest'
import { createHmac } from 'node:crypto'
import { lookup } from 'node:dns/promises'
import { Hono } from 'hono'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ingestRulesMiddleware } from './ingest-rules.js'

const mocks = vi.hoisted(() => ({
  getEndpointByToken: vi.fn(),
  getDatabase: vi.fn(),
  findRule: vi.fn(),
  fetch: vi.fn<(...args: unknown[]) => Promise<Response>>(),
}))

vi.mock('@repo/db', () => ({
  getEndpointByToken: mocks.getEndpointByToken,
}))

vi.mock('#/db.js', () => ({
  getDatabase: mocks.getDatabase,
}))

vi.mock('node:dns/promises', () => ({
  lookup: vi.fn(),
}))

const mockLookup = lookup as unknown as Mock

const SECRET = 'whsec_test_1234'
const RAW_BODY = '{"a":1}'

function makeEndpoint(overrides: Partial<{ id: string, status: string }> = {}) {
  return { id: 'ep_123', status: 'active', ...overrides }
}

function makeRule(overrides: Record<string, unknown> = {}) {
  return {
    id: 'er_1',
    endpointId: 'ep_123',
    customResponseEnabled: false,
    customStatusCode: null,
    customContentType: null,
    customResponseBody: null,
    delayEnabled: false,
    delayMs: null,
    signatureEnabled: false,
    signatureHeaderName: null,
    signatureSecret: null,
    forwardEnabled: false,
    forwardTargetUrl: null,
    ...overrides,
  }
}

function buildApp(handler: (c: Context) => Response | Promise<Response> = c => c.text('ok')) {
  const app = new Hono()
  app.use('*', ingestRulesMiddleware)
  app.all('/api/e/:token', handler)
  return app
}

function signatureFor(body: string, secret: string): string {
  return createHmac('sha256', secret).update(body).digest('hex')
}

beforeEach(() => {
  vi.unstubAllGlobals()
  vi.stubGlobal('fetch', mocks.fetch)
  mocks.fetch.mockReset()
  mockLookup.mockReset()
  mockLookup.mockImplementation(async () => [{ address: '93.184.216.34', family: 4 }])
  mocks.getDatabase.mockReturnValue({
    query: { endpoint_rule: { findFirst: mocks.findRule } },
  })
  mocks.getEndpointByToken.mockResolvedValue({ isErr: () => false, value: makeEndpoint() })
  mocks.findRule.mockResolvedValue(undefined)
})

describe('ingestRulesMiddleware', () => {
  it('passes through for paths outside /api/e/:token', async () => {
    const handler = vi.fn((c: Context) => c.text('ok'))
    const app = buildApp(handler)

    const response = await app.request('/api/other')

    expect(response.status).toBe(404)
    expect(mocks.getEndpointByToken).not.toHaveBeenCalled()
  })

  it('passes through when the endpoint lookup fails', async () => {
    mocks.getEndpointByToken.mockResolvedValue({ isErr: () => true })

    const response = await buildApp().request('/api/e/tok123')

    expect(response.status).toBe(200)
    expect(mocks.findRule).not.toHaveBeenCalled()
  })

  it('passes through when the endpoint is not active', async () => {
    mocks.getEndpointByToken.mockResolvedValue({
      isErr: () => false,
      value: makeEndpoint({ status: 'paused' }),
    })

    const response = await buildApp().request('/api/e/tok123')

    expect(response.status).toBe(200)
    expect(mocks.findRule).not.toHaveBeenCalled()
  })

  it('passes through when no rule is configured', async () => {
    mocks.findRule.mockResolvedValue(undefined)

    const response = await buildApp().request('/api/e/tok123')

    expect(response.status).toBe(200)
    expect(await response.text()).toBe('ok')
  })

  it('rejects requests with a missing signature', async () => {
    mocks.findRule.mockResolvedValue(makeRule({
      signatureEnabled: true,
      signatureHeaderName: 'X-Webhook-Signature',
      signatureSecret: SECRET,
    }))
    const handler = vi.fn((c: Context) => c.text('ok'))

    const response = await buildApp(handler).request('/api/e/tok123', {
      body: RAW_BODY,
      headers: { 'content-type': 'application/json' },
      method: 'POST',
    })

    expect(response.status).toBe(401)
    expect(handler).not.toHaveBeenCalled()
  })

  it('rejects requests with a wrong signature', async () => {
    mocks.findRule.mockResolvedValue(makeRule({
      signatureEnabled: true,
      signatureHeaderName: 'X-Webhook-Signature',
      signatureSecret: SECRET,
    }))

    const response = await buildApp().request('/api/e/tok123', {
      body: RAW_BODY,
      headers: {
        'content-type': 'application/json',
        'x-webhook-signature': 'sha256=deadbeef',
      },
      method: 'POST',
    })

    expect(response.status).toBe(401)
  })

  it('accepts a valid sha256= prefixed signature', async () => {
    mocks.findRule.mockResolvedValue(makeRule({
      signatureEnabled: true,
      signatureHeaderName: 'X-Webhook-Signature',
      signatureSecret: SECRET,
    }))

    const response = await buildApp().request('/api/e/tok123', {
      body: RAW_BODY,
      headers: {
        'content-type': 'application/json',
        'x-webhook-signature': `sha256=${signatureFor(RAW_BODY, SECRET)}`,
      },
      method: 'POST',
    })

    expect(response.status).toBe(200)
    expect(await response.text()).toBe('ok')
  })

  it('accepts a valid raw hex signature', async () => {
    mocks.findRule.mockResolvedValue(makeRule({
      signatureEnabled: true,
      signatureHeaderName: 'X-Webhook-Signature',
      signatureSecret: SECRET,
    }))

    const response = await buildApp().request('/api/e/tok123', {
      body: RAW_BODY,
      headers: {
        'content-type': 'application/json',
        'x-webhook-signature': signatureFor(RAW_BODY, SECRET),
      },
      method: 'POST',
    })

    expect(response.status).toBe(200)
  })

  it('applies the custom response when the endpoint returns 200', async () => {
    mocks.findRule.mockResolvedValue(makeRule({
      customContentType: 'application/xml',
      customResponseBody: '<ok/>',
      customResponseEnabled: true,
      customStatusCode: 201,
    }))

    const response = await buildApp().request('/api/e/tok123')

    expect(response.status).toBe(201)
    expect(response.headers.get('content-type')).toContain('application/xml')
    expect(await response.text()).toBe('<ok/>')
  })

  it('does not override non-200 responses', async () => {
    mocks.findRule.mockResolvedValue(makeRule({
      customResponseBody: '<ok/>',
      customResponseEnabled: true,
      customStatusCode: 201,
    }))

    const response = await buildApp(c => c.text('boom', 500)).request('/api/e/tok123')

    expect(response.status).toBe(500)
    expect(await response.text()).toBe('boom')
  })

  it('delays before processing', async () => {
    mocks.findRule.mockResolvedValue(makeRule({ delayEnabled: true, delayMs: 20 }))

    const startedAt = Date.now()
    await buildApp().request('/api/e/tok123')

    expect(Date.now() - startedAt).toBeGreaterThanOrEqual(15)
  })

  it('forwards the captured request with its signature header', async () => {
    mocks.findRule.mockResolvedValue(makeRule({
      forwardEnabled: true,
      forwardTargetUrl: 'https://public.example/hook',
      signatureEnabled: true,
      signatureHeaderName: 'X-Signature',
      signatureSecret: SECRET,
    }))
    mocks.fetch.mockResolvedValue(new Response('{}', { status: 200 }))

    const response = await buildApp().request('/api/e/tok123', {
      body: RAW_BODY,
      headers: {
        'content-type': 'application/json',
        'x-signature': `sha256=${signatureFor(RAW_BODY, SECRET)}`,
      },
      method: 'POST',
    })

    expect(response.status).toBe(200)
    await vi.waitFor(() => expect(mocks.fetch).toHaveBeenCalled())

    const [target, init] = mocks.fetch.mock.calls[0] as [URL, RequestInit]
    expect(target.toString()).toBe('https://public.example/hook')
    expect(init.method).toBe('POST')
    expect(init.body).toBe(RAW_BODY)
    expect((init.headers as Headers).get('content-type')).toBe('application/json')
    expect((init.headers as Headers).get('x-signature')).toBe(
      `sha256=${signatureFor(RAW_BODY, SECRET)}`,
    )
  })

  it('swallows forward failures without failing the ingest', async () => {
    mocks.findRule.mockResolvedValue(makeRule({
      forwardEnabled: true,
      forwardTargetUrl: 'https://public.example/hook',
    }))
    mocks.fetch.mockRejectedValue(new Error('connection refused'))

    const response = await buildApp().request('/api/e/tok123')

    expect(response.status).toBe(200)
    await vi.waitFor(() => expect(mocks.fetch).toHaveBeenCalled())
  })
})

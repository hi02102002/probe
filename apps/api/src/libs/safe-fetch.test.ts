import type { Mock } from 'vitest'
import { lookup } from 'node:dns/promises'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { safeFetch } from './safe-fetch.js'
import { UnsafeTargetError } from './ssrf.js'

vi.mock('node:dns/promises', () => ({
  lookup: vi.fn(),
}))

const mockLookup = lookup as unknown as Mock
const mockFetch = vi.fn<(...args: unknown[]) => Promise<Response>>()

beforeEach(() => {
  vi.unstubAllGlobals()
  vi.stubGlobal('fetch', mockFetch)
  mockFetch.mockReset()
  mockLookup.mockReset()
  mockLookup.mockImplementation(async (hostname: string) => {
    if (hostname === 'private.example') {
      return [{ address: '10.0.0.5', family: 4 }]
    }

    if (hostname.startsWith('public.example') || !hostname.includes('.')) {
      return [{ address: '93.184.216.34', family: 4 }]
    }

    throw new Error(`getaddrinfo ENOTFOUND ${hostname}`)
  })
})

function jsonResponse(status: number, body: string): Response {
  return new Response(body, { status })
}

function redirect(status: number, location: string): Response {
  return new Response(null, { headers: { location }, status })
}

function callInit(callIndex: number): RequestInit {
  const init = mockFetch.mock.calls[callIndex]?.[1] as RequestInit

  if (!init) {
    throw new Error(`fetch was not called ${callIndex + 1} time(s)`)
  }

  return init
}

function callUrl(callIndex: number): string {
  return String(mockFetch.mock.calls[callIndex]?.[0])
}

describe('safeFetch', () => {
  it('returns the response directly when there is no redirect', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse(200, '{"ok":true}'))

    const response = await safeFetch('https://public.example/hook', {
      body: 'hello',
      method: 'POST',
    })

    expect(await response.text()).toBe('{"ok":true}')
    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(callUrl(0)).toBe('https://public.example/hook')
    expect(callInit(0).method).toBe('POST')
    expect(callInit(0).redirect).toBe('manual')
  })

  it('follows a redirect between public hosts', async () => {
    mockFetch
      .mockResolvedValueOnce(redirect(302, 'https://public.example/landing'))
      .mockResolvedValueOnce(jsonResponse(200, 'done'))

    const response = await safeFetch('https://public.example/hook')

    expect(await response.text()).toBe('done')
    expect(mockFetch).toHaveBeenCalledTimes(2)
    expect(callUrl(1)).toBe('https://public.example/landing')
  })

  it('resolves relative redirect locations', async () => {
    mockFetch
      .mockResolvedValueOnce(redirect(302, '/next'))
      .mockResolvedValueOnce(jsonResponse(200, ''))

    await safeFetch('https://public.example/start')

    expect(callUrl(1)).toBe('https://public.example/next')
  })

  it('converts POST to GET on 301/302/303 and drops the body', async () => {
    for (const status of [301, 302, 303]) {
      mockFetch.mockReset()
      mockFetch
        .mockResolvedValueOnce(redirect(status, 'https://public.example/next'))
        .mockResolvedValueOnce(jsonResponse(200, ''))

      await safeFetch('https://public.example/hook', {
        body: 'payload',
        headers: { 'content-type': 'application/json' },
        method: 'POST',
      })

      expect(callInit(1).method).toBe('GET')
      expect(callInit(1).body).toBeUndefined()
      expect((callInit(1).headers as Headers).get('content-type')).toBeNull()
    }
  })

  it('preserves method and body on 307/308', async () => {
    for (const status of [307, 308]) {
      mockFetch.mockReset()
      mockFetch
        .mockResolvedValueOnce(redirect(status, 'https://public.example/next'))
        .mockResolvedValueOnce(jsonResponse(200, ''))

      await safeFetch('https://public.example/hook', {
        body: 'payload',
        method: 'POST',
      })

      expect(callInit(1).method).toBe('POST')
      expect(callInit(1).body).toBe('payload')
    }
  })

  it('rejects a redirect to a private address without fetching it', async () => {
    mockFetch.mockResolvedValueOnce(redirect(302, 'http://private.example/steal'))

    await expect(safeFetch('https://public.example/hook')).rejects.toThrow(UnsafeTargetError)
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('gives up after too many redirects', async () => {
    mockFetch.mockImplementation(async () => redirect(302, 'https://public.example/loop'))

    await expect(safeFetch('https://public.example/hook')).rejects.toThrow(
      'Too many redirects',
    )
    expect(mockFetch).toHaveBeenCalledTimes(6)
  })

  it('returns the redirect response when it has no location header', async () => {
    mockFetch.mockResolvedValueOnce(new Response(null, { status: 302 }))

    const response = await safeFetch('https://public.example/hook')

    expect(response.status).toBe(302)
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('rejects before fetching when the initial URL is unsafe', async () => {
    await expect(safeFetch('http://private.example/hook')).rejects.toThrow(UnsafeTargetError)
    expect(mockFetch).not.toHaveBeenCalled()
  })
})

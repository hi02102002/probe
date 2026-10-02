import type { Mock } from 'vitest'
import { lookup } from 'node:dns/promises'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { assertPublicHttpUrl, UnsafeTargetError } from './ssrf.js'

vi.mock('node:dns/promises', () => ({
  lookup: vi.fn(),
}))

const mockLookup = lookup as unknown as Mock

const DNS_TABLE: Record<string, Array<{ address: string, family: number }>> = {
  'mixed.example': [
    { address: '93.184.216.34', family: 4 },
    { address: '10.0.0.5', family: 4 },
  ],
  'private.example': [{ address: '10.0.0.5', family: 4 }],
  'public.example': [{ address: '93.184.216.34', family: 4 }],
  'mapped-private.example': [{ address: '::ffff:10.0.0.5', family: 6 }],
  'ipv6-ula.example': [{ address: 'fd00::1', family: 6 }],
}

beforeEach(() => {
  mockLookup.mockReset()
  mockLookup.mockImplementation(async (hostname: string) => {
    if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname)) {
      return [{ address: hostname, family: 4 }]
    }

    const records = DNS_TABLE[hostname]

    if (records) {
      return records
    }

    throw new Error(`getaddrinfo ENOTFOUND ${hostname}`)
  })
})

describe('assertPublicHttpUrl', () => {
  it('rejects malformed URLs', async () => {
    await expect(assertPublicHttpUrl('not-a-url')).rejects.toThrow(UnsafeTargetError)
  })

  it('rejects non-http schemes without resolving DNS', async () => {
    await expect(assertPublicHttpUrl('ftp://public.example')).rejects.toThrow(
      'Target URL must use http or https',
    )
    expect(mockLookup).not.toHaveBeenCalled()
  })

  it('rejects localhost without resolving DNS', async () => {
    await expect(assertPublicHttpUrl('http://localhost:8080')).rejects.toThrow(
      'Target host is not allowed',
    )
    expect(mockLookup).not.toHaveBeenCalled()
  })

  it('rejects hosts that cannot be resolved', async () => {
    await expect(assertPublicHttpUrl('http://missing.example/hook')).rejects.toThrow(
      'Target host could not be resolved',
    )
  })

  it('accepts a public hostname', async () => {
    const url = await assertPublicHttpUrl('https://public.example/webhook')

    expect(url.hostname).toBe('public.example')
  })

  it('accepts a public IP literal', async () => {
    await expect(assertPublicHttpUrl('http://8.8.8.8/hook')).resolves.toBeInstanceOf(URL)
  })

  it.each([
    'http://private.example/hook',
    'http://mixed.example/hook',
    'http://10.0.0.5/hook',
    'http://127.0.0.1/hook',
    'http://0.1.2.3/hook',
    'http://100.64.0.1/hook',
    'http://169.254.169.254/latest/meta-data/',
    'http://172.16.0.9/hook',
    'http://192.168.1.10/hook',
    'http://192.0.0.1/hook',
    'http://192.0.2.1/hook',
    'http://198.18.0.1/hook',
    'http://198.51.100.7/hook',
    'http://203.0.113.9/hook',
    'http://224.0.0.1/hook',
    'http://240.0.0.1/hook',
    'http://ipv6-ula.example/hook',
    'http://mapped-private.example/hook',
  ])('rejects private target %s', async (target) => {
    await expect(assertPublicHttpUrl(target)).rejects.toThrow(
      'Target host must resolve to a public address',
    )
  })
})

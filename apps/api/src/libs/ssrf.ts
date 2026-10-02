import { lookup } from 'node:dns/promises'
import { isIP } from 'node:net'

export class UnsafeTargetError extends Error {}

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
])

function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split('.').map(Number)

  if (parts.length !== 4 || parts.some(part => Number.isNaN(part))) {
    return true
  }

  const [first, second, third] = parts

  if (first === undefined || second === undefined || third === undefined) {
    return true
  }

  return first === 0
    || first === 10
    || first === 127
    || (first === 100 && second >= 64 && second <= 127)
    || (first === 169 && second === 254)
    || (first === 172 && second >= 16 && second <= 31)
    || (first === 192 && second === 0 && (third === 0 || third === 2))
    || (first === 192 && second === 168)
    || (first === 198 && (second === 18 || second === 19))
    || (first === 198 && second === 51 && third === 100)
    || (first === 203 && second === 0 && third === 113)
    || first >= 224
}

function isPrivateIPv6(ip: string): boolean {
  const normalized = ip.toLowerCase()

  return normalized === '::'
    || normalized === '::1'
    || normalized.startsWith('fc')
    || normalized.startsWith('fd')
    || normalized.startsWith('fe8')
    || normalized.startsWith('fe9')
    || normalized.startsWith('fea')
    || normalized.startsWith('feb')
    || normalized.startsWith('ff')
}

function isPrivateAddress(ip: string): boolean {
  const version = isIP(ip)

  if (version === 4) {
    return isPrivateIPv4(ip)
  }

  if (version === 6) {
    const mapped = ip.toLowerCase().match(/^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/)

    if (mapped) {
      return isPrivateIPv4(mapped[1]!)
    }

    return isPrivateIPv6(ip)
  }

  return true
}

/**
 * Validates that a target is an http(s) URL whose host resolves
 * exclusively to public addresses, to stop server-side requests to
 * internal networks.
 *
 * Note: there is a residual DNS-rebinding window — the hostname is resolved
 * here and resolved again by fetch. Fully closing it requires pinning the
 * validated address via a custom undici dispatcher. Redirect hops are
 * re-validated by `safeFetch` (see ./safe-fetch.ts).
 */
export async function assertPublicHttpUrl(rawUrl: string): Promise<URL> {
  let url: URL

  try {
    url = new URL(rawUrl)
  }
  catch {
    throw new UnsafeTargetError('Invalid target URL')
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new UnsafeTargetError('Target URL must use http or https')
  }

  const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, '')

  if (BLOCKED_HOSTNAMES.has(hostname)) {
    throw new UnsafeTargetError('Target host is not allowed')
  }

  let addresses: Array<{ address: string }>

  try {
    addresses = await lookup(hostname, { all: true })
  }
  catch {
    throw new UnsafeTargetError('Target host could not be resolved')
  }

  if (addresses.length === 0) {
    throw new UnsafeTargetError('Target host could not be resolved')
  }

  if (addresses.some(address => isPrivateAddress(address.address))) {
    throw new UnsafeTargetError('Target host must resolve to a public address')
  }

  return url
}

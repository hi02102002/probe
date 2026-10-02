import { assertPublicHttpUrl, UnsafeTargetError } from './ssrf.js'

const MAX_REDIRECTS = 5

/**
 * Fetch wrapper that re-validates SSRF rules on every redirect hop. Plain
 * `redirect: 'follow'` would let a public host bounce the request to an
 * internal address that was never validated.
 */
export async function safeFetch(targetUrl: string | URL, init: RequestInit = {}): Promise<Response> {
  let url = await assertPublicHttpUrl(targetUrl.toString())
  let method = (init.method ?? 'GET').toUpperCase()
  let body: BodyInit | null | undefined = init.body
  const headers = new Headers(init.headers)

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const response = await fetch(url, {
      ...init,
      body: method === 'GET' || method === 'HEAD' ? undefined : body,
      headers,
      method,
      redirect: 'manual',
    })

    const location = response.status === 301
      || response.status === 302
      || response.status === 303
      || response.status === 307
      || response.status === 308
      ? response.headers.get('location')
      : null

    if (!location) {
      return response
    }

    void response.body?.cancel().catch(() => undefined)

    if (hop === MAX_REDIRECTS) {
      throw new UnsafeTargetError('Too many redirects')
    }

    url = await assertPublicHttpUrl(new URL(location, url).toString())

    if (response.status === 301 || response.status === 302) {
      if (method === 'POST') {
        method = 'GET'
        body = undefined
        headers.delete('content-type')
      }
    }
    else if (response.status === 303 && method !== 'HEAD') {
      method = 'GET'
      body = undefined
      headers.delete('content-type')
    }
  }

  throw new UnsafeTargetError('Too many redirects')
}

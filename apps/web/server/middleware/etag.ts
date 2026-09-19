import { defineMiddleware } from 'nitro'
import { useRuntimeConfig } from 'nitro/runtime-config'

const PUBLIC_CACHEABLE_PATHS = [
  /^\/$/,
  /^\/(?:privacy|terms)\/?$/,
  /^\/blog(?:\/|$)/,
  /^\/(?:llms(?:-full)?\.txt|sitemap\.xml)$/,
]

function isPublicCacheablePath(pathname: string): boolean {
  return PUBLIC_CACHEABLE_PATHS.some(pattern => pattern.test(pathname))
}

function matchesEtag(ifNoneMatch: string | null, etag: string): boolean {
  if (!ifNoneMatch) {
    return false
  }

  const normalizedEtag = etag.replace(/^W\//, '')

  return ifNoneMatch
    .split(',')
    .map(candidate => candidate.trim())
    .some(candidate => candidate === '*' || candidate.replace(/^W\//, '') === normalizedEtag)
}

export default defineMiddleware((event) => {
  if (!['GET', 'HEAD'].includes(event.req.method) || !isPublicCacheablePath(event.url.pathname)) {
    return
  }

  const config = useRuntimeConfig()
  const buildVersion = (config.app as { buildVersion?: string })?.buildVersion ?? 'latest'
  const etag = `"${buildVersion}"`

  event.res.headers.set('ETag', etag)

  if (matchesEtag(event.req.headers.get('If-None-Match'), etag)) {
    return new Response(null, {
      headers: event.res.headers,
      status: 304,
    })
  }
})

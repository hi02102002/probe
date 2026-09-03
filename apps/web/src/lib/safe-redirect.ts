import { env } from '@/env/client'

export const PLACEHOLDER_ORIGIN = 'https://probe.placeholder'

export function getSafeBaseOrigin(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }
  return PLACEHOLDER_ORIGIN
}

function isAllowedOrigin(origin: string, baseOrigin: string): boolean {
  if (origin === baseOrigin || origin === PLACEHOLDER_ORIGIN) {
    return true
  }

  if (env.VITE_SITE_URL) {
    try {
      if (origin === new URL(env.VITE_SITE_URL).origin) {
        return true
      }
    }
    catch {}
  }

  return false
}

/**
 * Validates and sanitizes a redirect target to ensure it points to a safe
 * same-origin path, preventing open redirect vulnerabilities and redirect loops.
 *
 * Works in both SSR (Node/serverless) and browser (client) environments.
 *
 * @param redirectTo The redirect candidate string (relative path or same-origin URL)
 * @param fallback Fallback relative path (defaults to '/dashboard')
 * @returns A safe relative path with search params and hash (e.g. '/dashboard')
 */
export function getSafeRedirectPath(
  redirectTo: string | undefined,
  fallback = '/dashboard',
): string {
  if (!redirectTo) {
    return fallback
  }

  if (
    redirectTo.startsWith('//')
    || redirectTo.startsWith('/\\')
    || redirectTo.startsWith('\\')
  ) {
    return fallback
  }

  const baseOrigin = getSafeBaseOrigin()

  try {
    const parsed = new URL(redirectTo, baseOrigin)

    if (!isAllowedOrigin(parsed.origin, baseOrigin)) {
      return fallback
    }

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return fallback
    }

    if (
      !parsed.pathname.startsWith('/')
      || parsed.pathname.startsWith('//')
      || parsed.pathname.startsWith('/\\')
      || parsed.pathname === '/login'
    ) {
      return fallback
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`
  }
  catch {
    return fallback
  }
}

/**
 * Returns a full same-origin absolute URL for auth callbacks (magic link, social sign-in).
 * Works in both SSR and client environments.
 */
export function getSafeRedirectUrl(
  redirectTo: string | undefined,
  fallback = '/dashboard',
  origin?: string,
): string {
  const safePath = getSafeRedirectPath(redirectTo, fallback)
  const base = origin ?? getSafeBaseOrigin()

  return new URL(safePath, base).toString()
}


import type {
  GenerateTanStackStartSeoParams,
  TanStackStartSeoSite,
} from './types'
import { resolveHttpUrl } from '@repo/utils'
import { env } from '@/env/client'
import { generateTanStackStartSeo } from './generate-tanstack-start-seo'

const PRODUCTION_SITE_URL = 'https://probe.monobase.io.vn'
const LOCAL_DEV_URL = 'http://localhost:3000'

export function getSiteBaseUrl(): string {
  const configured = env.VITE_SITE_URL
  if (
    configured
    && configured !== LOCAL_DEV_URL
    && configured !== 'http://127.0.0.1:3000'
  ) {
    return resolveHttpUrl(configured, PRODUCTION_SITE_URL)
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }

  if (import.meta.env.PROD) {
    return PRODUCTION_SITE_URL
  }

  return LOCAL_DEV_URL
}

export const seoSite = {
  applicationName: 'Probe',
  baseUrl: getSiteBaseUrl(),
  defaultDescription:
    'Capture, inspect, and debug incoming webhook requests from a clean developer-focused dashboard.',
  defaultImages: [
    {
      alt: 'Probe',
      height: 630,
      type: 'image/png',
      url: '/og-image',
      width: 1200,
    },
  ],
  defaultTitle: 'Probe',
  siteName: 'Probe',
  themeColor: '#07080c',
  titleTemplate: '%s | Probe',
} satisfies TanStackStartSeoSite

export type GenerateAppSeoParams = Omit<
  GenerateTanStackStartSeoParams,
  'site'
>

export function generateAppSeo(options: GenerateAppSeoParams) {
  return generateTanStackStartSeo({
    ...options,
    site: {
      ...seoSite,
      baseUrl: getSiteBaseUrl(),
    },
  })
}

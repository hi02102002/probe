import type {
  GenerateTanStackStartSeoParams,
  TanStackStartSeoSite,
} from './types'
import { resolveHttpUrl } from '@repo/utils'
import { env } from '@/env/client'
import { generateTanStackStartSeo } from './generate-tanstack-start-seo'

const DEFAULT_SITE_URL = 'http://localhost:3000'

export const seoSite = {
  applicationName: 'Probe',
  baseUrl: resolveHttpUrl(env.VITE_SITE_URL, DEFAULT_SITE_URL),
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
  titleTemplate: '%s | Probe',
} satisfies TanStackStartSeoSite

export type GenerateAppSeoParams = Omit<
  GenerateTanStackStartSeoParams,
  'site'
>

export function generateAppSeo(options: GenerateAppSeoParams) {
  return generateTanStackStartSeo({
    ...options,
    site: seoSite,
  })
}

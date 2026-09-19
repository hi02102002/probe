export type TanStackStartSeoMetaTag
  = | { title: string }
    | { charSet: string }
    | { content: string, httpEquiv: string }
    | { content: string, name: string }
    | { content: string, property: string }

export interface TanStackStartSeoLinkTag {
  as?: string
  crossOrigin?: '' | 'anonymous' | 'use-credentials'
  href: string
  hrefLang?: string
  rel: string
  type?: string
}

export interface TanStackStartSeoScriptTag {
  children: string
  type: 'application/ld+json'
}

export interface TanStackStartSeoHead {
  links?: TanStackStartSeoLinkTag[]
  meta?: TanStackStartSeoMetaTag[]
  scripts?: TanStackStartSeoScriptTag[]
}

export interface TanStackStartSeoImage {
  alt?: string
  height?: number
  type?:
    | 'image/apng'
    | 'image/avif'
    | 'image/gif'
    | 'image/jpeg'
    | 'image/png'
    | 'image/svg+xml'
    | 'image/webp'
  url: string
  width?: number
}

export interface TanStackStartSeoRobots {
  follow?: boolean
  index?: boolean
  maxImagePreview?: 'large' | 'none' | 'standard'
  maxSnippet?: number
  maxVideoPreview?: number
  noarchive?: boolean
  noimageindex?: boolean
  nosnippet?: boolean
}

export interface TanStackStartSeoSite {
  applicationName?: string
  baseUrl: string
  defaultDescription?: string
  defaultImages?: TanStackStartSeoImage[]
  defaultTitle: string
  defaultTwitterCard?: 'app' | 'player' | 'summary' | 'summary_large_image'
  siteName?: string
  themeColor?: string
  titleTemplate?: string
  twitterCreator?: string
  twitterSite?: string
}

export interface TanStackStartSeoAlternates {
  baseLocale?: string
  canonicalPath: `/${string}`
  locale?: string
  locales?: readonly string[]
}

export interface GenerateTanStackStartSeoParams {
  alternates?: TanStackStartSeoAlternates
  description?: string
  images?: TanStackStartSeoImage[]
  includeDocumentMeta?: boolean
  openGraphType?: 'article' | 'profile' | 'website'
  pathname?: string
  robots?: TanStackStartSeoRobots
  scripts?: TanStackStartSeoScriptTag[]
  site: TanStackStartSeoSite
  themeColor?: string
  title?: string
}

import type {
  GenerateTanStackStartSeoParams,
  TanStackStartSeoHead,
  TanStackStartSeoLinkTag,
  TanStackStartSeoMetaTag,
  TanStackStartSeoRobots,
} from './types'
import {
  buildOpenGraphImageMeta,
  formatTanStackStartRobotsContent,
  formatTanStackStartTitle,
  generateTanStackStartAlternateLinks,
  isDefined,
  resolveRelativePathToAbsoluteUrl,
} from './utils'

export function generateTanStackStartSeo({
  alternates,
  description,
  images,
  includeDocumentMeta = false,
  openGraphType = 'website',
  pathname = '/',
  robots,
  scripts,
  site,
  themeColor = site.themeColor ?? '#07080c',
  title,
}: GenerateTanStackStartSeoParams): TanStackStartSeoHead {
  const resolvedDescription = description ?? site.defaultDescription
  const resolvedTitle = title ?? site.defaultTitle
  const formattedTitle = formatTanStackStartTitle({
    site,
    title: resolvedTitle,
  })
  const resolvedImages = (images?.length ? images : site.defaultImages)?.map(
    (image) => {
      if (image.url !== '/og-image') {
        return image
      }

      const imageUrl = new URL(image.url, site.baseUrl)
      imageUrl.searchParams.set('title', resolvedTitle)
      const subtitle
        = resolvedTitle === (site.siteName ?? site.applicationName)
          ? 'Developer Tooling'
          : site.siteName ?? site.applicationName ?? 'Developer Tooling'
      imageUrl.searchParams.set('subtitle', subtitle)
      if (resolvedDescription) {
        imageUrl.searchParams.set('description', resolvedDescription)
      }

      return {
        ...image,
        type: 'image/png' as const,
        url: `${imageUrl.pathname}${imageUrl.search}`,
      }
    },
  )

  const normalizedPathname = pathname.startsWith('/') ? pathname : `/${pathname}`
  const defaultCanonicalUrl = resolveRelativePathToAbsoluteUrl(
    alternates?.canonicalPath ?? (normalizedPathname as `/${string}`),
    { baseUrl: site.baseUrl },
  )

  const defaultLinks: TanStackStartSeoLinkTag[] = [
    {
      href: defaultCanonicalUrl,
      rel: 'canonical',
    },
  ]

  const links = alternates
    ? generateTanStackStartAlternateLinks({
        ...alternates,
        baseUrl: site.baseUrl,
      })
    : defaultLinks

  const canonicalUrl = links?.find(link => link.rel === 'canonical')?.href ?? defaultCanonicalUrl
  const robotsConfig: TanStackStartSeoRobots = robots ?? {
    follow: true,
    index: true,
    maxImagePreview: 'large',
    maxSnippet: -1,
    maxVideoPreview: -1,
  }
  const robotsContent = formatTanStackStartRobotsContent(robotsConfig)
  const primaryImage = resolvedImages?.[0]

  const meta: TanStackStartSeoMetaTag[] = [
    includeDocumentMeta
      ? {
          charSet: 'utf-8',
        }
      : undefined,
    includeDocumentMeta
      ? {
          content: 'width=device-width, initial-scale=1',
          name: 'viewport',
        }
      : undefined,
    includeDocumentMeta && site.applicationName
      ? {
          content: site.applicationName,
          name: 'application-name',
        }
      : undefined,
    includeDocumentMeta && themeColor
      ? {
          content: themeColor,
          name: 'theme-color',
        }
      : undefined,
    includeDocumentMeta
      ? {
          content: 'on',
          httpEquiv: 'x-dns-prefetch-control',
        }
      : undefined,
    {
      title: formattedTitle,
    },
    resolvedDescription
      ? {
          content: resolvedDescription,
          name: 'description',
        }
      : undefined,
    {
      content: formattedTitle,
      property: 'og:title',
    },
    resolvedDescription
      ? {
          content: resolvedDescription,
          property: 'og:description',
        }
      : undefined,
    site.siteName
      ? {
          content: site.siteName,
          property: 'og:site_name',
        }
      : undefined,
    alternates?.locale
      ? {
          content: alternates.locale,
          property: 'og:locale',
        }
      : undefined,
    canonicalUrl
      ? {
          content: canonicalUrl,
          property: 'og:url',
        }
      : undefined,
    {
      content: openGraphType,
      property: 'og:type',
    },
    ...buildOpenGraphImageMeta({
      baseUrl: site.baseUrl,
      images: resolvedImages,
    }),
    {
      content: site.defaultTwitterCard ?? 'summary_large_image',
      name: 'twitter:card',
    },
    {
      content: formattedTitle,
      name: 'twitter:title',
    },
    resolvedDescription
      ? {
          content: resolvedDescription,
          name: 'twitter:description',
        }
      : undefined,
    primaryImage
      ? {
          content: resolveRelativePathToAbsoluteUrl(primaryImage.url, {
            baseUrl: site.baseUrl,
          }),
          name: 'twitter:image',
        }
      : undefined,
    primaryImage?.alt
      ? {
          content: primaryImage.alt,
          name: 'twitter:image:alt',
        }
      : undefined,
    site.twitterSite
      ? {
          content: site.twitterSite,
          name: 'twitter:site',
        }
      : undefined,
    site.twitterCreator
      ? {
          content: site.twitterCreator,
          name: 'twitter:creator',
        }
      : undefined,
    robotsContent
      ? {
          content: robotsContent,
          name: 'robots',
        }
      : undefined,
    robotsContent
      ? {
          content: robotsContent,
          name: 'googlebot',
        }
      : undefined,
  ].filter(isDefined)

  return {
    links,
    meta,
    scripts: scripts?.filter(isDefined),
  }
}

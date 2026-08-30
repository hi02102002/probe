import type {
  TanStackStartSeoAlternates,
  TanStackStartSeoLinkTag,
} from '../types'
import { getLocalizedCanonicalPath } from './get-localized-canonical-path'
import { resolveRelativePathToAbsoluteUrl } from './resolve-relative-path-to-absolute-url'

export function generateTanStackStartAlternateLinks({
  baseLocale,
  baseUrl,
  canonicalPath,
  locale,
  locales,
}: TanStackStartSeoAlternates & {
  baseUrl: string
}): TanStackStartSeoLinkTag[] {
  const links: TanStackStartSeoLinkTag[] = [
    {
      href: resolveRelativePathToAbsoluteUrl(
        getLocalizedCanonicalPath({ baseLocale, canonicalPath, locale }),
        { baseUrl },
      ),
      rel: 'canonical',
    },
  ]

  if (!locales?.length) {
    return links
  }

  for (const currentLocale of locales) {
    links.push({
      href: resolveRelativePathToAbsoluteUrl(
        getLocalizedCanonicalPath({
          baseLocale,
          canonicalPath,
          locale: currentLocale,
        }),
        { baseUrl },
      ),
      hrefLang: currentLocale,
      rel: 'alternate',
    })
  }

  if (baseLocale) {
    links.push({
      href: resolveRelativePathToAbsoluteUrl(
        getLocalizedCanonicalPath({
          baseLocale,
          canonicalPath,
          locale: baseLocale,
        }),
        { baseUrl },
      ),
      hrefLang: 'x-default',
      rel: 'alternate',
    })
  }

  return links
}

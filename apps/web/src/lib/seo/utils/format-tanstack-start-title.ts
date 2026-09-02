import type { TanStackStartSeoSite } from '../types'

export function formatTanStackStartTitle({
  site,
  title,
}: {
  site: TanStackStartSeoSite
  title: string
}): string {
  if (
    !site.titleTemplate
    || title === site.defaultTitle
    || title === site.siteName
    || title === site.applicationName
  ) {
    return title
  }

  return site.titleTemplate.includes('%s')
    ? site.titleTemplate.replace('%s', title)
    : `${title} ${site.titleTemplate}`
}

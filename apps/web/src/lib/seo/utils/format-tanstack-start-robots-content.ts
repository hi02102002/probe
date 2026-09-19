import type { TanStackStartSeoRobots } from '../types'
import { isDefined } from './is-defined'

export function formatTanStackStartRobotsContent({
  follow = true,
  index = true,
  maxImagePreview,
  maxSnippet,
  maxVideoPreview,
  noarchive = false,
  noimageindex = false,
  nosnippet = false,
}: TanStackStartSeoRobots): string {
  return [
    index ? 'index' : 'noindex',
    follow ? 'follow' : 'nofollow',
    noarchive ? 'noarchive' : undefined,
    noimageindex ? 'noimageindex' : undefined,
    nosnippet ? 'nosnippet' : undefined,
    maxImagePreview ? `max-image-preview:${maxImagePreview}` : undefined,
    maxSnippet !== undefined ? `max-snippet:${maxSnippet}` : undefined,
    maxVideoPreview !== undefined ? `max-video-preview:${maxVideoPreview}` : undefined,
  ]
    .filter(isDefined)
    .join(', ')
}

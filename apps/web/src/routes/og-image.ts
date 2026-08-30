import { createFileRoute } from '@tanstack/react-router'

const DEFAULT_TITLE = 'Probe'
const DEFAULT_SUBTITLE = 'Developer Tooling'
const DEFAULT_DESCRIPTION = 'Capture, inspect, and debug incoming webhook requests.'

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll('\'', '&apos;')
}

function wrapText(value: string, maxCharacters: number): string[] {
  const words = value.trim().split(/\s+/)
  const lines: string[] = []
  let line = ''

  for (const word of words) {
    const nextLine = line ? `${line} ${word}` : word
    if (nextLine.length > maxCharacters && line) {
      lines.push(line)
      line = word
    }
    else {
      line = nextLine
    }
  }

  if (line) {
    lines.push(line)
  }

  return lines.length ? lines : ['']
}

function renderTextLines({
  lineHeight,
  lines,
  x,
}: {
  lineHeight: number
  lines: string[]
  x: number
}): string {
  return lines
    .map(
      (line, index) =>
        `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`,
    )
    .join('')
}

function renderOgImage({
  description,
  subtitle,
  title,
}: {
  description: string
  subtitle: string
  title: string
}): string {
  const titleLines = wrapText(title, 23)
  const descriptionLines = wrapText(description, 76).slice(0, 3)
  const titleY = 190
  const titleLineHeight = 86
  const highlightY = titleY + (titleLines.length - 1) * titleLineHeight + 42
  const descriptionY = highlightY + 132

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-labelledby="title description">
  <title id="title">${escapeXml(title)}</title>
  <desc id="description">${escapeXml(description)}</desc>
  <defs>
    <radialGradient id="glow" cx="100%" cy="0%" r="100%">
      <stop offset="0%" stop-color="#b7ff3c" stop-opacity=".16" />
      <stop offset="55%" stop-color="#0b0d0e" stop-opacity="0" />
    </radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#fff" stroke-opacity=".05" />
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="#0b0d0e" />
  <rect width="1200" height="630" fill="url(#glow)" />
  <rect width="1200" height="630" fill="url(#grid)" />
  <circle cx="1040" cy="-20" r="330" fill="none" stroke="#b7ff3c" stroke-opacity=".18" stroke-width="2" />
  <circle cx="1040" cy="-20" r="250" fill="none" stroke="#b7ff3c" stroke-opacity=".12" stroke-width="2" />
  <circle cx="1040" cy="-20" r="170" fill="none" stroke="#b7ff3c" stroke-opacity=".08" stroke-width="2" />
  <g font-family="Inter, Arial, sans-serif">
    <text x="88" y="112" fill="#b7ff3c" font-size="24" font-weight="600" letter-spacing="3">${escapeXml(subtitle.toUpperCase())}</text>
    <text x="88" y="${titleY}" fill="#f5f7f2" font-size="84" font-weight="600" letter-spacing="-3">${renderTextLines({ lineHeight: titleLineHeight, lines: titleLines, x: 88 })}</text>
    <rect x="88" y="${highlightY}" width="540" height="78" rx="8" fill="#b7ff3c" />
    <text x="116" y="${highlightY + 56}" fill="#17200d" font-size="54" font-weight="600" letter-spacing="-2">inspect webhooks</text>
    <text x="88" y="${descriptionY}" fill="#a3aaa0" font-size="28">${renderTextLines({ lineHeight: 36, lines: descriptionLines, x: 88 })}</text>
    <text x="88" y="548" fill="#6f786e" font-size="22" letter-spacing="2">WEBHOOK DEBUGGER</text>
    <text x="88" y="548" fill="#6f786e" font-size="22" letter-spacing="2">PROBE</text>
  </g>
</svg>`
}

export const Route = createFileRoute('/og-image')({
  server: {
    handlers: {
      GET: ({ request }) => {
        const searchParams = new URL(request.url).searchParams
        const title = searchParams.get('title')?.trim() || DEFAULT_TITLE
        const subtitle = searchParams.get('subtitle')?.trim() || DEFAULT_SUBTITLE
        const description
          = searchParams.get('description')?.trim() || DEFAULT_DESCRIPTION

        return new Response(
          renderOgImage({ description, subtitle, title }),
          {
            headers: {
              'Cache-Control': 'public, max-age=3600, s-maxage=86400',
              'Content-Type': 'image/svg+xml; charset=utf-8',
            },
          },
        )
      },
    },
  },
})

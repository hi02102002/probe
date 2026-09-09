import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { PROBE_LOGO_BASE64 } from '@/assets/logo-base64'

const DEFAULT_TITLE = 'Probe'
const DEFAULT_SUBTITLE = 'Developer Tooling'
const DEFAULT_DESCRIPTION
  = 'Capture, inspect, and debug incoming webhook requests in real time.'

function findFontPath(filename: string): string | undefined {
  const candidateDirs = [
    path.resolve(process.cwd(), 'public/fonts'),
    path.resolve(process.cwd(), 'apps/web/public/fonts'),
    path.resolve(process.cwd(), '.output/public/fonts'),
    path.resolve(process.cwd(), 'assets/fonts'),
    path.resolve(process.cwd(), 'apps/web/assets/fonts'),
    path.resolve(process.cwd(), 'fonts'),
    '/app/public/fonts',
    '/app/fonts',
  ]

  for (const dir of candidateDirs) {
    const fullPath = path.join(dir, filename)
    if (fs.existsSync(fullPath)) {
      return fullPath
    }
  }

  return undefined
}

function getOgFontFiles(): string[] {
  const inter = findFontPath('inter.ttf')
  const geistMono = findFontPath('geist-mono.ttf')

  return [inter, geistMono].filter((p): p is string => Boolean(p))
}

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
  const isDefaultTitle = title === 'Probe' || !title
  const displayTitle = isDefaultTitle
    ? 'Webhook Debugging Without the Guesswork'
    : title
  const titleLines = wrapText(displayTitle, 22).slice(0, 3)
  const descriptionLines = wrapText(description, 36).slice(0, 3)

  const titleLineHeight = titleLines.length > 2 ? 46 : 54
  const titleFontSize
    = titleLines.length > 2 ? 40 : titleLines.length === 2 ? 46 : 52
  const titleY = 190
  const descriptionY = titleY + titleLines.length * titleLineHeight + 16

  const badgeText
    = !subtitle || subtitle.toLowerCase() === 'probe'
      ? 'DEVELOPER TOOLING'
      : subtitle.toUpperCase()
  const badgeWidth = Math.max(90, Math.round(badgeText.length * 8.2 + 42))

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-labelledby="title description">
  <title id="title">${escapeXml(title)}</title>
  <desc id="description">${escapeXml(description)}</desc>
  <defs>
    <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00a6ff" />
      <stop offset="35%" stop-color="#3b82f6" />
      <stop offset="70%" stop-color="#8b5cf6" />
      <stop offset="100%" stop-color="#d946ef" />
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#141724" />
      <stop offset="100%" stop-color="#0b0d14" />
    </linearGradient>
    <linearGradient id="codeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#090a10" />
      <stop offset="100%" stop-color="#06070a" />
    </linearGradient>
    <radialGradient id="glowTopRight" cx="90%" cy="10%" r="70%">
      <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.22" />
      <stop offset="50%" stop-color="#3b82f6" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#07080c" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="glowBottomLeft" cx="10%" cy="90%" r="60%">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.16" />
      <stop offset="50%" stop-color="#3b82f6" stop-opacity="0.05" />
      <stop offset="100%" stop-color="#07080c" stop-opacity="0" />
    </radialGradient>
    <pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse">
      <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#ffffff" stroke-opacity="0.03" stroke-width="1" />
    </pattern>
    <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.6" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="#07080c" />
  <rect width="1200" height="630" fill="url(#glowTopRight)" />
  <rect width="1200" height="630" fill="url(#glowBottomLeft)" />
  <rect width="1200" height="630" fill="url(#grid)" />
  <rect x="1" y="1" width="1198" height="628" fill="none" stroke="#ffffff" stroke-opacity="0.08" stroke-width="2" />

  <!-- Background Decorative Rings -->
  <circle cx="1080" cy="40" r="280" fill="none" stroke="url(#brandGrad)" stroke-opacity="0.12" stroke-width="1.5" stroke-dasharray="6 6" />
  <circle cx="1080" cy="40" r="200" fill="none" stroke="#6366f1" stroke-opacity="0.08" stroke-width="1" />

  <!-- LEFT COLUMN -->
  <!-- Brand Logo & Pill -->
  <g transform="translate(80, 68)">
    <image href="${PROBE_LOGO_BASE64}" xlink:href="${PROBE_LOGO_BASE64}" x="0" y="-4" width="40" height="40" />
    <text x="52" y="26" fill="#f8fafc" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="700" letter-spacing="-0.5">Probe</text>

    <!-- Subtitle / Platform Badge -->
    <g transform="translate(162, 0)">
      <rect width="${badgeWidth}" height="34" rx="17" fill="#6366f1" fill-opacity="0.1" stroke="#6366f1" stroke-opacity="0.3" stroke-width="1" />
      <circle cx="18" cy="17" r="4" fill="#10b981" />
      <text x="30" y="21.5" fill="#a5b4fc" font-family="'Geist Mono', ui-monospace, SFMono-Regular, monospace" font-size="11" font-weight="600" letter-spacing="1.2">${escapeXml(badgeText)}</text>
    </g>
  </g>

  <!-- Main Title -->
  <g font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
    <text x="80" y="${titleY}" fill="#ffffff" font-size="${titleFontSize}" font-weight="700" letter-spacing="-1.5">
      ${renderTextLines({ lineHeight: titleLineHeight, lines: titleLines, x: 80 })}
    </text>

    <!-- Description -->
    <text x="80" y="${descriptionY}" fill="#94a3b8" font-size="20" font-weight="400">
      ${renderTextLines({ lineHeight: 30, lines: descriptionLines, x: 80 })}
    </text>
  </g>

  <!-- Left Bottom Features / Footer -->
  <g transform="translate(80, 520)">
    <g font-family="'Geist Mono', ui-monospace, SFMono-Regular, monospace" font-size="12" font-weight="500">
      <g transform="translate(0, 0)">
        <rect width="130" height="28" rx="6" fill="#ffffff" fill-opacity="0.04" stroke="#ffffff" stroke-opacity="0.08" />
        <circle cx="12" cy="14" r="3" fill="#38bdf8" />
        <text x="22" y="18" fill="#cbd5e1">Live Inspect</text>
      </g>
      <g transform="translate(142, 0)">
        <rect width="126" height="28" rx="6" fill="#ffffff" fill-opacity="0.04" stroke="#ffffff" stroke-opacity="0.08" />
        <circle cx="12" cy="14" r="3" fill="#818cf8" />
        <text x="22" y="18" fill="#cbd5e1">Auto Replay</text>
      </g>
      <g transform="translate(280, 0)">
        <rect width="136" height="28" rx="6" fill="#ffffff" fill-opacity="0.04" stroke="#ffffff" stroke-opacity="0.08" />
        <circle cx="12" cy="14" r="3" fill="#c084fc" />
        <text x="22" y="18" fill="#cbd5e1">TLS 1.3 Tunnel</text>
      </g>
    </g>
    <text x="0" y="52" fill="#64748b" font-family="'Geist Mono', ui-monospace, SFMono-Regular, monospace" font-size="13" letter-spacing="0.5">https://probe.monobase.io.vn</text>
  </g>

  <!-- RIGHT COLUMN: Webhook Inspector Mockup Card -->
  <g transform="translate(630, 68)" filter="url(#cardShadow)">
    <!-- Card Frame -->
    <rect width="490" height="494" rx="16" fill="url(#cardGrad)" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1.5" />

    <!-- Card Header / Titlebar -->
    <g transform="translate(0, 0)">
      <path d="M 0 16 Q 0 0 16 0 L 474 0 Q 490 0 490 16 L 490 46 L 0 46 Z" fill="#ffffff" fill-opacity="0.02" />
      <line x1="0" y1="46" x2="490" y2="46" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1" />

      <!-- Window Dots -->
      <circle cx="24" cy="23" r="5" fill="#ef4444" opacity="0.8" />
      <circle cx="40" cy="23" r="5" fill="#eab308" opacity="0.8" />
      <circle cx="56" cy="23" r="5" fill="#22c55e" opacity="0.8" />

      <!-- Endpoint URL -->
      <text x="80" y="27" fill="#94a3b8" font-family="'Geist Mono', ui-monospace, SFMono-Regular, monospace" font-size="12">/hooks/ep_checkout_live</text>

      <!-- Live Indicator -->
      <g transform="translate(420, 15)">
        <circle cx="4" cy="8" r="3.5" fill="#10b981" />
        <text x="14" y="11" fill="#34d399" font-family="'Geist Mono', ui-monospace, SFMono-Regular, monospace" font-size="10" font-weight="600">LIVE</text>
      </g>
    </g>

    <!-- Request Row -->
    <g transform="translate(20, 64)">
      <!-- Method Badge -->
      <rect width="48" height="22" rx="4" fill="#6366f1" />
      <text x="24" y="15" fill="#ffffff" font-family="'Geist Mono', ui-monospace, SFMono-Regular, monospace" font-size="11" font-weight="700" text-anchor="middle">POST</text>

      <!-- Event Name -->
      <text x="60" y="16" fill="#f1f5f9" font-family="'Geist Mono', ui-monospace, SFMono-Regular, monospace" font-size="13" font-weight="600">checkout.session.completed</text>

      <!-- Status Code Badge -->
      <g transform="translate(380, 0)">
        <rect width="70" height="22" rx="4" fill="#10b981" fill-opacity="0.15" stroke="#10b981" stroke-opacity="0.3" />
        <text x="35" y="15" fill="#34d399" font-family="'Geist Mono', ui-monospace, SFMono-Regular, monospace" font-size="11" font-weight="600" text-anchor="middle">200 OK</text>
      </g>
    </g>

    <!-- JSON Payload Container -->
    <g transform="translate(20, 102)">
      <rect width="450" height="280" rx="10" fill="url(#codeGrad)" stroke="#ffffff" stroke-opacity="0.06" stroke-width="1" />

      <!-- Syntax Highlighted JSON Content -->
      <g transform="translate(20, 26)" font-family="'Geist Mono', ui-monospace, SFMono-Regular, monospace" font-size="12">
        <text y="0" fill="#64748b">{</text>
        <text y="24">
          <tspan x="14" fill="#38bdf8">&quot;id&quot;</tspan><tspan fill="#64748b">: </tspan><tspan fill="#a7f3d0">&quot;evt_3O9xL2eZvKYlo2&quot;</tspan><tspan fill="#64748b">,</tspan>
        </text>
        <text y="48">
          <tspan x="14" fill="#38bdf8">&quot;type&quot;</tspan><tspan fill="#64748b">: </tspan><tspan fill="#a7f3d0">&quot;checkout.completed&quot;</tspan><tspan fill="#64748b">,</tspan>
        </text>
        <text y="72">
          <tspan x="14" fill="#38bdf8">&quot;customer&quot;</tspan><tspan fill="#64748b">: </tspan><tspan fill="#a7f3d0">&quot;cus_Qx81Nmp92L&quot;</tspan><tspan fill="#64748b">,</tspan>
        </text>
        <text y="96">
          <tspan x="14" fill="#38bdf8">&quot;amount_total&quot;</tspan><tspan fill="#64748b">: </tspan><tspan fill="#c084fc">14900</tspan><tspan fill="#64748b">,</tspan>
        </text>
        <text y="120">
          <tspan x="14" fill="#38bdf8">&quot;currency&quot;</tspan><tspan fill="#64748b">: </tspan><tspan fill="#a7f3d0">&quot;usd&quot;</tspan><tspan fill="#64748b">,</tspan>
        </text>
        <text y="144">
          <tspan x="14" fill="#38bdf8">&quot;payment_status&quot;</tspan><tspan fill="#64748b">: </tspan><tspan fill="#4ade80">&quot;paid&quot;</tspan><tspan fill="#64748b">,</tspan>
        </text>
        <text y="168">
          <tspan x="14" fill="#38bdf8">&quot;livemode&quot;</tspan><tspan fill="#64748b">: </tspan><tspan fill="#fbbf24">true</tspan><tspan fill="#64748b">,</tspan>
        </text>
        <text y="192">
          <tspan x="14" fill="#38bdf8">&quot;signature&quot;</tspan><tspan fill="#64748b">: </tspan><tspan fill="#818cf8">&quot;t=1788,v1=9f3...&quot;</tspan>
        </text>
        <text y="216" fill="#64748b">}</text>
      </g>
    </g>

    <!-- Card Metadata Footer -->
    <g transform="translate(20, 400)">
      <line x1="0" y1="0" x2="450" y2="0" stroke="#ffffff" stroke-opacity="0.06" stroke-width="1" />
      <g transform="translate(0, 20)" font-family="'Geist Mono', ui-monospace, SFMono-Regular, monospace" font-size="11" fill="#64748b">
        <text x="4" y="0">IP: 54.187.205.79</text>
        <text x="170" y="0">Latency: 1.2ms</text>
        <text x="310" y="0" fill="#34d399">✓ Verified Signature</text>
      </g>
      <g transform="translate(0, 44)" font-family="'Geist Mono', ui-monospace, SFMono-Regular, monospace" font-size="10" fill="#475569">
        <text x="4" y="0">TLS 1.3 • AES-256 • Ephemeral Retention</text>
      </g>
    </g>
  </g>
</svg>`
}

export const ogImageSearchSchema = z.object({
  description: z.string().optional(),
  subtitle: z.string().optional(),
  title: z.string().optional(),
})

export type OgImageSearchParams = z.infer<typeof ogImageSearchSchema>

export const Route = createFileRoute('/og-image')({
  component: OgImagePage,
  server: {
    handlers: {
      GET: async ({ request }) => {
        const searchParams = new URL(request.url).searchParams
        const title = searchParams.get('title')?.trim() || DEFAULT_TITLE
        const subtitle
          = searchParams.get('subtitle')?.trim() || DEFAULT_SUBTITLE
        const description
          = searchParams.get('description')?.trim() || DEFAULT_DESCRIPTION

        const svg = renderOgImage({ description, subtitle, title })
        const fontFiles = getOgFontFiles()

        const { Resvg } = await import('@resvg/resvg-js')
        const resvg = new Resvg(svg, {
          fitTo: { mode: 'width', value: 1200 },
          font: {
            defaultFontFamily: 'Inter',
            fontFiles: fontFiles.length > 0 ? fontFiles : undefined,
            loadSystemFonts: false,
            monospaceFamily: 'Geist Mono',
            sansSerifFamily: 'Inter',
          },
        })
        const pngBuffer = resvg.render().asPng()

        return new Response(new Uint8Array(pngBuffer), {
          headers: {
            'Cache-Control': 'public, max-age=3600, s-maxage=86400',
            'Content-Type': 'image/png',
          },
        })
      },
    },
  },
  validateSearch: ogImageSearchSchema,
})

function OgImagePage() {
  const { description, subtitle, title } = Route.useSearch()
  const svg = renderOgImage({
    description: description || DEFAULT_DESCRIPTION,
    subtitle: subtitle || DEFAULT_SUBTITLE,
    title: title || DEFAULT_TITLE,
  })

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <img
        alt="Open Graph Preview"
        className="max-h-[90vh] max-w-full rounded-xl shadow-2xl"
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`}
      />
    </div>
  )
}

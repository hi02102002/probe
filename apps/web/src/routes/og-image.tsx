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

function renderOgImage({
  description,
  subtitle,
  title,
}: {
  description: string
  subtitle: string
  title: string
}): string {
  const isDefaultTitle = !title || title === 'Probe'
  const isDefaultSubtitle
    = !subtitle
      || subtitle.toLowerCase() === 'probe'
      || subtitle.toLowerCase() === 'developer tooling'

  const pillText = isDefaultSubtitle ? 'probe.monobase.io.vn' : subtitle
  const pillWidth = Math.max(140, Math.round(pillText.length * 7.4 + 36))

  const titleLines = isDefaultTitle
    ? ['Receive webhooks.', 'Inspect every detail.']
    : wrapText(title, 22).slice(0, 2)

  const titleLine1 = titleLines[0] || 'Receive webhooks.'
  const titleLine2 = titleLines[1] || ''

  const descLines = wrapText(
    description || DEFAULT_DESCRIPTION,
    46,
  ).slice(0, 3)

  const descY = titleLine2 ? 232 : 188
  const descLineHeight = 26
  const descFontSize = 17

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-labelledby="title description">
  <title id="title">${escapeXml(title || DEFAULT_TITLE)}</title>
  <desc id="description">${escapeXml(description || DEFAULT_DESCRIPTION)}</desc>
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0b10" />
      <stop offset="50%" stop-color="#08090d" />
      <stop offset="100%" stop-color="#06070a" />
    </linearGradient>

    <!-- Top Spotlight -->
    <linearGradient id="topSpotlight" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.09" />
      <stop offset="60%" stop-color="#6366f1" stop-opacity="0.02" />
      <stop offset="100%" stop-color="#08090d" stop-opacity="0" />
    </linearGradient>

    <!-- Card Background Gradient (Smooth, No Banding) -->
    <linearGradient id="cardBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#13151f" />
      <stop offset="100%" stop-color="#0c0d13" />
    </linearGradient>

    <!-- Code Block Background -->
    <linearGradient id="codeBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#07080b" />
      <stop offset="100%" stop-color="#050508" />
    </linearGradient>

    <!-- Drop Shadow Filter for Dashboard Card -->
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="14" stdDeviation="24" flood-color="#000000" flood-opacity="0.7" />
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="1200" height="630" fill="url(#bgGrad)" />
  <rect width="1200" height="360" fill="url(#topSpotlight)" />

  <!-- Outer Frame -->
  <rect x="18" y="18" width="1164" height="594" rx="12" fill="none" stroke="#ffffff" stroke-opacity="0.06" stroke-width="1" />

  <!-- LEFT COLUMN: Brand, Value Prop & cURL -->
  <g transform="translate(64, 60)">
    <!-- Brand Header -->
    <g transform="translate(0, 0)">
      <image href="${PROBE_LOGO_BASE64}" xlink:href="${PROBE_LOGO_BASE64}" x="0" y="-4" width="44" height="44" />
      <text x="54" y="28" fill="#ffffff" font-family="Inter, sans-serif" font-size="28" font-weight="700" letter-spacing="-0.6">Probe</text>

      <!-- Domain / Subtitle Chip -->
      <g transform="translate(152, 5)">
        <rect width="${pillWidth}" height="28" rx="6" fill="#ffffff" fill-opacity="0.04" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1" />
        <circle cx="14" cy="14" r="3" fill="#10b981" />
        <text x="24" y="18" fill="#94a3b8" font-family="'Geist Mono', monospace" font-size="11" font-weight="500" letter-spacing="0.3">${escapeXml(pillText)}</text>
      </g>
    </g>

    <!-- Main Headline -->
    <g transform="translate(0, 94)" font-family="Inter, sans-serif">
      <text x="0" y="0" fill="#ffffff" font-size="42" font-weight="700" letter-spacing="-1.6">${escapeXml(titleLine1)}</text>
      ${titleLine2 ? `<text x="0" y="52" fill="#94a3b8" font-size="42" font-weight="700" letter-spacing="-1.6">${escapeXml(titleLine2)}</text>` : ''}
    </g>

    <!-- Description -->
    <g transform="translate(0, ${descY})" font-family="Inter, sans-serif" font-size="${descFontSize}" fill="#64748b">
      ${descLines.map((line, idx) => `<text x="0" y="${idx * descLineHeight}">${escapeXml(line)}</text>`).join('\n      ')}
    </g>

    <!-- Capability Tags -->
    <g transform="translate(0, 350)" font-family="'Geist Mono', monospace" font-size="11" font-weight="500">
      <!-- Live Stream -->
      <g transform="translate(0, 0)">
        <rect width="152" height="30" rx="6" fill="#ffffff" fill-opacity="0.04" stroke="#ffffff" stroke-opacity="0.07" stroke-width="1" />
        <circle cx="12" cy="15" r="3" fill="#10b981" />
        <text x="22" y="19" fill="#cbd5e1">Live SSE Stream</text>
      </g>
      <!-- Header Verification -->
      <g transform="translate(160, 0)">
        <rect width="158" height="30" rx="6" fill="#ffffff" fill-opacity="0.04" stroke="#ffffff" stroke-opacity="0.07" stroke-width="1" />
        <text x="14" y="19" fill="#cbd5e1">Header Verification</text>
      </g>
      <!-- Payload Replay -->
      <g transform="translate(326, 0)">
        <rect width="132" height="30" rx="6" fill="#ffffff" fill-opacity="0.04" stroke="#ffffff" stroke-opacity="0.07" stroke-width="1" />
        <text x="14" y="19" fill="#cbd5e1">Webhook Replay</text>
      </g>
    </g>

    <!-- Realistic Ingest Command Snippet -->
    <g transform="translate(0, 416)">
      <rect width="458" height="66" rx="8" fill="#050608" stroke="#ffffff" stroke-opacity="0.06" stroke-width="1" />
      <text x="16" y="26" fill="#475569" font-family="'Geist Mono', monospace" font-size="11">$ <tspan fill="#94a3b8">curl -X POST</tspan> &quot;https://probe.monobase.io.vn/api/e/live&quot; \\</text>
      <text x="28" y="48" fill="#475569" font-family="'Geist Mono', monospace" font-size="11">  -H &quot;Content-Type: application/json&quot; -d &#39;{&quot;event&quot;:&quot;ping&quot;}&#39;</text>
    </g>
  </g>

  <!-- RIGHT COLUMN: Dashboard Preview -->
  <g transform="translate(568, 48)" filter="url(#cardShadow)">
    <!-- Card Frame -->
    <rect width="568" height="534" rx="12" fill="url(#cardBg)" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1" />

    <!-- Top Bar: Endpoint & Status -->
    <g transform="translate(0, 0)">
      <line x1="0" y1="46" x2="568" y2="46" stroke="#ffffff" stroke-opacity="0.06" stroke-width="1" />

      <g transform="translate(18, 16)">
        <circle cx="5" cy="8" r="3.5" fill="#10b981" />
        <text x="16" y="11" fill="#10b981" font-family="'Geist Mono', monospace" font-size="11" font-weight="600">CONNECTED</text>
        <text x="104" y="11" fill="#64748b" font-family="'Geist Mono', monospace" font-size="11">/api/e/ept_stripe_live</text>
      </g>

      <g transform="translate(444, 12)">
        <rect width="106" height="22" rx="4" fill="#ffffff" fill-opacity="0.05" stroke="#ffffff" stroke-opacity="0.08" />
        <text x="10" y="15" fill="#94a3b8" font-family="'Geist Mono', monospace" font-size="10">Copy Ingest URL</text>
      </g>
    </g>

    <!-- Request Feed List -->
    <g transform="translate(16, 58)">
      <text x="2" y="12" fill="#475569" font-family="'Geist Mono', monospace" font-size="10" font-weight="600" letter-spacing="0.8">RECENT CAPTURED WEBHOOKS</text>

      <!-- Row 1 (Selected Item) -->
      <g transform="translate(0, 20)">
        <rect width="536" height="36" rx="6" fill="#ffffff" fill-opacity="0.06" stroke="#6366f1" stroke-opacity="0.35" stroke-width="1" />
        <rect x="8" y="7" width="44" height="22" rx="4" fill="#4f46e5" />
        <text x="30" y="22" fill="#ffffff" font-family="'Geist Mono', monospace" font-size="11" font-weight="700" text-anchor="middle">POST</text>
        <text x="60" y="22" fill="#f8fafc" font-family="'Geist Mono', monospace" font-size="12" font-weight="600">checkout.session.completed</text>
        
        <rect x="396" y="8" width="58" height="20" rx="4" fill="#10b981" fill-opacity="0.14" stroke="#10b981" stroke-opacity="0.2" />
        <text x="425" y="22" fill="#34d399" font-family="'Geist Mono', monospace" font-size="10" font-weight="600" text-anchor="middle">200 OK</text>
        
        <text x="468" y="22" fill="#64748b" font-family="'Geist Mono', monospace" font-size="11">just now</text>
      </g>

      <!-- Row 2 -->
      <g transform="translate(0, 62)">
        <rect width="536" height="32" rx="6" fill="#07080c" fill-opacity="0.5" stroke="#ffffff" stroke-opacity="0.03" stroke-width="1" />
        <rect x="8" y="5" width="44" height="22" rx="4" fill="#27272a" />
        <text x="30" y="20" fill="#a1a1aa" font-family="'Geist Mono', monospace" font-size="11" font-weight="700" text-anchor="middle">POST</text>
        <text x="60" y="20" fill="#cbd5e1" font-family="'Geist Mono', monospace" font-size="12">payment_intent.succeeded</text>
        
        <rect x="396" y="6" width="58" height="20" rx="4" fill="#10b981" fill-opacity="0.10" />
        <text x="425" y="20" fill="#34d399" font-family="'Geist Mono', monospace" font-size="10" font-weight="600" text-anchor="middle">200 OK</text>
        
        <text x="468" y="20" fill="#64748b" font-family="'Geist Mono', monospace" font-size="11">14s ago</text>
      </g>

      <!-- Row 3 -->
      <g transform="translate(0, 99)">
        <rect width="536" height="32" rx="6" fill="#07080c" fill-opacity="0.5" stroke="#ffffff" stroke-opacity="0.03" stroke-width="1" />
        <rect x="8" y="5" width="44" height="22" rx="4" fill="#27272a" />
        <text x="30" y="20" fill="#a1a1aa" font-family="'Geist Mono', monospace" font-size="11" font-weight="700" text-anchor="middle">POST</text>
        <text x="60" y="20" fill="#cbd5e1" font-family="'Geist Mono', monospace" font-size="12">customer.subscription.created</text>
        
        <rect x="396" y="6" width="58" height="20" rx="4" fill="#10b981" fill-opacity="0.10" />
        <text x="425" y="20" fill="#34d399" font-family="'Geist Mono', monospace" font-size="10" font-weight="600" text-anchor="middle">200 OK</text>
        
        <text x="468" y="20" fill="#64748b" font-family="'Geist Mono', monospace" font-size="11">1m ago</text>
      </g>
    </g>

    <!-- Request Inspector Panel -->
    <g transform="translate(16, 202)">
      <!-- Tabs Bar -->
      <g transform="translate(0, 0)">
        <rect width="536" height="30" rx="6" fill="#08090d" stroke="#ffffff" stroke-opacity="0.04" />
        <!-- Body Tab (Active) -->
        <rect x="3" y="3" width="68" height="24" rx="4" fill="#ffffff" fill-opacity="0.08" />
        <text x="16" y="19" fill="#ffffff" font-family="'Geist Mono', monospace" font-size="11" font-weight="600">Payload</text>
        <!-- Headers Tab -->
        <text x="86" y="19" fill="#64748b" font-family="'Geist Mono', monospace" font-size="11">Headers (7)</text>
        <!-- Query Tab -->
        <text x="180" y="19" fill="#64748b" font-family="'Geist Mono', monospace" font-size="11">Query (0)</text>
      </g>

      <!-- Code Inspector Block -->
      <g transform="translate(0, 36)">
        <rect width="536" height="212" rx="8" fill="url(#codeBg)" stroke="#ffffff" stroke-opacity="0.06" stroke-width="1" />
        
        <g transform="translate(18, 26)" font-family="'Geist Mono', monospace" font-size="12">
          <text y="0" fill="#64748b">{</text>
          <text y="22">
            <tspan x="14" fill="#79c0ff">&quot;id&quot;</tspan><tspan fill="#64748b">: </tspan><tspan fill="#a5d6ff">&quot;evt_3O9xL2eZvKYlo2&quot;</tspan><tspan fill="#64748b">,</tspan>
          </text>
          <text y="44">
            <tspan x="14" fill="#79c0ff">&quot;event&quot;</tspan><tspan fill="#64748b">: </tspan><tspan fill="#a5d6ff">&quot;checkout.session.completed&quot;</tspan><tspan fill="#64748b">,</tspan>
          </text>
          <text y="66">
            <tspan x="14" fill="#79c0ff">&quot;customer&quot;</tspan><tspan fill="#64748b">: </tspan><tspan fill="#a5d6ff">&quot;cus_Qx81Nmp92L&quot;</tspan><tspan fill="#64748b">,</tspan>
          </text>
          <text y="88">
            <tspan x="14" fill="#79c0ff">&quot;amount_total&quot;</tspan><tspan fill="#64748b">: </tspan><tspan fill="#ffa657">14900</tspan><tspan fill="#64748b">,</tspan>
          </text>
          <text y="110">
            <tspan x="14" fill="#79c0ff">&quot;currency&quot;</tspan><tspan fill="#64748b">: </tspan><tspan fill="#a5d6ff">&quot;usd&quot;</tspan><tspan fill="#64748b">,</tspan>
          </text>
          <text y="132">
            <tspan x="14" fill="#79c0ff">&quot;payment_status&quot;</tspan><tspan fill="#64748b">: </tspan><tspan fill="#7ee787">&quot;paid&quot;</tspan>
          </text>
          <text y="154" fill="#64748b">}</text>
        </g>

        <!-- Inspector Sub-Footer Bar -->
        <g transform="translate(0, 180)">
          <line x1="0" y1="0" x2="536" y2="0" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1" />
          <text x="16" y="20" fill="#64748b" font-family="'Geist Mono', monospace" font-size="10">application/json • 284 B</text>
          <text x="380" y="20" fill="#34d399" font-family="'Geist Mono', monospace" font-size="10">✓ Verified HMAC Signature</text>
        </g>
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

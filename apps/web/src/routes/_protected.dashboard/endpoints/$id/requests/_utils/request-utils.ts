import type { RequestDetail } from '../_types'

export function capturedEntries(value: unknown): readonly (readonly [string, string])[] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return []
  }

  return Object.entries(value).map(([key, entry]) => [key, formatCapturedValue(entry)])
}

export function formatCapturedValue(value: unknown): string {
  if (typeof value === 'string') {
    return value
  }

  if (value === undefined) {
    return 'Not captured'
  }

  return JSON.stringify(value, null, 2) ?? String(value)
}

export function getRequestPath(url: string): string {
  if (URL.canParse(url)) {
    const parsed = new URL(url)
    return `${parsed.pathname}${parsed.search}`
  }

  if (URL.canParse(url, 'https://probe.local')) {
    const parsed = new URL(url, 'https://probe.local')
    return `${parsed.pathname}${parsed.search}`
  }

  return url
}

export function getQueryEntries(url: string): readonly (readonly [string, string])[] {
  if (URL.canParse(url)) {
    return [...new URL(url).searchParams.entries()]
  }

  if (URL.canParse(url, 'https://probe.local')) {
    return [...new URL(url, 'https://probe.local').searchParams.entries()]
  }

  return []
}

function shellQuote(value: string): string {
  return `'${value.replaceAll(`'`, `'"'"'`)}'`
}

export function createCurlCommand({
  body,
  headers,
  method,
  url,
}: {
  readonly body: unknown
  readonly headers: unknown
  readonly method: string
  readonly url: string
}): string {
  const parts = [`curl --request ${method} ${shellQuote(url)}`]

  for (const [key, value] of capturedEntries(headers)) {
    parts.push(`  --header ${shellQuote(`${key}: ${value}`)}`)
  }

  if (body !== null && body !== undefined) {
    parts.push(`  --data ${shellQuote(typeof body === 'string' ? body : formatCapturedValue(body))}`)
  }

  return parts.join(' \\\n')
}

interface HarHeader {
  readonly name: string
  readonly value: string
}

interface HarPostData {
  readonly mimeType: string
  readonly text: string
}

interface HarEntry {
  readonly cache: Record<string, never>
  readonly request: {
    readonly bodySize: number
    readonly headers: readonly HarHeader[]
    readonly headersSize: number
    readonly httpVersion: string
    readonly method: string
    readonly postData?: HarPostData
    readonly queryString: readonly HarHeader[]
    readonly url: string
  }
  readonly response: {
    readonly bodySize: number
    readonly content: {
      readonly mimeType: string
      readonly size: number
      readonly text: string
    }
    readonly headers: readonly HarHeader[]
    readonly headersSize: number
    readonly httpVersion: string
    readonly redirectURL: string
    readonly status: number
    readonly statusText: string
  }
  readonly startedDateTime: string
  readonly time: number
  readonly timings: {
    readonly receive: number
    readonly send: number
    readonly wait: number
  }
}

export interface HarLog {
  readonly log: {
    readonly creator: { readonly name: string, readonly version: string }
    readonly entries: readonly HarEntry[]
    readonly version: string
  }
}

function toHarHeaders(value: unknown): readonly HarHeader[] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return []
  }

  return Object.entries(value).flatMap(([name, entry]): HarHeader[] => {
    if (typeof entry === 'string') {
      return [{ name, value: entry }]
    }

    if (Array.isArray(entry)) {
      return entry.map(item => ({ name, value: String(item) }))
    }

    return [{ name, value: formatCapturedValue(entry) }]
  })
}

function firstHeaderValue(value: unknown, name: string): string | undefined {
  return toHarHeaders(value).find(header => header.name.toLowerCase() === name)?.value
}

function parseUrl(url: string): URL | undefined {
  if (URL.canParse(url)) {
    return new URL(url)
  }

  if (URL.canParse(url, 'https://probe.local')) {
    return new URL(url, 'https://probe.local')
  }

  return undefined
}

export function createHarLog(request: RequestDetail): HarLog {
  const parsedUrl = parseUrl(request.url)
  const body = request.reqBody ?? null

  const postData = body === null
    ? undefined
    : {
        mimeType: firstHeaderValue(request.reqHeaders, 'content-type') ?? 'application/octet-stream',
        text: typeof body === 'string' ? body : formatCapturedValue(body),
      }

  const status = Number(request.statusCode)
  const responseBody = request.resBody ?? null

  return {
    log: {
      creator: { name: 'Probe', version: '1.0' },
      entries: [
        {
          cache: {},
          request: {
            bodySize: postData ? postData.text.length : 0,
            headers: toHarHeaders(request.reqHeaders),
            headersSize: -1,
            httpVersion: 'HTTP/1.1',
            method: request.method,
            postData,
            queryString: parsedUrl
              ? [...parsedUrl.searchParams.entries()].map(([name, value]) => ({ name, value }))
              : [],
            url: request.url,
          },
          response: {
            bodySize: -1,
            content: {
              mimeType: firstHeaderValue(request.resHeaders, 'content-type') ?? 'application/octet-stream',
              size: -1,
              text: responseBody === null ? '' : formatCapturedValue(responseBody),
            },
            headers: toHarHeaders(request.resHeaders),
            headersSize: -1,
            httpVersion: 'HTTP/1.1',
            redirectURL: '',
            status: Number.isNaN(status) ? 0 : status,
            statusText: '',
          },
          startedDateTime: new Date(request.createdAt).toISOString(),
          time: 0,
          timings: { receive: 0, send: 0, wait: 0 },
        },
      ],
      version: '1.2',
    },
  }
}

export function downloadRequestHar(request: RequestDetail): void {
  const har = createHarLog(request)
  const blob = new Blob([JSON.stringify(har, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  try {
    const link = document.createElement('a')
    link.download = `${request.id}.har`
    link.href = url
    link.click()
  }
  finally {
    URL.revokeObjectURL(url)
  }
}

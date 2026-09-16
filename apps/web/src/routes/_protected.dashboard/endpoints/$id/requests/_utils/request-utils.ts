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

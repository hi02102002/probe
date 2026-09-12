export type StandardHeaders = Record<string, string | string[]>

export type InputHeaders = Headers | Record<string, string | string[] | undefined> | null | undefined

export function toStandardHeaders(
  headers?: InputHeaders,
  standardHeaders: StandardHeaders = {},
): StandardHeaders {
  if (!headers) {
    return standardHeaders
  }

  if (typeof (headers as Headers).forEach === 'function') {
    (headers as Headers).forEach((value, key) => {
      const existing = standardHeaders[key]
      if (Array.isArray(existing)) {
        existing.push(value)
      }
      else if (existing !== undefined) {
        standardHeaders[key] = [existing, value]
      }
      else {
        standardHeaders[key] = value
      }
    })
    return standardHeaders
  }

  for (const [key, value] of Object.entries(headers)) {
    if (value === undefined) {
      continue
    }

    const existing = standardHeaders[key]
    if (Array.isArray(value)) {
      if (Array.isArray(existing)) {
        existing.push(...value)
      }
      else if (existing !== undefined) {
        standardHeaders[key] = [existing, ...value]
      }
      else {
        standardHeaders[key] = [...value]
      }
    }
    else {
      if (Array.isArray(existing)) {
        existing.push(value)
      }
      else if (existing !== undefined) {
        standardHeaders[key] = [existing, value]
      }
      else {
        standardHeaders[key] = value
      }
    }
  }

  return standardHeaders
}

export function getClientIp(headers: any): string | null {
  return (
    headers.get('cf-connecting-ip')
    ?? headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim()
    ?? headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? headers.get('x-real-ip')
    ?? 'unknown'
  )
}

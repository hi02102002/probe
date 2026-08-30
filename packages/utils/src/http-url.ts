export function resolveHttpUrl(
  value: null | string | undefined,
  fallback: string,
): string {
  const candidate = value?.trim()

  if (!candidate) {
    return fallback
  }

  try {
    const url = new URL(candidate)

    return url.protocol === 'http:' || url.protocol === 'https:'
      ? candidate
      : fallback
  }
  catch {
    return fallback
  }
}

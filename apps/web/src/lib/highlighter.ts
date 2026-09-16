import { createHighlighter } from '@tanstack/highlight/core'
import { html } from '@tanstack/highlight/languages/html'
import { http } from '@tanstack/highlight/languages/http'
import { js } from '@tanstack/highlight/languages/js'
import { json } from '@tanstack/highlight/languages/json'
import { plaintext } from '@tanstack/highlight/languages/plaintext'
import { shell } from '@tanstack/highlight/languages/shell'
import { ts } from '@tanstack/highlight/languages/ts'
import { tsx } from '@tanstack/highlight/languages/tsx'
import { yaml } from '@tanstack/highlight/languages/yaml'

export const highlighter = createHighlighter({
  fallbackLanguage: 'plaintext',
  languages: [json, shell, http, js, ts, tsx, html, yaml, plaintext],
})

export function detectLanguage(content: string, contentType?: string): string {
  if (contentType) {
    const lower = contentType.toLowerCase()
    if (lower.includes('json'))
      return 'json'
    if (lower.includes('html'))
      return 'html'
    if (lower.includes('xml'))
      return 'html'
    if (lower.includes('yaml') || lower.includes('yml'))
      return 'yaml'
  }

  const trimmed = content.trim()
  if (
    (trimmed.startsWith('{') && trimmed.endsWith('}'))
    || (trimmed.startsWith('[') && trimmed.endsWith(']'))
  ) {
    try {
      JSON.parse(trimmed)
      return 'json'
    }
    catch {
      // Ignore parse failure
    }
  }

  if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
    return 'html'
  }

  if (trimmed.startsWith('curl ') || trimmed.startsWith('curl\n')) {
    return 'shell'
  }

  return 'plaintext'
}

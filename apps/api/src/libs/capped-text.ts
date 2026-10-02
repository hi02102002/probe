/**
 * Reads a response body as text while storing at most `cap` characters,
 * so an oversized remote response cannot exhaust memory.
 */
export async function readCappedText(response: Response, cap: number): Promise<string> {
  const reader = response.body?.getReader()

  if (!reader) {
    return ''
  }

  const decoder = new TextDecoder()
  let text = ''

  try {
    while (text.length < cap) {
      const { done, value } = await reader.read()

      if (done) {
        break
      }

      text += decoder.decode(value, { stream: true })
    }
  }
  finally {
    await reader.cancel().catch(() => undefined)
  }

  return text.slice(0, cap)
}

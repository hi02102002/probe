import { describe, expect, it } from 'vitest'
import { readCappedText } from './capped-text.js'

describe('readCappedText', () => {
  it('returns an empty string for a null body', async () => {
    expect(await readCappedText(new Response(null), 100)).toBe('')
  })

  it('returns the full text when it is under the cap', async () => {
    expect(await readCappedText(new Response('{"ok":true}'), 100)).toBe('{"ok":true}')
  })

  it('truncates the text at the cap', async () => {
    const response = new Response('a'.repeat(100))

    expect(await readCappedText(response, 10)).toBe('a'.repeat(10))
  })

  it('stops reading oversized streams early', async () => {
    const response = new Response('x'.repeat(1_000_000))

    expect(await readCappedText(response, 5)).toBe('xxxxx')
  })
})

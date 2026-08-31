import { customAlphabet, nanoid } from 'nanoid'

export const ALPHANUMERIC = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
export const LOWERCASE_ALPHANUMERIC = '0123456789abcdefghijklmnopqrstuvwxyz'

export { customAlphabet, nanoid }

/**
 * Generate a nano ID with an optional prefix (e.g., `createId('ep')` => `ep_V1StGXR8_Z5jdHi6B-myT`).
 */
export function createId(prefix?: string, size = 21): string {
  const id = nanoid(size)
  return prefix ? `${prefix}_${id}` : id
}

/**
 * Create a reusable ID generator with a predefined prefix and size.
 */
export function createIdGenerator(prefix?: string, size = 21) {
  return () => createId(prefix, size)
}

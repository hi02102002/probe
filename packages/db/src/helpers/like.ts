/**
 * Escapes PostgreSQL LIKE/ILIKE wildcard metacharacters (`%`, `_`, `\`) in a
 * user-supplied search string so it is matched literally when embedded in a
 * LIKE/ILIKE pattern.
 *
 * PostgreSQL's default LIKE/ILIKE escape character is the backslash, so each
 * metacharacter is prefixed with `\` (e.g. `%` -> `\%`). No explicit `ESCAPE`
 * clause is required — Drizzle's `ilike(column, value)` emits `column ilike
 * value` and relies on this default.
 *
 * Without escaping, a user searching for `%` (match any string) or `_`
 * (match any single character) would silently bypass or widen the name
 * filter, and names containing `%` or `_` could not be searched literally.
 *
 * @example
 * ```ts
 * import { ilike } from 'drizzle-orm'
 * import { escapeLike } from '@repo/db/queries'
 *
 * ilike(endpoint.name, `%${escapeLike(input)}%`)
 * ```
 */
export function escapeLike(input: string): string {
  return input.replace(/[%_\\]/g, match => `\\${match}`)
}

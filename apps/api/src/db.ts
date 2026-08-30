import type { PostgresDatabase, PostgresPool } from '@repo/db'
import { createPostgresDatabase, createPostgresPool } from '@repo/db'
import { env } from '#/env.js'

let pool: PostgresPool | undefined
let database: PostgresDatabase | undefined

export function getDatabase(): PostgresDatabase {
  if (database) {
    return database
  }

  pool ??= createPostgresPool({
    connectionString: env.DATABASE_URL,
  })
  database = createPostgresDatabase(pool)

  return database
}

export async function closeDatabase(): Promise<void> {
  await pool?.end()
  pool = undefined
  database = undefined
}

import type { PoolConfig } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { relations } from './relations.js'
import './drizzle-plus.js'

export interface PostgresDatabaseOptions {
  connectionString: string
  pool?: Omit<PoolConfig, 'connectionString'>
}

export function createPostgresPool(options: PostgresDatabaseOptions) {
  const connectionString = options.connectionString.trim()

  if (!connectionString) {
    throw new Error('DATABASE_URL is required')
  }

  return new Pool({
    connectionString,
    ...options.pool,
  })
}

export function createPostgresDatabase(pool: Pool) {
  return drizzle({
    client: pool,
    relations,
  })
}

export type PostgresPool = ReturnType<typeof createPostgresPool>
export type PostgresDatabase = ReturnType<typeof createPostgresDatabase>

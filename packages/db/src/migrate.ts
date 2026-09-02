/* eslint-disable no-console */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { config } from 'dotenv'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { createPostgresDatabase, createPostgresPool } from './postgres/index.js'

const workspaceRoot = new URL('../../', import.meta.url)

config({
  path: [
    fileURLToPath(new URL('.env.local', workspaceRoot)),
    fileURLToPath(new URL('.env', workspaceRoot)),
    fileURLToPath(new URL('apps/api/.env.local', workspaceRoot)),
    fileURLToPath(new URL('apps/api/.env', workspaceRoot)),
  ],
  quiet: true,
})

function getMigrationsFolder(): string {
  if (process.env.MIGRATIONS_FOLDER && fs.existsSync(process.env.MIGRATIONS_FOLDER)) {
    return process.env.MIGRATIONS_FOLDER
  }

  // Check ./drizzle in current working directory (e.g. in deployed container)
  const cwdDrizzle = path.resolve(process.cwd(), 'drizzle')
  if (fs.existsSync(cwdDrizzle)) {
    return cwdDrizzle
  }

  // Check relative to this module in @repo/db
  const defaultPath = fileURLToPath(new URL('../drizzle', import.meta.url))
  if (fs.existsSync(defaultPath)) {
    return defaultPath
  }

  // Search parent directories for packages/db/drizzle
  for (let i = 1; i <= 4; i++) {
    const candidate = path.resolve(process.cwd(), '../'.repeat(i), 'packages/db/drizzle')
    if (fs.existsSync(candidate)) {
      return candidate
    }
  }

  return defaultPath
}

export async function runMigrations() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required for migrations')
  }

  const pool = createPostgresPool({ connectionString })
  const db = createPostgresDatabase(pool)

  const migrationsFolder = getMigrationsFolder()
  console.log(`⏳ Running database migrations from ${migrationsFolder}...`)
  await migrate(db, { migrationsFolder })
  console.log('✅ Database migrations applied successfully!')

  await pool.end()
}

// Auto-run if executed directly as a script
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  runMigrations().catch((error) => {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  })
}

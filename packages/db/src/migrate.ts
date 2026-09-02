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

export async function runMigrations() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required for migrations')
  }

  const pool = createPostgresPool({ connectionString })
  const db = createPostgresDatabase(pool)

  console.log('⏳ Running database migrations...')
  const migrationsFolder = fileURLToPath(new URL('../drizzle', import.meta.url))
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


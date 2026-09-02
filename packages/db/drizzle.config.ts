import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

const workspaceRoot = new URL('../../', import.meta.url)

config({
  path: [
    fileURLToPath(new URL('.env', workspaceRoot)),
    fileURLToPath(new URL('apps/api/.env', workspaceRoot)),
  ],
  quiet: true,
})

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required')
}

export default defineConfig({
  dialect: 'postgresql',
  out: './drizzle',
  schema: './src/postgres/schema.ts',
  schemaFilter: ['public'],
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
})

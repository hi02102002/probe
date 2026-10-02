import process from 'node:process'
import { serve } from '@hono/node-server'
import { startCronJobs } from '#/cron/index.js'
import { closeDatabase } from '#/db.js'
import { env } from '#/env.js'
import { createApp } from '#/libs/create-app.js'

const app = createApp()

const server = serve({
  fetch: app.fetch,
  port: env.PORT,
}, (info) => {
  process.stdout.write(`API listening on http://localhost:${info.port}\n`)
})

startCronJobs()

let isShuttingDown = false

async function shutdown(signal: string) {
  if (isShuttingDown) {
    return
  }

  isShuttingDown = true
  process.stdout.write(`\nReceived ${signal}. Shutting down gracefully...\n`)

  // Force exit after 10s to prevent hanging on keep-alive/streaming connections
  const forceExitTimeout = setTimeout(() => {
    console.error('Graceful shutdown timed out after 10s. Forcing exit.')
    process.exit(1)
  }, 10_000).unref()

  try {
    if ('closeIdleConnections' in server && typeof server.closeIdleConnections === 'function') {
      server.closeIdleConnections()
    }

    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error)
          return
        }
        resolve()
      })
    })

    await closeDatabase()
    clearTimeout(forceExitTimeout)
    process.exit(0)
  }
  catch (error) {
    console.error('Error during shutdown:', error)
    clearTimeout(forceExitTimeout)
    process.exit(1)
  }
}

process.once('SIGINT', () => shutdown('SIGINT'))
process.once('SIGTERM', () => shutdown('SIGTERM'))

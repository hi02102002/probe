import process from 'node:process'
import { serve } from '@hono/node-server'
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

let isShuttingDown = false

function shutdown() {
  if (isShuttingDown) {
    return
  }

  isShuttingDown = true

  server.close(async (error) => {
    if (error) {
      console.error(error)
      process.exitCode = 1
    }

    try {
      await closeDatabase()
    }
    catch (databaseError) {
      console.error(databaseError)
      process.exitCode = 1
    }
  })
}

process.once('SIGINT', shutdown)
process.once('SIGTERM', shutdown)

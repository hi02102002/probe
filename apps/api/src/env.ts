import process from 'node:process'
import { createApiEnv } from '@repo/env/api'
import { loadEnv } from '@repo/env/dotenv'

export const env = createApiEnv(loadEnv({ processEnv: process.env }))

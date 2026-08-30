import process from 'node:process'

import { createApiEnv } from '@repo/env/api'

export const env = createApiEnv(process.env)

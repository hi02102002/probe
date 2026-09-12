import type { RedisOptions } from 'ioredis'
import { Redis } from 'ioredis'

import { env } from '#/env.js'

const redisOptions: RedisOptions = {
  connectTimeout: 5000,
  enableReadyCheck: false,
  lazyConnect: true,
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    if (times > 5) {
      return null
    }
    return Math.min(times * 100, 2000)
  },
}

export const redis = new Redis(env.REDIS_URL, redisOptions)

redis.on('error', (error) => {
  console.error('[ioredis] Connection error:', error.message)
})

export const subscriberRedis = redis.duplicate({
  connectTimeout: 5000,
  enableReadyCheck: false,
  lazyConnect: true,
  maxRetriesPerRequest: null,
})

subscriberRedis.on('error', (error) => {
  console.error('[ioredis:subscriber] Connection error:', error.message)
})

export const getRedis = () => redis

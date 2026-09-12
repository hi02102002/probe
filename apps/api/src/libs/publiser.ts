import { IORedisPublisher } from '@orpc/experimental-publisher/ioredis'

import { redis, subscriberRedis } from './ioredis.js'

export const publisher = new IORedisPublisher({
  commander: redis,
  listener: subscriberRedis,
})

import { oc } from '@orpc/contract'
import { z } from 'zod'

export const systemContract = {
  health: oc
    .route({
      method: 'GET',
      path: '/health',
      summary: 'Check API health',
    })
    .output(z.object({
      service: z.literal('probe-api'),
      status: z.literal('ok'),
    })),
}

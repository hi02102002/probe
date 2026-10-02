import { oc } from '@orpc/contract'
import {
  ListForwardsInputSchema,
  ListForwardsOutputSchema,
} from '@repo/schemas/wh-forward'

const tags = ['Webhook Forwards'] as const

export const forwardContract = {
  list: oc
    .route({
      description: 'List webhook forward logs for an owned endpoint',
      inputStructure: 'detailed',
      method: 'GET',
      path: '/endpoints/{endpointId}/forwards',
      summary: 'List webhook forward logs',
      tags,
    })
    .input(ListForwardsInputSchema)
    .output(ListForwardsOutputSchema),
}

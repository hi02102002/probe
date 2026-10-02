import { oc } from '@orpc/contract'
import {
  ListReplaysInputSchema,
  ListReplaysOutputSchema,
  SendReplayInputSchema,
  SendReplayOutputSchema,
} from '@repo/schemas/wh-replay'

const tags = ['Webhook Replays'] as const

export const replayContract = {
  list: oc
    .route({
      description: 'List webhook replay logs for an owned endpoint',
      inputStructure: 'detailed',
      method: 'GET',
      path: '/endpoints/{endpointId}/replays',
      summary: 'List webhook replay logs',
      tags,
    })
    .input(ListReplaysInputSchema)
    .output(ListReplaysOutputSchema),
  send: oc
    .route({
      description: 'Replay a webhook payload to a target destination URL from the server',
      inputStructure: 'detailed',
      method: 'POST',
      path: '/endpoints/{endpointId}/replays',
      summary: 'Send webhook replay',
      tags,
    })
    .input(SendReplayInputSchema)
    .output(SendReplayOutputSchema),
}

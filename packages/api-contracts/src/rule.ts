import { oc } from '@orpc/contract'
import {
  GetRuleOutputSchema,
  SaveRuleInputSchema,
  SaveRuleOutputSchema,
} from '@repo/schemas/endpoint-rule'
import { z } from 'zod'

const tags = ['Endpoint Rules'] as const

export const ruleContract = {
  get: oc
    .route({
      description: 'Get the response and routing rules configured for an owned endpoint',
      inputStructure: 'detailed',
      method: 'GET',
      path: '/endpoints/{endpointId}/rule',
      summary: 'Get endpoint rules',
      tags,
    })
    .input(z.object({
      params: z.object({
        endpointId: z.string(),
      }),
    }))
    .output(GetRuleOutputSchema),
  save: oc
    .route({
      description: 'Create or update the response and routing rules for an owned endpoint',
      inputStructure: 'detailed',
      method: 'PUT',
      path: '/endpoints/{endpointId}/rule',
      summary: 'Save endpoint rules',
      tags,
    })
    .input(SaveRuleInputSchema)
    .output(SaveRuleOutputSchema),
}

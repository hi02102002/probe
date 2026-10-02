import { z } from 'zod'

export const CustomResponseRuleSchema = z.object({
  enabled: z.boolean(),
  statusCode: z.number().int().min(100).max(599),
  contentType: z.string().trim().min(1).max(100).default('application/json'),
  body: z.string().max(100_000).default(''),
})

export const DelayRuleSchema = z.object({
  enabled: z.boolean(),
  durationMs: z.number().int().min(0).max(10_000),
})

export const SignatureRuleSchema = z.object({
  enabled: z.boolean(),
  headerName: z.string().trim().max(100),
  secret: z.string().max(256),
})

export const ForwardingRuleSchema = z.object({
  enabled: z.boolean(),
  targetUrl: z.string().trim().max(2048),
})

export const SaveRuleInputSchema = z.object({
  params: z.object({
    endpointId: z.string(),
  }),
  body: z.object({
    customResponse: CustomResponseRuleSchema,
    delay: DelayRuleSchema,
    signature: SignatureRuleSchema,
    forwarding: ForwardingRuleSchema,
  }),
}).superRefine((input, ctx) => {
  if (input.body.signature.enabled && input.body.signature.headerName.trim().length === 0) {
    ctx.addIssue({
      code: 'custom',
      path: ['body', 'signature', 'headerName'],
      message: 'Signature header name is required',
    })
  }

  if (input.body.signature.enabled && input.body.signature.secret.length < 8) {
    ctx.addIssue({
      code: 'custom',
      path: ['body', 'signature', 'secret'],
      message: 'Signature secret must be at least 8 characters',
    })
  }

  if (input.body.forwarding.enabled && !z.url().safeParse(input.body.forwarding.targetUrl).success) {
    ctx.addIssue({
      code: 'custom',
      path: ['body', 'forwarding', 'targetUrl'],
      message: 'A valid destination URL is required',
    })
  }
})

export const EndpointRuleSchema = z.object({
  endpointId: z.string().describe('Associated endpoint ID'),
  customResponseEnabled: z.boolean().describe('Whether the custom response rule is active'),
  customStatusCode: z.number().int().nullable().optional().describe('HTTP status returned to the sender'),
  customContentType: z.string().nullable().optional().describe('Content-Type of the custom response'),
  customResponseBody: z.string().nullable().optional().describe('Raw response body returned to the sender'),
  delayEnabled: z.boolean().describe('Whether the response delay rule is active'),
  delayMs: z.number().int().nullable().optional().describe('Delay before responding, in milliseconds'),
  signatureEnabled: z.boolean().describe('Whether the signature validation rule is active'),
  signatureHeaderName: z.string().nullable().optional().describe('Header carrying the HMAC signature'),
  signatureSecret: z.string().nullable().optional().describe('Shared secret used to compute the HMAC'),
  forwardEnabled: z.boolean().describe('Whether the forwarding rule is active'),
  forwardTargetUrl: z.string().nullable().optional().describe('Destination URL for forwarded requests'),
  createdAt: z.date().describe('Creation timestamp'),
  updatedAt: z.date().describe('Last updated timestamp'),
})

export const GetRuleOutputSchema = z.object({
  rule: EndpointRuleSchema.nullable(),
})

export const SaveRuleOutputSchema = z.object({
  rule: EndpointRuleSchema,
})

export type CustomResponseRule = z.infer<typeof CustomResponseRuleSchema>
export type DelayRule = z.infer<typeof DelayRuleSchema>
export type SignatureRule = z.infer<typeof SignatureRuleSchema>
export type ForwardingRule = z.infer<typeof ForwardingRuleSchema>
export type SaveRuleInput = z.infer<typeof SaveRuleInputSchema>
export type EndpointRule = z.infer<typeof EndpointRuleSchema>
export type GetRuleOutput = z.infer<typeof GetRuleOutputSchema>
export type SaveRuleOutput = z.infer<typeof SaveRuleOutputSchema>

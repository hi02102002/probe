import { Resend } from 'resend'

export interface ResendClientOptions {
  apiKey?: string
}

let resendInstance: Resend | undefined

/**
 * Creates a new Resend instance.
 */
export function createResendClient(options: ResendClientOptions): Resend {
  if (!options.apiKey) {
    throw new Error('Resend API key is required.')
  }
  return new Resend(options.apiKey)
}

/**
 * Returns a reusable singleton Resend instance (`resend ??= new Resend(options.apiKey)`).
 */
export function getResendClient(options: ResendClientOptions): Resend {
  if (!options.apiKey) {
    throw new Error('Resend API key is required.')
  }
  resendInstance ??= new Resend(options.apiKey)
  return resendInstance
}

/**
 * Higher-order utility to execute actions with a singleton Resend client.
 */
export async function withResend<T>(
  options: ResendClientOptions,
  action: (resend: Resend) => Promise<T>,
): Promise<T> {
  const resend = getResendClient(options)
  return action(resend)
}

export { Resend }

import { withResend } from '../client.js'
import { MagicLinkEmail } from '../templates/magic-link.js'

export interface ResendMagicLinkSenderOptions {
  apiKey?: string
  appName: string
  fromEmail?: string
  publicOrigin: string
}

export function createResendMagicLinkSender(
  options: ResendMagicLinkSenderOptions,
) {
  return async ({ email, url }: { email: string, url: string }) => {
    if (!options.apiKey || !options.fromEmail) {
      throw new Error(
        'Magic-link email is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL.',
      )
    }

    return withResend({ apiKey: options.apiKey }, async (resend) => {
      const publicUrl = new URL(url)
      const publicOrigin = new URL(options.publicOrigin)
      publicUrl.hostname = publicOrigin.hostname
      publicUrl.port = publicOrigin.port
      publicUrl.protocol = publicOrigin.protocol

      const magicLinkUrl = publicUrl.toString()
      const { error } = await resend.emails.send({
        from: `${options.appName} <${options.fromEmail}>`,
        react: (
          <MagicLinkEmail
            appName={options.appName}
            magicLinkUrl={magicLinkUrl}
          />
        ),
        subject: `Your ${options.appName} sign-in link`,
        to: email,
      })

      if (error) {
        throw new Error(`Failed to send magic-link email: ${error.message}`, {
          cause: error,
        })
      }
    })
  }
}

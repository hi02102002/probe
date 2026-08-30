import type { Transporter } from 'nodemailer'
import nodemailer from 'nodemailer'

export interface GmailMagicLinkSenderOptions {
  appName: string
  appPassword?: string
  publicOrigin: string
  user?: string
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

export function createGmailMagicLinkSender(
  options: GmailMagicLinkSenderOptions,
) {
  let transporter: Transporter | undefined

  return async ({ email, url }: { email: string, url: string }) => {
    if (!options.user || !options.appPassword) {
      throw new Error(
        'Magic-link email is not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD.',
      )
    }

    transporter ??= nodemailer.createTransport({
      auth: {
        pass: options.appPassword,
        user: options.user,
      },
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
    })

    const publicUrl = new URL(url)
    const publicOrigin = new URL(options.publicOrigin)
    publicUrl.hostname = publicOrigin.hostname
    publicUrl.port = publicOrigin.port
    publicUrl.protocol = publicOrigin.protocol

    const magicLinkUrl = publicUrl.toString()

    await transporter.sendMail({
      from: `${options.appName} <${options.user}>`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#171717">
          <h1 style="font-size:20px">Sign in to ${escapeHtml(options.appName)}</h1>
          <p>Use the button below to securely sign in to your account.</p>
          <p style="margin:24px 0">
            <a href="${escapeHtml(magicLinkUrl)}" style="background:#171717;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none">Sign in</a>
          </p>
          <p style="font-size:13px;color:#666">This link expires in 10 minutes and can only be used once.</p>
        </div>
      `,
      subject: `Your ${options.appName} sign-in link`,
      text: `Sign in to ${options.appName}:\n\n${magicLinkUrl}\n\nThis link expires in 10 minutes and can only be used once.`,
      to: email,
    })
  }
}

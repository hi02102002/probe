import type { ReactNode } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { GithubLogoIcon, GoogleLogoIcon } from '@phosphor-icons/react'
import { defaultLocale, getPrefix } from 'intlayer'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useIntlayer } from 'react-intlayer'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel, FieldError as UiFieldError } from '@/components/ui/field'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { toastManager } from '@/components/ui/toast'
import { getAuthClient } from '@/lib/auth-client'

const MAGIC_LINK_COOLDOWN_SECONDS = 60

function getLocalizedPath(locale: string | undefined, path: string) {
  const { prefix } = getPrefix(locale ?? defaultLocale)

  return `/${prefix}${path}`
}

function getAuthCallbackURL(redirectTo: string | undefined, locale: string | undefined) {
  const fallbackURL = new URL(getLocalizedPath(locale, 'dashboard'), window.location.origin)

  if (!redirectTo) {
    return fallbackURL.toString()
  }

  try {
    const callbackURL = new URL(redirectTo, window.location.origin)

    return callbackURL.origin === window.location.origin
      ? callbackURL.toString()
      : fallbackURL.toString()
  }
  catch {
    return fallbackURL.toString()
  }
}

function getAuthErrorCallbackURL(redirectTo: string | undefined, locale: string | undefined) {
  const callbackURL = new URL(getAuthCallbackURL(redirectTo, locale))
  const errorCallbackURL = new URL(getLocalizedPath(locale, 'login'), window.location.origin)

  errorCallbackURL.searchParams.set(
    'redirect',
    `${callbackURL.pathname}${callbackURL.search}${callbackURL.hash}`,
  )

  return errorCallbackURL.toString()
}

function SocialButtons({ locale, redirectTo }: {
  locale?: string
  redirectTo?: string
}) {
  const content = useIntlayer('auth')
  const [error, setError] = useState<string>()
  const [isSubmitting, setIsSubmitting] = useState<'github' | 'google'>()

  async function signInWithSocial(provider: 'github' | 'google') {
    setError(undefined)
    setIsSubmitting(provider)

    try {
      const result = await getAuthClient().signIn.social({
        callbackURL: getAuthCallbackURL(redirectTo, locale),
        provider,
      })

      if (result.error) {
        setError(result.error.message ?? `${content.unableToSignInWith.value} ${provider}. ${content.tryAgain.value}`)
        setIsSubmitting(undefined)
      }
    }
    catch {
      setError(`${content.unableToSignInWith.value} ${provider}. ${content.tryAgain.value}`)
      setIsSubmitting(undefined)
    }
  }

  return (
    <div className="space-y-2">
      <Button
        className="h-10 w-full border-white/10 bg-transparent text-foreground shadow-none hover:bg-white/5"
        disabled={Boolean(isSubmitting)}
        loading={isSubmitting === 'github'}
        onClick={() => signInWithSocial('github')}
        type="button"
        variant="outline"
      >
        <GithubLogoIcon weight="fill" />
        {content.continueWithGithub.value}
      </Button>
      <Button
        className="h-10 w-full border-white/10 bg-transparent text-foreground shadow-none hover:bg-white/5"
        disabled={Boolean(isSubmitting)}
        loading={isSubmitting === 'google'}
        onClick={() => signInWithSocial('google')}
        type="button"
        variant="outline"
      >
        <GoogleLogoIcon />
        {content.continueWithGoogle.value}
      </Button>
      {error && <p aria-live="polite" className="text-destructive text-sm">{error}</p>}
    </div>
  )
}

function FormDivider() {
  const content = useIntlayer('auth')

  return (
    <div className="my-6 flex items-center gap-3">
      <Separator className="flex-1 bg-white/10 data-[orientation=horizontal]:w-auto" />
      <span className="shrink-0 text-muted-foreground text-xs">{content.orDivider.value}</span>
      <Separator className="flex-1 bg-white/10 data-[orientation=horizontal]:w-auto" />
    </div>
  )
}

function AuthField({
  children,
  error,
  id,
  label,
}: {
  children: ReactNode
  error?: string
  id: string
  label: string
}) {
  return (
    <Field className="gap-1.5" invalid={Boolean(error)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {children}
      {error && (
        <UiFieldError id={`${id}-error`} match>
          {error}
        </UiFieldError>
      )}
    </Field>
  )
}

export function LoginForm({ locale, redirectTo }: {
  locale?: string
  redirectTo?: string
}) {
  const content = useIntlayer('auth')
  const [cooldownSeconds, setCooldownSeconds] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sentTo, setSentTo] = useState<string>()

  const loginSchema = useMemo(() => z.object({
    email: z.string().email(content.emailErrorInvalid.value),
  }), [content.emailErrorInvalid.value])

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '' },
  })
  const isCoolingDown = cooldownSeconds > 0

  useEffect(() => {
    if (!isCoolingDown) {
      return
    }

    const intervalId = window.setInterval(() => {
      setCooldownSeconds(current => Math.max(0, current - 1))
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [isCoolingDown])

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    if (isCoolingDown) {
      return
    }

    setIsSubmitting(true)
    form.clearErrors('root')

    try {
      const callbackURL = getAuthCallbackURL(redirectTo, locale)
      const result = await getAuthClient().signIn.magicLink({
        callbackURL,
        email: values.email,
        errorCallbackURL: getAuthErrorCallbackURL(redirectTo, locale),
        name: values.email.split('@')[0],
        newUserCallbackURL: callbackURL,
      })

      if (!result.error) {
        setSentTo(values.email)
        setCooldownSeconds(MAGIC_LINK_COOLDOWN_SECONDS)
        toastManager.add({
          description: (
            <span>
              {content.linkSentDescPrefix.value}
              {' '}
              <strong className="font-medium text-foreground">{values.email}</strong>
              {' '}
              {content.linkSentDescSuffix.value}
            </span>
          ),
          id: 'magic-link-sent',
          title: content.linkSentTitle.value,
          type: 'success',
        })
        return
      }

      form.setError('root', {
        message: result.error.message ?? content.unableToSend.value,
      })
    }
    catch {
      form.setError('root', {
        message: content.unableToSend.value,
      })
    }
    finally {
      setIsSubmitting(false)
    }
  }

  const rootError = form.formState.errors.root?.message

  return (
    <>
      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-foreground">{content.welcomeTitle.value}</h1>
        <p className="mt-2 text-muted-foreground text-sm">{content.welcomeSubtitle.value}</p>
      </div>
      <SocialButtons locale={locale} redirectTo={redirectTo} />
      <FormDivider />
      <Form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <AuthField error={fieldState.error?.message} id="login-email" label={content.emailLabel.value}>
              <Input
                {...field}
                aria-describedby={fieldState.error ? 'login-email-error' : undefined}
                aria-invalid={Boolean(fieldState.error)}
                autoComplete="email"
                id="login-email"
                placeholder={content.emailPlaceholder.value}
                type="email"
              />
            </AuthField>
          )}
        />
        {rootError && <p className="text-destructive text-sm">{rootError}</p>}
        <Button className="h-10 w-full" disabled={isSubmitting || isCoolingDown} loading={isSubmitting} type="submit">
          {isCoolingDown
            ? `${content.sendCooldownPrefix.value} ${cooldownSeconds}s`
            : sentTo
              ? content.sendLinkAgain.value
              : content.sendLink.value}
        </Button>
      </Form>
    </>
  )
}

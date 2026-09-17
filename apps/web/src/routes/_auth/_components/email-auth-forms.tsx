import type { ReactNode } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { GithubLogoIcon, GoogleLogoIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel, FieldError as UiFieldError } from '@/components/ui/field'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { toastManager } from '@/components/ui/toast'
import { getAuthClient } from '@/features/auth/lib/auth-client'
import { getSafeRedirectPath, getSafeRedirectUrl } from '@/lib/safe-redirect'

const MAGIC_LINK_COOLDOWN_SECONDS = 60

function getAuthCallbackURL(redirectTo: string | undefined) {
  return getSafeRedirectUrl(redirectTo, '/dashboard')
}

function getAuthErrorCallbackURL(redirectTo: string | undefined) {
  const safeRedirect = getSafeRedirectPath(redirectTo, '/dashboard')
  const errorCallbackURL = new URL('/login', window.location.origin)

  errorCallbackURL.searchParams.set('redirect', safeRedirect)

  return errorCallbackURL.toString()
}

function SocialButtons({ redirectTo }: {
  redirectTo?: string
}) {
  const [error, setError] = useState<string>()
  const [isSubmitting, setIsSubmitting] = useState<'github' | 'google'>()

  async function signInWithSocial(provider: 'github' | 'google') {
    setError(undefined)
    setIsSubmitting(provider)

    try {
      const result = await getAuthClient().signIn.social({
        callbackURL: getAuthCallbackURL(redirectTo),
        provider,
      })

      if (result.error) {
        setError(result.error.message ?? `Unable to sign in with ${provider}. Try again.`)
        setIsSubmitting(undefined)
      }
    }
    catch {
      setError(`Unable to sign in with ${provider}. Try again.`)
      setIsSubmitting(undefined)
    }
  }

  return (
    <div className="space-y-2">
      <Button
        className="w-full"
        data-umami-event="Social login clicked"
        data-umami-event-button-name="auth__login__continue-github"
        data-umami-event-provider="github"
        disabled={Boolean(isSubmitting)}
        loading={isSubmitting === 'github'}
        onClick={() => signInWithSocial('github')}
        type="button"
        variant="outline"
      >
        <GithubLogoIcon weight="fill" />
        Continue with GitHub
      </Button>
      <Button
        className="w-full"
        data-umami-event="Social login clicked"
        data-umami-event-button-name="auth__login__continue-google"
        data-umami-event-provider="google"
        disabled={Boolean(isSubmitting)}
        loading={isSubmitting === 'google'}
        onClick={() => signInWithSocial('google')}
        type="button"
        variant="outline"
      >
        <GoogleLogoIcon />
        Continue with Google
      </Button>
      {error && <p aria-live="polite" className="text-destructive text-sm">{error}</p>}
    </div>
  )
}

function FormDivider() {
  return (
    <div className="my-6 flex items-center gap-3">
      <Separator className="flex-1 data-[orientation=horizontal]:w-auto" />
      <span className="shrink-0 text-muted-foreground text-xs">or</span>
      <Separator className="flex-1 data-[orientation=horizontal]:w-auto" />
    </div>
  )
}

function AuthField({
  children,
  error,
  id,
  label,
  required,
}: {
  children: ReactNode
  error?: string
  id: string
  label: string
  required?: boolean
}) {
  return (
    <Field className="gap-1.5" invalid={Boolean(error)}>
      <FieldLabel htmlFor={id} required={required}>{label}</FieldLabel>
      {children}
      {error && (
        <UiFieldError id={`${id}-error`} match>
          {error}
        </UiFieldError>
      )}
    </Field>
  )
}

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
})

export function LoginForm({ redirectTo }: {
  redirectTo?: string
}) {
  const [cooldownSeconds, setCooldownSeconds] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sentTo, setSentTo] = useState<string>()

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
      const callbackURL = getAuthCallbackURL(redirectTo)
      const result = await getAuthClient().signIn.magicLink({
        callbackURL,
        email: values.email,
        errorCallbackURL: getAuthErrorCallbackURL(redirectTo),
        name: values.email.split('@')[0],
        newUserCallbackURL: callbackURL,
      })

      if (!result.error) {
        setSentTo(values.email)
        setCooldownSeconds(MAGIC_LINK_COOLDOWN_SECONDS)
        toastManager.add({
          description: (
            <span>
              Check
              {' '}
              <strong className="font-medium text-foreground">{values.email}</strong>
              {' '}
              for your sign-in link. It expires in 10 minutes.
            </span>
          ),
          id: 'magic-link-sent',
          title: 'Sign-in link sent',
          type: 'success',
        })
        return
      }

      form.setError('root', {
        message: result.error.message ?? 'Unable to send the sign-in link. Try again.',
      })
    }
    catch {
      form.setError('root', {
        message: 'Unable to send the sign-in link. Try again.',
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
        <h1 className="text-2xl font-semibold text-foreground">Welcome back</h1>
        <p className="mt-2 text-muted-foreground text-sm">Sign in to your Probe account</p>
      </div>
      <SocialButtons redirectTo={redirectTo} />
      <FormDivider />
      <Form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <AuthField error={fieldState.error?.message} id="login-email" label="Email" required>
              <Input
                {...field}
                aria-describedby={fieldState.error ? 'login-email-error' : undefined}
                aria-invalid={fieldState.error ? true : undefined}
                autoComplete="email"
                id="login-email"
                placeholder="you@company.com"
                type="email"
              />
            </AuthField>
          )}
        />
        {rootError && <p className="text-destructive text-sm">{rootError}</p>}
        <Button
          className="h-10 w-full"
          data-umami-event="Magic link sign-in submitted"
          data-umami-event-button-name="auth__login__send-magic-link"
          disabled={isSubmitting || isCoolingDown}
          loading={isSubmitting}
          type="submit"
        >
          {isCoolingDown
            ? `Send again in ${cooldownSeconds}s`
            : sentTo
              ? 'Send link again'
              : 'Send sign-in link'}
        </Button>
      </Form>
    </>
  )
}

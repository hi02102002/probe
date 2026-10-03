import type { AuthSession } from '@/features/auth/api/auth-session'
import { GradientAvatar } from '@outpacelabs/avatars'
import { SignOutIcon } from '@phosphor-icons/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { AppShell, PageHeader, PageHeaderDescription, PageHeaderTitle } from '@/components/layouts/dashboard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toastManager } from '@/components/ui/toast'
import { getAuthSessionQueryOptions } from '@/features/auth/api/auth-session'
import { getAuthClient } from '@/features/auth/lib/auth-client'
import { formatDate, formatRelativeTime } from '@/lib/dayjs'

interface AuthSessionRow {
  id: string
  token: string
  createdAt: Date | string
  expiresAt: Date | string
  ipAddress?: null | string
  userAgent?: null | string
}

function describeDevice(userAgent: string | null | undefined): string {
  if (!userAgent) {
    return 'Unknown device'
  }

  const browser = /Edg\//.test(userAgent)
    ? 'Edge'
    : /OPR\//.test(userAgent)
      ? 'Opera'
      : /Firefox\//.test(userAgent)
        ? 'Firefox'
        : /Chrome\//.test(userAgent)
          ? 'Chrome'
          : /Safari\//.test(userAgent)
            ? 'Safari'
            : 'Browser'
  const os = /Windows/.test(userAgent)
    ? 'Windows'
    : /Android/.test(userAgent)
      ? 'Android'
      : /iPhone|iPad/.test(userAgent)
        ? 'iOS'
        : /Mac OS X/.test(userAgent)
          ? 'macOS'
          : /Linux/.test(userAgent)
            ? 'Linux'
            : ''

  return os ? `${browser} on ${os}` : browser
}

function useUpdateName(onDone: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (name: string) => {
      const result = await getAuthClient().updateUser({ name })

      if (result.error) {
        throw new Error(result.error.message ?? 'Could not update your name.')
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: getAuthSessionQueryOptions.queryKey })
      toastManager.add({ type: 'success', title: 'Name updated' })
      onDone()
    },
    onError: (error) => {
      toastManager.add({
        type: 'error',
        title: 'Could not update your name',
        description: error.message,
      })
    },
  })
}

function AccountCard({ user }: { user: AuthSession['user'] }) {
  const [isEditingName, setIsEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState(user.name)
  const updateName = useUpdateName(() => setIsEditingName(false))

  const hasNameChanged = nameDraft.trim() !== user.name && nameDraft.trim().length > 0

  function startEditingName() {
    setNameDraft(user.name)
    setIsEditingName(true)
  }

  return (
    <Card className="shadow-xs">
      <CardHeader className="p-4 pb-3 sm:p-6 sm:pb-4">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">Account</CardTitle>
          </div>
          <CardDescription className="mt-1">
            Your profile information.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 border-t border-border p-4 pt-4 sm:p-6 sm:pt-4">
        <div className="flex items-center gap-3">
          <GradientAvatar
            className="bg-neutral-800"
            pattern="dither"
            radius={99999}
            seed={user.email}
            size={40}
          />
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground text-sm">{user.name}</p>
            <p className="truncate text-muted-foreground text-sm">{user.email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="settings-name" className="text-muted-foreground text-xs">
            Name
          </Label>
          {isEditingName
            ? (
                <form
                  className="flex items-center gap-2"
                  onSubmit={(event) => {
                    event.preventDefault()
                    if (hasNameChanged && !updateName.isPending) {
                      updateName.mutate(nameDraft.trim())
                    }
                  }}
                >
                  <Input
                    id="settings-name"
                    autoFocus
                    disabled={updateName.isPending}
                    maxLength={50}
                    onChange={event => setNameDraft(event.target.value)}
                    value={nameDraft}
                  />
                  <Button className="h-8.5 sm:h-7.5" disabled={!hasNameChanged} type="submit">
                    {updateName.isPending ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    className="h-8.5 sm:h-7.5"
                    disabled={updateName.isPending}
                    onClick={() => setIsEditingName(false)}
                    type="button"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </form>
              )
            : (
                <div className="flex items-center gap-2">
                  <span className="text-foreground text-sm">{user.name}</span>
                  <Button onClick={startEditingName} variant="outline">
                    Edit
                  </Button>
                </div>
              )}
        </div>
      </CardContent>
    </Card>
  )
}

function SessionsCard({ currentSessionId }: { currentSessionId?: string }) {
  const queryClient = useQueryClient()

  const sessionsQuery = useQuery({
    queryKey: ['auth', 'sessions'],
    queryFn: async () => {
      const result = await getAuthClient().listSessions()

      if (result.error) {
        throw new Error(result.error.message ?? 'Could not load your sessions.')
      }

      return (result.data ?? []) as AuthSessionRow[]
    },
  })

  async function revoke(token: string) {
    const result = await getAuthClient().revokeSession({ token })

    if (result.error) {
      toastManager.add({ type: 'error', title: 'Could not sign out the session' })
      return
    }

    await queryClient.invalidateQueries({ queryKey: ['auth', 'sessions'] })
    toastManager.add({ type: 'success', title: 'Session signed out' })
  }

  async function revokeOtherSessions() {
    const result = await getAuthClient().revokeOtherSessions()

    if (result.error) {
      toastManager.add({ type: 'error', title: 'Could not sign out other sessions' })
      return
    }

    await queryClient.invalidateQueries({ queryKey: ['auth', 'sessions'] })
    toastManager.add({ type: 'success', title: 'Other sessions signed out' })
  }

  const sessions = sessionsQuery.data ?? []
  const otherSessionsCount = sessions.filter(session => session.id !== currentSessionId).length

  return (
    <Card className="shadow-xs">
      <CardHeader className="p-4 pb-3 sm:p-6 sm:pb-4">
        <div>
          <CardTitle className="text-base">Active sessions</CardTitle>
          <CardDescription className="mt-1">
            Devices currently signed in to your account.
          </CardDescription>
        </div>
        <CardAction>
          {otherSessionsCount > 0 && (
            <Button
              data-umami-event="Settings revoke other sessions clicked"
              data-umami-event-button-name="dashboard__settings__revoke-other-sessions"
              onClick={() => void revokeOtherSessions()}
              variant="outline"
            >
              <SignOutIcon className="size-4" weight="duotone" />
              Log out other devices
            </Button>
          )}
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col border-t border-border p-4 pt-2 text-sm sm:p-6 sm:pt-2">
        {sessionsQuery.isLoading && (
          <p className="py-4 text-muted-foreground">Loading sessions...</p>
        )}
        {sessionsQuery.isError && (
          <p className="py-4 text-muted-foreground">Could not load your sessions. Please try again later.</p>
        )}
        {sessionsQuery.isSuccess && sessions.length === 0 && (
          <p className="py-4 text-muted-foreground">You have no active sessions.</p>
        )}
        {sessions.map((session, index) => {
          const isCurrent = session.id === currentSessionId

          return (
            <div
              className={`flex items-center justify-between gap-3 py-3 ${index > 0 ? 'border-t border-border' : ''}`}
              key={session.id}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium text-foreground">
                    {describeDevice(session.userAgent)}
                  </p>
                  {isCurrent && <Badge variant="success">This device</Badge>}
                </div>
                <p className="mt-0.5 truncate text-muted-foreground text-xs">
                  {session.ipAddress ? `${session.ipAddress} · ` : ''}
                  Signed in
                  {' '}
                  {formatRelativeTime(session.createdAt)}
                  {' · '}
                  Expires
                  {' '}
                  {formatDate(session.expiresAt, 'MMM D, YYYY')}
                </p>
              </div>
              {!isCurrent && (
                <Button
                  aria-label={`Sign out session on ${describeDevice(session.userAgent)}`}
                  onClick={() => void revoke(session.token)}
                  variant="outline"
                >
                  <SignOutIcon className="size-4" weight="duotone" />
                  Revoke
                </Button>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

export function SettingsPage() {
  const { data: session } = useQuery(getAuthSessionQueryOptions)

  if (!session) {
    return (
      <AppShell>
        <PageHeader>
          <PageHeaderTitle>
            Settings
          </PageHeaderTitle>
          <PageHeaderDescription>
            Manage your account and active sessions.
          </PageHeaderDescription>
        </PageHeader>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <PageHeader>
        <PageHeaderTitle>
          Settings
        </PageHeaderTitle>
        <PageHeaderDescription>
          Manage your account and active sessions.
        </PageHeaderDescription>
      </PageHeader>

      <div className="mt-6 flex flex-col gap-4">
        <AccountCard user={session.user} />
        <SessionsCard currentSessionId={session.session.id} />
      </div>
    </AppShell>
  )
}

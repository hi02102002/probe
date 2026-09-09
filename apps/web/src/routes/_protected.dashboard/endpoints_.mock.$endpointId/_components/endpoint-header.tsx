import type { MockEndpointDetail } from '../_data'
import {
  ArrowLeftIcon,
  DotsThreeVerticalIcon,
  PauseIcon,
  PlayIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'
import { useState, useSyncExternalStore } from 'react'
import { BrandIcon } from '@/components/brand-icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/ui/copy-button'
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from '@/components/ui/menu'
import { toastManager } from '@/components/ui/toast'

const emptySubscribe = () => () => {}

function useCurrentOrigin() {
  return useSyncExternalStore(
    emptySubscribe,
    () => window.location.origin,
    () => '',
  )
}

export function EndpointHeader({ endpoint }: { endpoint: MockEndpointDetail }) {
  const [status, setStatus] = useState<'active' | 'paused'>(endpoint.status as 'active' | 'paused')
  const origin = useCurrentOrigin()
  const ingestUrl = `${origin}/ep/${endpoint.token}`

  function toggleStatus() {
    const next = status === 'active' ? 'paused' : 'active'
    setStatus(next)
    toastManager.add({
      title: next === 'active' ? 'Endpoint resumed' : 'Endpoint paused',
      description: next === 'active' ? 'Incoming webhooks will now be captured.' : 'Incoming webhooks are temporarily halted.',
      type: 'info',
    })
  }

  return (
    <div className="flex flex-col gap-5 border-b border-border pb-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-muted-foreground text-xs">
        <Link
          className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
          to="/dashboard/endpoints"
        >
          <ArrowLeftIcon className="size-3.5" />
          <span>Endpoints</span>
        </Link>
        <span>/</span>
        <span className="font-medium text-foreground">{endpoint.name}</span>
      </div>

      {/* Main Header Content */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3.5">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-card shadow-xs">
            <BrandIcon className="size-6" name={endpoint.name} />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2.5">
              <h1 className="font-semibold text-foreground text-xl tracking-tight sm:text-2xl">
                {endpoint.name}
              </h1>
              <Badge variant={status === 'active' ? 'success' : 'warning'}>
                <span
                  aria-hidden="true"
                  className={status === 'active' ? 'size-1.5 rounded-full bg-emerald-500' : 'size-1.5 rounded-full bg-amber-500'}
                />
                <span>{status === 'active' ? 'Active' : 'Paused'}</span>
              </Badge>
            </div>
            <div className="flex items-center gap-2 font-mono text-muted-foreground text-xs">
              <span>{endpoint.id}</span>
              <span>•</span>
              <span>
                Token:
                {endpoint.token.slice(0, 12)}
                ...
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={toggleStatus}
            size="sm"
            variant="outline"
          >
            {status === 'active'
              ? (
                  <>
                    <PauseIcon className="size-4 shrink-0" weight="bold" />
                    <span>Pause</span>
                  </>
                )
              : (
                  <>
                    <PlayIcon className="size-4 shrink-0" weight="fill" />
                    <span>Resume</span>
                  </>
                )}
          </Button>

          <Menu>
            <MenuTrigger
              aria-label="More actions"
              className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <DotsThreeVerticalIcon className="size-4" weight="bold" />
            </MenuTrigger>
            <MenuPopup align="end" className="w-48">
              <MenuItem onClick={() => toastManager.add({ title: 'Edit endpoint settings', type: 'info' })}>
                Settings
              </MenuItem>
              <MenuSeparator className="-mx-1" />
              <MenuItem
                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                onClick={() => toastManager.add({ title: 'Endpoint deletion triggered', type: 'error' })}
              >
                <TrashIcon className="size-4 shrink-0" />
                <span>Delete Endpoint</span>
              </MenuItem>
            </MenuPopup>
          </Menu>
        </div>
      </div>

      {/* Ingest Webhook URL Bar */}
      <div className="flex flex-col gap-2 rounded-xl border border-border bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-2.5">
        <div className="flex min-w-0 items-center gap-2.5 px-1">
          <span className="shrink-0 rounded-md bg-primary/10 px-2 py-0.5 font-semibold text-[11px] text-primary uppercase">
            Ingest URL
          </span>
          <span className="truncate font-mono text-muted-foreground text-xs sm:text-sm">
            {ingestUrl}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
          <CopyButton
            size="sm"
            text={ingestUrl}
            variant="outline"
          />
        </div>
      </div>
    </div>
  )
}

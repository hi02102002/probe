import type { Icon } from '@phosphor-icons/react'
import { useRender } from '@base-ui/react/use-render'
import { PauseIcon, PlayIcon } from '@phosphor-icons/react'
import { useMutation } from '@tanstack/react-query'
import { useRouteContext } from '@tanstack/react-router'
import { useMemo, useTransition } from 'react'
import { Button } from '@/components/ui/button'

type EndpointStatus = 'active' | 'inactive' | 'paused'

interface ToggleEndpointStatusState extends Record<string, unknown> {
  readonly loading: boolean
  readonly status: EndpointStatus
}

interface ToggleEndpointStatusProps {
  readonly id: string
  readonly render?: useRender.ComponentProps<'button', ToggleEndpointStatusState>['render']
  readonly status: EndpointStatus
}

const MAP_LABELS: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
  paused: 'Paused',
}

const MAP_ICONS: Record<string, Icon> = {
  active: PauseIcon,
  inactive: PlayIcon,
  paused: PlayIcon,
}

export function ToggleEndpointStatus({
  id,
  render,
  status,
}: ToggleEndpointStatusProps) {
  const { orpc, queryClient } = useRouteContext({
    from: '__root__',
  })
  const IconComponent = MAP_ICONS[status]
  const label = MAP_LABELS[status]
  const changeStatusMutation = useMutation(orpc.endpoint.changeStatus.mutationOptions())
  const [isPending, startTransition] = useTransition()
  const loading = isPending || changeStatusMutation.isPending
  const state = useMemo<ToggleEndpointStatusState>(() => ({
    loading,
    status,
  }), [loading, status])

  const handleChangeStatus = async () => {
    startTransition(async () => {
      if (status === 'active') {
        await changeStatusMutation.mutateAsync({
          body: {
            status: 'paused',
          },
          params: {
            id,
          },
        })
      }
      else if (status === 'paused' || status === 'inactive') {
        await changeStatusMutation.mutateAsync({
          body: {
            status: 'active',
          },
          params: {
            id,
          },
        })
      }

      await queryClient.invalidateQueries({
        queryKey: orpc.endpoint.getById.key({
          input: {
            params: {
              id,
            },
          },
        }),
      })
    })
  }

  return useRender<ToggleEndpointStatusState, HTMLButtonElement>({
    defaultTagName: 'button',
    props: {
      'aria-label': label,
      'children': !loading && (
        <IconComponent
          className="size-4"
          weight="duotone"
        />
      ),
      'data-umami-event': 'Toggle endpoint status',
      'data-umami-event-button-name': 'dashboard__endpoint-header__toggle-status',
      'data-umami-event-status': status,
      'disabled': loading,
      'onClick': handleChangeStatus,
      'title': `Change status to ${status === 'active' ? 'paused' : 'active'}`,
    },
    render: render ?? (
      <Button
        loading={loading}
        size="icon"
      />
    ),
    state,
  })
}

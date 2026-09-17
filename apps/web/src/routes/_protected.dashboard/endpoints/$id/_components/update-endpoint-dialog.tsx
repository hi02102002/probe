import type { ComponentProps } from 'react'

import type { EndpointFormProps } from '@/features/endpoints'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouteContext } from '@tanstack/react-router'
import { useState } from 'react'
import { Alert, AlertAction, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { toastManager } from '@/components/ui/toast'
import { EndpointForm } from '@/features/endpoints'

export interface UpdateEndpointDialogProps {
  trigger?: ComponentProps<typeof DialogTrigger>['render']
  endpointId: string
}

function EndpointFormSkeleton() {
  return (
    <output
      aria-label="Loading endpoint"
      className="block space-y-4"
    >
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-28" />
      </div>
    </output>
  )
}

export function UpdateEndpointDialog({
  trigger,
  endpointId,
}: UpdateEndpointDialogProps) {
  const [open, setOpen] = useState(false)
  const { orpc, queryClient } = useRouteContext({
    from: '/_protected',
  })

  const endpointQuery = useQuery({
    ...orpc.endpoint.getById.queryOptions({
      input: {
        params: {
          id: endpointId,
        },
      },
    }),
    enabled: open,
  })

  const updateEndpointMutation = useMutation(
    orpc.endpoint.update.mutationOptions({
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: orpc.endpoint.getById.key({
              input: {
                params: {
                  id: endpointId,
                },
              },
            }),
          }),
          queryClient.invalidateQueries({
            queryKey: orpc.endpoint.list.key(),
          }),
        ])
      },
    }),
  )

  const handleSubmit: EndpointFormProps['onSubmit'] = async (values) => {
    await updateEndpointMutation.mutateAsync({
      body: {
        name: values.name,
      },
      params: {
        id: endpointId,
      },
    })

    toastManager.add({
      type: 'success',
      title: 'Endpoint updated',
      description: `The endpoint "${values.name}" has been updated successfully.`,
    })

    setOpen(false)
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      {trigger && (
        <DialogTrigger render={trigger} />
      )}
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>Update endpoint</DialogTitle>
          <DialogDescription>
            Update the details for this endpoint.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-6">
          {endpointQuery.isLoading
            ? (
                <EndpointFormSkeleton />
              )
            : endpointQuery.isError
              ? (
                  <Alert variant="error">
                    <AlertTitle>Unable to load endpoint</AlertTitle>
                    <AlertDescription>
                      We could not load the endpoint details. Please try again.
                    </AlertDescription>
                    <AlertAction>
                      <Button
                        data-umami-event="Retry load endpoint details"
                        data-umami-event-button-name="dashboard__update-dialog__retry"
                        loading={endpointQuery.isFetching}
                        onClick={async () => {
                          await endpointQuery.refetch()
                        }}
                        size="sm"
                        type="button"
                        variant="outline"
                      >
                        Try again
                      </Button>
                    </AlertAction>
                  </Alert>
                )
              : endpointQuery.data
                ? (
                    <EndpointForm
                      key={endpointId}
                      initialValues={{
                        name: endpointQuery.data.name,
                      }}
                      onCancel={() => setOpen(false)}
                      onSubmit={handleSubmit}
                      submitLabel="Save changes"
                    />
                  )
                : null}
        </div>
      </DialogPopup>
    </Dialog>
  )
}

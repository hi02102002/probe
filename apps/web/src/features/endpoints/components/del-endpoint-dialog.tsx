import type { ComponentRenderFn, DialogTriggerState, HTMLProps } from '@base-ui/react'
import { useMutation } from '@tanstack/react-query'
import { useRouteContext } from '@tanstack/react-router'
import { AlertDialog, AlertDialogClose, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogPopup, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { toastManager } from '@/components/ui/toast'

interface Props {
  trigger: React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | ComponentRenderFn<HTMLProps, DialogTriggerState>
  endpointId: string
  onDeletedSuccess?: () => void
}

export function DeleteEndpointDialog({ trigger, endpointId, onDeletedSuccess }: Props) {
  const { orpc, queryClient } = useRouteContext({
    from: '__root__',
  })
  const deleteEndpointMutation = useMutation(
    orpc.endpoint.delete.mutationOptions(),
  )

  const handleDeleteEndpoint = async () => {
    try {
      await deleteEndpointMutation.mutateAsync({
        params: {
          id: endpointId,
        },
      })

      await queryClient.invalidateQueries({
        queryKey: orpc.endpoint.list.key(),
      })

      onDeletedSuccess?.()
    }
    catch {
      toastManager.add({
        type: 'error',
        title: 'Something went wrong',
        description: 'We were unable to delete the endpoint. Please try again later.',
      })
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={trigger}
      />
      <AlertDialogPopup>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the endpoint and remove all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter variant="bare">
          <AlertDialogClose render={(
            <Button
              data-umami-event="Cancel delete endpoint"
              data-umami-event-button-name="dashboard__del-dialog__cancel"
              variant="ghost"
              disabled={deleteEndpointMutation.isPending}
            />
          )}
          >
            Cancel
          </AlertDialogClose>
          <AlertDialogClose
            render={(
              <Button
                data-umami-event="Confirm delete endpoint"
                data-umami-event-button-name="dashboard__del-dialog__confirm"
                variant="destructive"
                loading={deleteEndpointMutation.isPending}
              />
            )}
            onClick={handleDeleteEndpoint}
          >
            Delete
          </AlertDialogClose>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  )
}

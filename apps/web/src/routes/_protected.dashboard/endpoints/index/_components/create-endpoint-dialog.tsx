import type { ReactNode } from 'react'

import type { EndpointFormProps } from '@/features/endpoints'
import { useMutation } from '@tanstack/react-query'
import { useRouteContext } from '@tanstack/react-router'
import { useRef } from 'react'
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toastManager } from '@/components/ui/toast'
import { EndpointForm } from '@/features/endpoints'

export interface CreateEndpointDialogProps {
  trigger?: ReactNode
}

export function CreateEndpointDialog({
  trigger,
}: CreateEndpointDialogProps) {
  const { orpc, queryClient } = useRouteContext({
    from: '/_protected',
  })

  const createEndpointMutation = useMutation(
    orpc.endpoint.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: orpc.endpoint.list.key(),
        })
      },
    }),
  )

  const closeTriggerRef = useRef<HTMLButtonElement>(null)
  const handleSubmit: EndpointFormProps['onSubmit'] = async (values) => {
    await createEndpointMutation.mutateAsync({
      body: {
        name: values.name,
      },
    })

    toastManager.add({
      type: 'success',
      title: 'Endpoint created',
      description: `The endpoint "${values.name}" has been created successfully.`,
    })

    closeTriggerRef.current?.click()
  }

  return (
    <Dialog>
      {trigger && (
        <DialogTrigger render={trigger as React.ReactElement} />
      )}
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>Create endpoint</DialogTitle>
          <DialogDescription>
            Create a unique endpoint to capture, inspect, and debug incoming webhooks in real time.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-6">
          <EndpointForm
            onCancel={() => closeTriggerRef.current?.click()}
            onSubmit={handleSubmit}
            submitLabel="Create endpoint"
          />
          <DialogClose
            ref={closeTriggerRef}
            className="sr-only"
          />
        </div>
      </DialogPopup>
    </Dialog>
  )
}

import type { ReactNode } from 'react'
import type { EndpointFormProps } from './endpoint-form'
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
import { EndpointForm } from './endpoint-form'

export interface CreateEndpointDialogProps {
  trigger?: ReactNode
}

export function CreateEndpointDialog({
  trigger,
}: CreateEndpointDialogProps) {
  const closeTriggerRef = useRef<HTMLButtonElement>(null)
  const handleSubmit: EndpointFormProps['onSubmit'] = async () => {
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
            defaultValues={{
              name: '',
            }}
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

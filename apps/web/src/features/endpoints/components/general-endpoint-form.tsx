import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { BrandIcon } from '@/components/brand-icon'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Form } from '@/components/ui/form'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { cn } from '@/lib/cn'

const endpointFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Endpoint name is required')
    .max(50, 'Endpoint name must be 50 characters or less'),
})

export type EndpointFormValues = z.infer<typeof endpointFormSchema>

export interface EndpointFormProps {
  cancelLabel?: string
  className?: string
  initialValues?: EndpointFormValues
  onCancel?: () => void
  onSubmit?: (values: EndpointFormValues) => Promise<void> | void
  submitLabel?: string
}

export function EndpointForm({
  cancelLabel = 'Cancel',
  className,
  initialValues = { name: '' },
  onCancel,
  onSubmit,
  submitLabel = 'Create endpoint',
}: EndpointFormProps) {
  const form = useForm<EndpointFormValues>({
    defaultValues: initialValues,
    resolver: zodResolver(endpointFormSchema),
  })

  const watchedName = useWatch({ control: form.control, name: 'name' })

  const handleSubmit = async (values: EndpointFormValues) => {
    if (onSubmit) {
      await onSubmit(values)
    }
  }

  const isPending = form.formState.isSubmitting

  return (
    <Form
      className={cn('space-y-4', className)}
      noValidate
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <Field className="w-full gap-1.5" invalid={Boolean(fieldState.error)}>
            <FieldLabel htmlFor="endpoint-name" required>
              Endpoint name
            </FieldLabel>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <BrandIcon className="size-4" name={watchedName} />
              </InputGroupAddon>
              <InputGroupInput
                {...field}
                aria-describedby={
                  fieldState.error
                    ? 'endpoint-name-error'
                    : 'endpoint-name-description'
                }
                aria-invalid={fieldState.error ? 'true' : undefined}
                autoComplete="off"
                autoFocus
                id="endpoint-name"
                placeholder="e.g. Stripe Webhooks, GitHub Events"
              />
            </InputGroup>
            <FieldDescription id="endpoint-name-description">
              A friendly name to identify this webhook source.
            </FieldDescription>
            {fieldState.error && (
              <FieldError id="endpoint-name-error" match>
                {fieldState.error.message}
              </FieldError>
            )}
          </Field>
        )}
      />
      <div className="flex items-center justify-end gap-2 pt-2">
        {onCancel && (
          <Button
            disabled={isPending}
            onClick={onCancel}
            type="button"
            variant="outline"
          >
            {cancelLabel}
          </Button>
        )}
        <Button
          data-umami-event="Endpoint form submitted"
          data-umami-event-button-name="dashboard__endpoint-form__submit"
          disabled={isPending}
          loading={isPending}
          type="submit"
        >
          {submitLabel}
        </Button>
      </div>
    </Form>
  )
}

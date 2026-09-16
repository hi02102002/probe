import { CapturedBlock } from '../captured-block'

interface BodyTabProps {
  readonly body: unknown
  readonly contentType?: string
}

export function BodyTab({ body, contentType }: BodyTabProps) {
  return (
    <CapturedBlock
      label={contentType ?? 'Content type not captured'}
      value={body}
    />
  )
}

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/cn'
import { statusConfig } from '../constants/status-config'

interface Props {
  status?: keyof typeof statusConfig
}

export function EndpointStatus({ status }: Props) {
  const currentStatus = (status ?? 'inactive') as keyof typeof statusConfig
  const config = statusConfig[currentStatus] ?? statusConfig.inactive
  return (
    <div className="flex items-center">
      <Badge variant={config.variant}>
        <span
          aria-hidden="true"
          className={cn('size-1.5 rounded-full', config.dotColor)}
        />
        <span>{config.label}</span>
      </Badge>
    </div>
  )
}

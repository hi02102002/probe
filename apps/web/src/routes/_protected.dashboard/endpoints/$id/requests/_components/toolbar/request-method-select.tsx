import { useQueryStates } from 'nuqs'
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { REQUEST_METHODS, requestSearchParams } from '../../_utils/search-params'

export function RequestMethodSelect() {
  const [params, setParams] = useQueryStates(requestSearchParams)

  return (
    <Select
      items={[
        { label: 'All methods', value: 'ALL' },
        ...REQUEST_METHODS.map(method => ({ label: method, value: method })),
      ]}
      onValueChange={(value) => {
        const method = REQUEST_METHODS.find(candidate => candidate === value)
        setParams({ method: method ?? null, requestId: null })
      }}
      value={params.method ?? 'ALL'}
    >
      <SelectTrigger className="w-36">
        <SelectValue placeholder="All methods" />
      </SelectTrigger>
      <SelectPopup>
        <SelectItem value="ALL">All methods</SelectItem>
        {REQUEST_METHODS.map(method => (
          <SelectItem key={method} value={method}>{method}</SelectItem>
        ))}
      </SelectPopup>
    </Select>
  )
}

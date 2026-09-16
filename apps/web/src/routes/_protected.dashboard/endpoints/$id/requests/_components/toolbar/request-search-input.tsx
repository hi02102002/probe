import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { useQueryStates } from 'nuqs'
import { Input } from '@/components/ui/input'
import { requestSearchParams } from '../../_utils/search-params'

export function RequestSearchInput() {
  const [params, setParams] = useQueryStates(requestSearchParams)

  return (
    <div className="relative w-full min-w-0 max-w-md flex-1 sm:min-w-56">
      <MagnifyingGlassIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        aria-label="Search captured requests"
        className="pl-9"
        onChange={event => setParams({ query: event.target.value, requestId: null })}
        placeholder="Search by request ID or URL..."
        value={params.query}
      />
    </div>
  )
}

import { MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react'
import { useQueryStates } from 'nuqs'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { requestSearchParams } from '../../_utils/search-params'

export function RequestSearchInput() {
  const [params, setParams] = useQueryStates(requestSearchParams)

  return (
    <InputGroup className="w-full sm:w-60">
      <InputGroupAddon align="inline-start">
        <MagnifyingGlassIcon className="size-4 text-muted-foreground" />
      </InputGroupAddon>
      <InputGroupInput
        aria-label="Search captured requests"
        onChange={event => setParams({ query: event.target.value || null, requestId: null })}
        placeholder="Search requests..."
        value={params.query ?? ''}
      />
      {Boolean(params.query) && (
        <InputGroupAddon align="inline-end" className="me-0">
          <button
            aria-label="Clear search"
            className="inline-flex size-5 cursor-pointer items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none [&_svg]:mx-0"
            onClick={() => setParams({ query: null, requestId: null })}
            type="button"
          >
            <XIcon className="size-3.5" />
          </button>
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}

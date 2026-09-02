'use client'

import { MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react'
import { useQueryStates } from 'nuqs'
import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { endpointSearchParams } from '../../search-params'

export function EndpointsToolbar() {
  const [params, setParams] = useQueryStates(endpointSearchParams)

  const hasFilters = Boolean(params.query || params.status)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <InputGroup className="w-full sm:max-w-xs">
          <InputGroupAddon align="inline-start">
            <MagnifyingGlassIcon className="size-4 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            onChange={(e) => {
              setParams({
                page: 1,
                query: e.target.value || null,
              })
            }}
            placeholder="Search endpoints..."
            value={params.query ?? ''}
          />
          {Boolean(params.query) && (
            <InputGroupAddon align="inline-end">
              <button
                aria-label="Clear search"
                className="cursor-pointer rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setParams({ page: 1, query: null })}
                type="button"
              >
                <XIcon className="size-3.5" />
              </button>
            </InputGroupAddon>
          )}
        </InputGroup>

        <Select
          onValueChange={(val) => {
            setParams({
              page: 1,
              status: val === 'all' || !val ? null : (val as 'active' | 'inactive' | 'paused'),
            })
          }}
          value={params.status ?? 'all'}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectPopup>
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <span>All Status</span>
              </div>
            </SelectItem>
            <SelectItem value="active">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span>Active</span>
              </div>
            </SelectItem>
            <SelectItem value="inactive">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-muted-foreground/64" />
                <span>Inactive</span>
              </div>
            </SelectItem>
            <SelectItem value="paused">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-amber-500" />
                <span>Paused</span>
              </div>
            </SelectItem>
          </SelectPopup>
        </Select>

        {hasFilters && (
          <Button
            onClick={() => setParams({ page: 1, query: null, status: null })}
            variant="ghost"
          >
            <XIcon className="size-3.5" />
            <span>Reset filters</span>
          </Button>
        )}
      </div>
    </div>
  )
}

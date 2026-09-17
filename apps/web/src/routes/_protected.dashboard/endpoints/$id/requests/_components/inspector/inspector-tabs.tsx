import type { InspectorTab } from '../../_types'
import { useQueryStates } from 'nuqs'
import { requestSearchParams } from '../../_utils/search-params'

interface InspectorTabsProps {
  readonly headersCount: number
  readonly queryCount: number
}

export function InspectorTabs({ headersCount, queryCount }: InspectorTabsProps) {
  const [params, setParams] = useQueryStates(requestSearchParams)
  const activeTab: InspectorTab = params.tab ?? 'body'

  const tabs: readonly { readonly label: string, readonly value: InspectorTab }[] = [
    { label: 'Body', value: 'body' },
    { label: `Headers (${headersCount})`, value: 'headers' },
    { label: `Query (${queryCount})`, value: 'query' },
    { label: 'Response', value: 'response' },
  ]

  return (
    <div className="overflow-x-auto border-b border-border px-4 pt-2 sm:px-6">
      <div aria-label="Request detail sections" className="flex min-w-max gap-4" role="tablist">
        {tabs.map(tab => (
          <button
            aria-selected={activeTab === tab.value}
            className={`border-b-2 pb-2.5 text-xs font-medium transition-colors ${
              activeTab === tab.value
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            data-umami-event="Inspector tab clicked"
            data-umami-event-button-name={`dashboard__inspector__${tab.value}-tab`}
            data-umami-event-tab={tab.value}
            key={tab.value}
            onClick={() => setParams({ tab: tab.value })}
            role="tab"
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}

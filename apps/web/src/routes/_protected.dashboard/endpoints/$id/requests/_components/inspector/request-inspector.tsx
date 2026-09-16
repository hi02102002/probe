import type { RequestDetail } from '../../_types'
import { useQueryStates } from 'nuqs'
import {
  capturedEntries,
  createCurlCommand,
  getQueryEntries,
} from '../../_utils/request-utils'
import { requestSearchParams } from '../../_utils/search-params'
import { InspectorEmpty } from './inspector-empty'
import { InspectorHeader } from './inspector-header'
import { InspectorSkeleton } from './inspector-skeleton'
import { InspectorTabs } from './inspector-tabs'
import { BodyTab } from './tabs/body-tab'
import { HeadersTab } from './tabs/headers-tab'
import { QueryTab } from './tabs/query-tab'
import { ResponseTab } from './tabs/response-tab'

interface RequestInspectorProps {
  readonly endpointId: string
  readonly isLoading: boolean
  readonly request?: RequestDetail
}

export function RequestInspector({
  endpointId,
  isLoading,
  request,
}: RequestInspectorProps) {
  const [params] = useQueryStates(requestSearchParams)
  const activeTab = params.tab ?? 'body'

  if (isLoading) {
    return <InspectorSkeleton />
  }

  if (!request) {
    return <InspectorEmpty />
  }

  const headers = capturedEntries(request.reqHeaders)
  const query = getQueryEntries(request.url)
  const curl = createCurlCommand({
    body: request.reqBody,
    headers: request.reqHeaders,
    method: request.method,
    url: request.url,
  })

  const contentType = headers.find(([key]) => key.toLowerCase() === 'content-type')?.[1]

  return (
    <section className="flex min-h-130 flex-col overflow-hidden rounded-xl border border-border bg-card lg:col-span-8">
      <InspectorHeader curl={curl} endpointId={endpointId} request={request} />
      <InspectorTabs headersCount={headers.length} queryCount={query.length} />

      <div className="flex-1 overflow-auto p-4 sm:p-6">
        {activeTab === 'body' && <BodyTab body={request.reqBody} contentType={contentType} />}
        {activeTab === 'headers' && <HeadersTab headers={headers} />}
        {activeTab === 'query' && <QueryTab query={query} />}
        {activeTab === 'response' && <ResponseTab request={request} />}
      </div>
    </section>
  )
}

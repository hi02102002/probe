import type { MockRequest } from './_data'
import {
  ArrowClockwiseIcon,
  ChartBarIcon,
  PulseIcon,
  SlidersHorizontalIcon,
} from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { AppShell } from '@/components/layouts/dashboard'
import { Tabs, TabsList, TabsPanel, TabsTab } from '@/components/ui/tabs'
import { generateAppSeo } from '@/lib/seo'
import { EndpointHeader } from './_components/endpoint-header'
import { OverviewTab } from './_components/overview-tab'
import { ReplayTab } from './_components/replay-tab'
import { RequestsTab } from './_components/requests-tab'
import { RulesTab } from './_components/rules-tab'
import { MOCK_ENDPOINT, MOCK_REQUESTS } from './_data'

export const Route = createFileRoute(
  '/_protected/dashboard/endpoints_/mock/$endpointId',
)({
  component: EndpointDetailPage,
  head: () => generateAppSeo({
    description: 'Inspect and manage an endpoint.',
    pathname: '/dashboard/endpoints',
    robots: {
      follow: false,
      index: false,
    },
    title: 'Endpoint details',
  }),
})

function EndpointDetailPage() {
  const { endpointId } = Route.useParams()
  const [activeTab, setActiveTab] = useState<string>('overview')
  const [selectedRequestForReplay, setSelectedRequestForReplay] = useState<MockRequest | null>(null)

  const endpoint = {
    ...MOCK_ENDPOINT,
    id: endpointId,
  }

  function handleReplayRequest(request: MockRequest) {
    setSelectedRequestForReplay(request)
    setActiveTab('replay')
  }

  return (
    <AppShell className="max-w-6xl pb-16">
      <div className="flex flex-col gap-6">
        <EndpointHeader endpoint={endpoint} />

        <Tabs
          className="w-full"
          onValueChange={val => setActiveTab(val as string)}
          value={activeTab}
        >
          <TabsList className="h-10 p-1" size="default" variant="default">
            <TabsTab className="gap-2 px-3 text-xs sm:text-sm font-medium" value="overview">
              <ChartBarIcon className="size-4 shrink-0" />
              <span>Overview</span>
            </TabsTab>
            <TabsTab className="gap-2 px-3 text-xs sm:text-sm font-medium" value="requests">
              <PulseIcon className="size-4 shrink-0" />
              <span>Requests</span>
              <span className="rounded-full bg-primary/10 px-1.5 py-0.2 font-mono text-[10px] text-primary">
                {MOCK_REQUESTS.length}
              </span>
            </TabsTab>
            <TabsTab className="gap-2 px-3 text-xs sm:text-sm font-medium" value="replay">
              <ArrowClockwiseIcon className="size-4 shrink-0" />
              <span>Replay</span>
            </TabsTab>
            <TabsTab className="gap-2 px-3 text-xs sm:text-sm font-medium" value="rules">
              <SlidersHorizontalIcon className="size-4 shrink-0" />
              <span>Rules</span>
              <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.2 font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                2
              </span>
            </TabsTab>
          </TabsList>

          <TabsPanel className="pt-4" value="overview">
            <OverviewTab
              endpoint={endpoint}
              onSelectTab={setActiveTab}
              requests={MOCK_REQUESTS}
            />
          </TabsPanel>

          <TabsPanel className="pt-4" value="requests">
            <RequestsTab
              onReplayRequest={handleReplayRequest}
              requests={MOCK_REQUESTS}
            />
          </TabsPanel>

          <TabsPanel className="pt-4" value="replay">
            <ReplayTab initialRequest={selectedRequestForReplay} />
          </TabsPanel>

          <TabsPanel className="pt-4" value="rules">
            <RulesTab />
          </TabsPanel>
        </Tabs>
      </div>
    </AppShell>
  )
}

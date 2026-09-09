import type { MockRequest } from '../_data'
import {
  ArrowClockwiseIcon,
  MagnifyingGlassIcon,
} from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/ui/copy-button'
import { Input } from '@/components/ui/input'
import { toastManager } from '@/components/ui/toast'
import { formatRelativeTime } from '@/lib/dayjs'

interface RequestsTabProps {
  onReplayRequest: (request: MockRequest) => void
  requests: MockRequest[]
}

export function RequestsTab({ onReplayRequest, requests }: RequestsTabProps) {
  const [selectedId, setSelectedId] = useState<string>(requests[0]?.id ?? '')
  const [search, setSearch] = useState('')
  const [methodFilter, setMethodFilter] = useState<'ALL' | 'GET' | 'POST'>('ALL')
  const [activeSubTab, setActiveSubTab] = useState<'body' | 'headers' | 'query' | 'response'>('body')

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesSearch
        = search === ''
          || req.id.toLowerCase().includes(search.toLowerCase())
          || req.path.toLowerCase().includes(search.toLowerCase())
          || JSON.stringify(req.body).toLowerCase().includes(search.toLowerCase())

      const matchesMethod = methodFilter === 'ALL' || req.method === methodFilter

      return matchesSearch && matchesMethod
    })
  }, [requests, search, methodFilter])

  const selectedRequest = requests.find(r => r.id === selectedId) ?? requests[0]

  const generatedCurl = selectedRequest
    ? `curl -X ${selectedRequest.method} "https://api.probe.dev${selectedRequest.path}" \\
${Object.entries(selectedRequest.headers)
  .map(([k, v]) => `  -H "${k}: ${v}"`)
  .join(' \\\n')}${
  selectedRequest.body
    ? ` \\\n  -d '${typeof selectedRequest.body === 'object' ? JSON.stringify(selectedRequest.body) : selectedRequest.body}'`
    : ''
}`
    : ''

  return (
    <div className="flex flex-col gap-4">
      {/* Top Filter & Live Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <div className="relative w-full">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9 h-9 text-xs sm:text-sm"
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by ID, path, or payload..."
              value={search}
            />
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/30 p-0.5">
            {(['ALL', 'POST', 'GET'] as const).map(m => (
              <button
                key={m}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  methodFilter === m
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setMethodFilter(m)}
                type="button"
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Live capture status indicator */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-medium text-foreground">Listening for webhooks</span>
          <span>
            (
            {filteredRequests.length}
            {' '}
            events)
          </span>
        </div>
      </div>

      {/* 2-Column Split View: List on Left, Details on Right */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 min-h-[580px]">
        {/* Left Column: Requests List */}
        <div className="flex flex-col rounded-xl border border-border bg-card lg:col-span-4 max-h-[680px] overflow-hidden">
          <div className="border-b border-border bg-muted/30 px-3.5 py-2.5 text-xs font-medium text-muted-foreground">
            Captured Events
          </div>
          <div className="flex-1 divide-y divide-border overflow-y-auto">
            {filteredRequests.length === 0
              ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground text-xs">
                    No matching webhook requests found.
                  </div>
                )
              : (
                  filteredRequests.map((req) => {
                    const isSelected = req.id === selectedId
                    const isSuccess = req.status >= 200 && req.status < 300

                    return (
                      <div
                        key={req.id}
                        className={`flex flex-col gap-1.5 p-3.5 cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-primary/5 border-l-2 border-l-primary'
                            : 'hover:bg-muted/30'
                        }`}
                        onClick={() => setSelectedId(req.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge
                              className="font-mono text-[10px]"
                              variant={isSuccess ? 'success' : 'destructive'}
                            >
                              {req.status}
                            </Badge>
                            <span className="font-mono font-semibold text-foreground text-xs">
                              {req.method}
                            </span>
                          </div>
                          <span className="font-mono text-muted-foreground text-[11px]">
                            {formatRelativeTime(req.timestamp)}
                          </span>
                        </div>

                        <div className="truncate font-mono text-muted-foreground text-xs">
                          {req.path}
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                          <span>
                            {req.durationMs}
                            ms
                          </span>
                          <span>{req.sizeBytes > 0 ? `${req.sizeBytes} B` : 'Empty'}</span>
                        </div>
                      </div>
                    )
                  })
                )}
          </div>
        </div>

        {/* Right Column: Request Detail Inspector */}
        <div className="flex flex-col rounded-xl border border-border bg-card lg:col-span-8 overflow-hidden">
          {selectedRequest
            ? (
                <div className="flex flex-col h-full">
                  {/* Detail Header Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/20 px-4 py-3 sm:px-6">
                    <div className="flex items-center gap-3">
                      <Badge
                        className="font-mono font-bold text-xs"
                        variant={selectedRequest.status >= 200 && selectedRequest.status < 300 ? 'success' : 'destructive'}
                      >
                        {selectedRequest.status}
                      </Badge>
                      <span className="font-mono font-bold text-foreground text-sm">
                        {selectedRequest.method}
                      </span>
                      <span className="font-mono text-muted-foreground text-xs sm:text-sm truncate max-w-xs">
                        {selectedRequest.path}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <CopyButton
                        label="cURL"
                        size="sm"
                        text={generatedCurl}
                        variant="outline"
                      />
                      <Button
                        onClick={() => {
                          onReplayRequest(selectedRequest)
                          toastManager.add({
                            title: 'Request loaded into Replay',
                            description: `Ready to resend ${selectedRequest.id}`,
                            type: 'info',
                          })
                        }}
                        size="sm"
                      >
                        <ArrowClockwiseIcon className="size-3.5 shrink-0" weight="bold" />
                        <span>Replay</span>
                      </Button>
                    </div>
                  </div>

                  {/* Subtabs Header */}
                  <div className="border-b border-border px-4 sm:px-6 pt-2">
                    <div className="flex items-center gap-4 text-xs font-medium">
                      <button
                        className={`pb-2.5 transition-colors border-b-2 ${
                          activeSubTab === 'body'
                            ? 'border-primary text-foreground'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                        onClick={() => setActiveSubTab('body')}
                        type="button"
                      >
                        Payload / Body
                      </button>
                      <button
                        className={`pb-2.5 transition-colors border-b-2 ${
                          activeSubTab === 'headers'
                            ? 'border-primary text-foreground'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                        onClick={() => setActiveSubTab('headers')}
                        type="button"
                      >
                        Headers (
                        {Object.keys(selectedRequest.headers).length}
                        )
                      </button>
                      <button
                        className={`pb-2.5 transition-colors border-b-2 ${
                          activeSubTab === 'query'
                            ? 'border-primary text-foreground'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                        onClick={() => setActiveSubTab('query')}
                        type="button"
                      >
                        Query Params (
                        {Object.keys(selectedRequest.queryParams).length}
                        )
                      </button>
                      <button
                        className={`pb-2.5 transition-colors border-b-2 ${
                          activeSubTab === 'response'
                            ? 'border-primary text-foreground'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                        onClick={() => setActiveSubTab('response')}
                        type="button"
                      >
                        Returned Response (
                        {selectedRequest.response.status}
                        )
                      </button>
                    </div>
                  </div>

                  {/* Subtab Content Area */}
                  <div className="flex-1 p-4 sm:p-6 overflow-y-auto max-h-[520px]">
                    {activeSubTab === 'body' && (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            Content-Type:
                            {' '}
                            {selectedRequest.headers['content-type'] ?? 'application/json'}
                          </span>
                          <CopyButton
                            size="xs"
                            text={typeof selectedRequest.body === 'object' ? JSON.stringify(selectedRequest.body, null, 2) : selectedRequest.body}
                            variant="ghost"
                          />
                        </div>
                        <div className="rounded-lg border border-border bg-muted/40 p-4 font-mono text-foreground text-xs leading-relaxed overflow-x-auto">
                          <pre>
                            {typeof selectedRequest.body === 'object'
                              ? JSON.stringify(selectedRequest.body, null, 2)
                              : selectedRequest.body || '(Empty body)'}
                          </pre>
                        </div>
                      </div>
                    )}

                    {activeSubTab === 'headers' && (
                      <div className="rounded-lg border border-border overflow-hidden">
                        <table className="w-full text-left font-mono text-xs">
                          <thead className="bg-muted/40 border-b border-border text-muted-foreground">
                            <tr>
                              <th className="px-4 py-2.5 font-medium">Header Key</th>
                              <th className="px-4 py-2.5 font-medium">Value</th>
                              <th className="w-10 px-2 py-2.5 text-right"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {Object.entries(selectedRequest.headers).map(([k, v]) => (
                              <tr key={k} className="hover:bg-muted/20">
                                <td className="px-4 py-2.5 font-semibold text-primary">{k}</td>
                                <td className="px-4 py-2.5 text-foreground truncate max-w-md">{String(v)}</td>
                                <td className="px-2 py-2.5 text-right">
                                  <CopyButton size="icon-xs" text={String(v)} variant="ghost" />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {activeSubTab === 'query' && (
                      <div className="rounded-lg border border-border overflow-hidden">
                        {Object.keys(selectedRequest.queryParams).length === 0
                          ? (
                              <div className="p-6 text-center text-muted-foreground text-xs">
                                No query parameters in this request.
                              </div>
                            )
                          : (
                              <table className="w-full text-left font-mono text-xs">
                                <thead className="bg-muted/40 border-b border-border text-muted-foreground">
                                  <tr>
                                    <th className="px-4 py-2.5 font-medium">Key</th>
                                    <th className="px-4 py-2.5 font-medium">Value</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                  {Object.entries(selectedRequest.queryParams).map(([k, v]) => (
                                    <tr key={k}>
                                      <td className="px-4 py-2.5 font-semibold text-primary">{k}</td>
                                      <td className="px-4 py-2.5 text-foreground">{String(v)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                      </div>
                    )}

                    {activeSubTab === 'response' && (
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4 rounded-lg border border-border bg-muted/20 p-3">
                          <Badge variant={selectedRequest.response.status >= 200 && selectedRequest.response.status < 300 ? 'success' : 'destructive'}>
                            {selectedRequest.response.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Returned in
                            {' '}
                            {selectedRequest.durationMs}
                            ms
                          </span>
                        </div>
                        <div className="rounded-lg border border-border bg-muted/40 p-4 font-mono text-foreground text-xs leading-relaxed overflow-x-auto">
                          <pre>
                            {typeof selectedRequest.response.body === 'object'
                              ? JSON.stringify(selectedRequest.response.body, null, 2)
                              : selectedRequest.response.body}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            : (
                <div className="flex flex-1 items-center justify-center p-12 text-center text-muted-foreground text-sm">
                  Select a request from the left list to inspect details.
                </div>
              )}
        </div>
      </div>
    </div>
  )
}

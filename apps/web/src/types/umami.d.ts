export interface UmamiTracker {
  track: {
    (): void
    (payload: Record<string, unknown>): void
    (eventName: string, eventData?: Record<string, unknown>): void
    (customFn: (props: Record<string, unknown>) => Record<string, unknown>): void
  }
  identify: {
    (userId: string, sessionData?: Record<string, unknown>): void
    (sessionData: Record<string, unknown>): void
  }
}

declare global {
  interface Window {
    umami?: UmamiTracker
  }
}

export {}

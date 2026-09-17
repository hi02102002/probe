import { useEffect } from 'react'

export function useUmamiLinkTracker() {
  useEffect(() => {
    const handleLinkClick = (event: MouseEvent) => {
      // Don't track if the click was prevented or not a primary click
      if (
        event.defaultPrevented
        || event.button !== 0
        || event.metaKey
        || event.ctrlKey
        || event.shiftKey
        || event.altKey
      ) {
        return
      }

      const target = event.target as Element | null
      const linkElement = target?.closest<HTMLElement>('[data-umami-link-event]')
      if (!linkElement) {
        return
      }

      const eventName = linkElement.getAttribute('data-umami-link-event')
      if (!eventName) {
        return
      }

      const data: Record<string, string> = {}
      for (const attrName of linkElement.getAttributeNames()) {
        if (attrName.startsWith('data-umami-event-')) {
          const key = attrName.slice(17) // length of 'data-umami-event-'
          const val = linkElement.getAttribute(attrName)
          if (val !== null) {
            data[key] = val
          }
        }
      }

      if (typeof window !== 'undefined' && window.umami) {
        void window.umami.track(
          eventName,
          Object.keys(data).length > 0 ? data : undefined,
        )
      }
    }

    document.addEventListener('click', handleLinkClick)
    return () => {
      document.removeEventListener('click', handleLinkClick)
    }
  }, [])
}

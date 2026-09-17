import type { BlogPostHeading } from 'content-collections'
import { CheckIcon, ShareNetworkIcon } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/cn'

export interface BlogSidebarProps {
  headings?: BlogPostHeading[]
  copiedUrl: boolean
  onCopyLink: () => void
  className?: string
}

export function BlogSidebar({
  headings = [],
  copiedUrl,
  onCopyLink,
  className,
}: BlogSidebarProps) {
  const [activeId, setActiveId] = useState<string>('')

  // Scroll spy to highlight active heading in TOC
  useEffect(() => {
    if (!headings.length)
      return

    const handleScroll = () => {
      const headingElements = headings
        .map(h => document.getElementById(h.id))
        .filter((el): el is HTMLElement => el !== null)

      const scrollPosition = window.scrollY + 120

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i]
        if (el.offsetTop <= scrollPosition) {
          setActiveId(el.id)
          return
        }
      }

      if (headingElements.length > 0 && window.scrollY < 200) {
        setActiveId(headingElements[0].id)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    const timer = setTimeout(handleScroll, 0)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timer)
    }
  }, [headings])

  return (
    <aside className={cn('hidden w-72 shrink-0 p-6 lg:block', className)}>
      <div className="sticky top-20 space-y-8">
        {/* Table of Contents */}
        {headings.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent-foreground">
              On this page
            </p>
            <nav className="mt-4 space-y-1 border-l border-border/80">
              {headings.map((h) => {
                const isActive = activeId === h.id
                return (
                  <a
                    key={h.id}
                    href={`#${h.id}`}
                    data-umami-event="Sidebar toc item clicked"
                    data-umami-event-button-name="blog__sidebar__toc-item"
                    className={cn(
                      'block border-l -ml-px py-1 text-xs leading-5 transition-colors',
                      isActive
                        ? 'border-accent-foreground font-medium text-foreground'
                        : 'border-transparent text-muted-foreground hover:text-foreground',
                      h.level === 3 ? 'pl-5' : 'pl-3',
                    )}
                  >
                    {h.title}
                  </a>
                )
              })}
            </nav>
          </div>
        )}

        {/* Sidebar Quick Widget using Card */}
        <Card className="border-border bg-card/60 shadow-xs">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Try it in Probe
            </CardTitle>
            <CardDescription className="mt-2 text-xs leading-relaxed text-foreground">
              Get a live inspection endpoint and capture incoming payloads in seconds.
            </CardDescription>
          </CardHeader>
          <CardPanel className="p-4 pt-2">
            <Button
              className="w-full"
              data-umami-event="Sidebar open dashboard clicked"
              data-umami-event-button-name="blog__sidebar__open-dashboard"
              render={<Link to="/dashboard" />}
              size="sm"
            >
              Open Dashboard
            </Button>
          </CardPanel>
        </Card>

        {/* Share article */}
        <Separator />
        <div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCopyLink}
            data-umami-event="Sidebar share guide clicked"
            data-umami-event-button-name="blog__sidebar__share-guide"
            className="w-full justify-start gap-2 text-xs text-muted-foreground hover:text-foreground"
          >
            {copiedUrl ? <CheckIcon className="size-4 text-success" /> : <ShareNetworkIcon className="size-4" />}
            <span>{copiedUrl ? 'Link Copied!' : 'Share this guide'}</span>
          </Button>
        </div>
      </div>
    </aside>
  )
}

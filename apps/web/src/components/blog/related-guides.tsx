import type { BlogPost } from 'content-collections'
import { ArrowRightIcon, BookOpenIcon } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/cn'
import { dayjs } from '@/lib/dayjs'

export interface RelatedGuidesProps {
  posts: BlogPost[]
  className?: string
}

function formatDate(value: string) {
  return dayjs(value).format('MMMM D, YYYY')
}

export function RelatedGuides({ posts, className }: RelatedGuidesProps) {
  if (!posts.length)
    return null

  return (
    <section className={cn('border-t border-border bg-muted/10 p-6 sm:p-10', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
          <BookOpenIcon weight="fill" className="size-4" />
          <span>More Webhook Guides</span>
        </div>
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          data-umami-event-button-name="blog__related__all-articles"
          data-umami-link-event="Related guides view all clicked"
        >
          <span>All articles</span>
          <ArrowRightIcon className="size-3" />
        </Link>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {posts.map(related => (
          <Card
            key={related.slug}
            className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-xs transition-all hover:border-primary/40 hover:bg-card/80 sm:p-7"
          >
            <CardHeader className="p-0">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-success/80" />
                  {formatDate(related.publishedAt)}
                </span>
                <span className="font-medium">
                  {related.readingTime}
                  {' '}
                  min read
                </span>
              </div>
              <CardTitle className="mt-3.5 text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent-foreground sm:text-lg">
                <Link
                  to="/blog/$slug"
                  params={{ slug: related.slug }}
                  className="after:absolute after:inset-0 hover:underline"
                  data-umami-event-button-name="blog__related__read-guide"
                  data-umami-event-slug={related.slug}
                  data-umami-link-event="Related guide clicked"
                >
                  {related.title}
                </Link>
              </CardTitle>
              <CardDescription className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {related.description}
              </CardDescription>
            </CardHeader>
            <CardPanel className="p-0 pt-5">
              <div className="flex items-center justify-between border-t border-border/60 pt-3.5">
                <div className="flex flex-wrap gap-1.5">
                  {related.tags.slice(0, 2).map(tag => (
                    <Badge
                      key={tag}
                      variant="outline"
                      size="sm"
                      className="text-xs font-normal"
                    >
                      #
                      {tag}
                    </Badge>
                  ))}
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-accent-foreground transition-transform group-hover:translate-x-1">
                  Read guide
                  <ArrowRightIcon className="size-3" weight="bold" />
                </span>
              </div>
            </CardPanel>
          </Card>
        ))}
      </div>
    </section>
  )
}

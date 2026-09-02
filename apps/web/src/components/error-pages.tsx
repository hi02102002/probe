import type { NotFoundRouteProps } from '@tanstack/react-router'
import type { ReactElement } from 'react'
import { ArrowLeftIcon, ArrowsClockwiseIcon } from '@phosphor-icons/react'
import { Link, useRouter } from '@tanstack/react-router'
import { StatusPage } from '@/components/status-page'
import { Button } from '@/components/ui/button'

export function NotFoundPage(props: { homeLink?: ReactElement } | NotFoundRouteProps) {
  const homeLink = 'homeLink' in props && props.homeLink
    ? props.homeLink
    : <a aria-label="Back to home" href="/" />

  return (
    <StatusPage
      actions={(
        <Button
          render={homeLink}
        >
          <ArrowLeftIcon />
          Back to home
        </Button>
      )}
      code="404"
      description="The page you are looking for does not exist or may have moved. Check the URL or return to the home page."
      title="Page not found"
    />
  )
}

export function LocalizedNotFound() {
  return <NotFoundPage homeLink={<Link to="/" />} />
}

export function BadGatewayPage({ onRetry }: { onRetry: () => void }) {
  return (
    <StatusPage
      actions={(
        <>
          <Button onClick={onRetry}>
            <ArrowsClockwiseIcon />
            Try again
          </Button>
          <Button
            render={<a aria-label="Back to home" href="/" />}
            variant="outline"
          >
            Back to home
          </Button>
        </>
      )}
      code="502"
      description="The app could not reach an upstream service. This is usually temporary, so wait a moment and try again."
      title="Service temporarily unavailable"
    />
  )
}

export function RootErrorPage() {
  const router = useRouter()

  return (
    <BadGatewayPage
      onRetry={() => {
        void router.invalidate()
      }}
    />
  )
}

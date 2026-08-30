import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '@/features/home'
import { generateAppSeo } from '@/lib/seo'

export const Route = createFileRoute('/{-$locale}/(marketing)/')({
  component: HomePage,
  head: () => generateAppSeo({
    pathname: '/',
  }),
})

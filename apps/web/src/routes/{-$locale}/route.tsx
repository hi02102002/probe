import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { validatePrefix } from 'intlayer'
import { LocalizedNotFound } from '@/components/error-pages'

export const Route = createFileRoute('/{-$locale}')({
  beforeLoad: ({ params }) => {
    const { isValid, localePrefix } = validatePrefix(params.locale)
    const isDeclaredLocale = params.locale === undefined
      || params.locale === 'en'
      || params.locale === 'vi'

    if (!isValid || !isDeclaredLocale) {
      throw redirect({
        params: { locale: localePrefix },
        to: '/{-$locale}/404',
      })
    }
  },
  component: Outlet,
  notFoundComponent: LocalizedNotFound,
})

import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { NotFoundComponent } from './404'

export const Route = createFileRoute('/{-$locale}')({
  beforeLoad: async ({ params }) => {
    const { validatePrefix } = await import('intlayer')
    const { isValid, localePrefix } = validatePrefix(params.locale)
    const isDeclaredLocale = params.locale === undefined
      || params.locale === 'en'
      || params.locale === 'vi'

    if (!isValid || !isDeclaredLocale) {
      throw redirect({
        to: '/{-$locale}/404',
        params: { locale: localePrefix },
      })
    }
  },
  component: Outlet,
  notFoundComponent: NotFoundComponent,
})

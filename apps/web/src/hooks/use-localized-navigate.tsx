import type { StripLocalePrefix } from '@/components/localized-link'
import type { FileRouteTypes } from '@/routeTree.gen'
import { useNavigate } from '@tanstack/react-router'
import { getPrefix } from 'intlayer'
import { useLocale } from 'react-intlayer'
import { LOCALE_ROUTE } from '@/components/localized-link'

type NavigateFn = ReturnType<typeof useNavigate>
type BaseNavigateOptions = Parameters<NavigateFn>[0]
type LocalizedTo = StripLocalePrefix<FileRouteTypes['to']>

export type LocalizedNavigateOptions = Omit<
  BaseNavigateOptions,
  'to' | 'params'
> & {
  to: LocalizedTo
  params?: Omit<NonNullable<BaseNavigateOptions['params']>, 'locale'>
}

type LocalizedNavigate = (
  options: LocalizedNavigateOptions,
) => ReturnType<NavigateFn>

export function useLocalizedNavigate() {
  const navigate = useNavigate()
  const { locale } = useLocale()

  const localizedNavigate: LocalizedNavigate = (args: any) => {
    const { localePrefix } = getPrefix(locale)
    const { to, ...rest } = args

    return navigate({
      ...rest,
      to: `/${LOCALE_ROUTE}${to}`,
      params: { locale: localePrefix, ...rest.params },
    } as any)
  }

  return localizedNavigate
}

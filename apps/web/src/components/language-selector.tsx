import type { To } from '@/components/localized-link'
import { useLocation } from '@tanstack/react-router'
import { getPathWithoutLocale, getPrefix } from 'intlayer'
import { useLocale } from 'react-intlayer'
import { LocalizedLink } from '@/components/localized-link'
import { Button } from '@/components/ui/button'

export function LanguageSelector() {
  const { pathname } = useLocation()
  const { availableLocales, locale, setLocale } = useLocale()
  const pathWithoutLocale = getPathWithoutLocale(pathname)

  return (
    <div className="flex items-center gap-1.5">
      {availableLocales.map(itemLocale => (
        <Button
          key={itemLocale}
          className="px-2.5 py-1 text-xs"
          render={(
            <LocalizedLink
              aria-current={locale === itemLocale ? 'page' : undefined}
              params={{ locale: getPrefix(itemLocale).localePrefix }}
              to={pathWithoutLocale as To}
            />
          )}
          size="sm"
          variant={locale === itemLocale ? 'default' : 'outline'}
          onClick={() => setLocale(itemLocale)}
        >
          {itemLocale.toUpperCase()}
        </Button>
      ))}
    </div>
  )
}

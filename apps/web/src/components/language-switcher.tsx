'use client'

import type { LocalesValues } from 'intlayer'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { getPathWithoutLocale, getPrefix, Locales } from 'intlayer'
import { useIntlayer, useLocale } from 'react-intlayer'
import { cn } from '@/lib/cn'

const LANGUAGES: Array<{
  code: string
  locale: LocalesValues
}> = [
  {
    code: 'EN',
    locale: Locales.ENGLISH,
  },
  {
    code: 'VI',
    locale: Locales.VIETNAMESE,
  },
]

export function LanguageSwitcher({ className }: { className?: string }) {
  const content = useIntlayer('dashboard')
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { locale, setLocale } = useLocale()

  const handleLanguageChange = (newLocale: LocalesValues) => {
    if (newLocale === locale) {
      return
    }

    setLocale(newLocale)

    const pathWithoutLocale = getPathWithoutLocale(pathname)
    const { prefix } = getPrefix(newLocale)
    const targetPath = prefix ? `/${prefix}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}` : (pathWithoutLocale || '/')

    void navigate({
      replace: true,
      search: true,
      to: targetPath as any,
    })
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between px-2.5 py-1.5 text-sm',
        className,
      )}
    >
      <span className="font-normal text-muted-foreground text-xs sm:text-sm">
        {content.languageLabel.value}
      </span>
      <div
        aria-label={content.selectLanguage.value}
        className="inline-flex items-center gap-1 text-xs"
        role="radiogroup"
      >
        {LANGUAGES.map((lang, index) => {
          const isActive = locale === lang.locale
          return (
            <span className="inline-flex items-center gap-1" key={lang.locale}>
              {index > 0 && <span className="select-none text-muted-foreground/30">/</span>}
              <button
                aria-checked={isActive}
                aria-label={lang.code}
                className={cn(
                  'cursor-pointer rounded-xs px-1 py-0.5 text-xs transition-colors outline-none focus-visible:ring-1 focus-visible:ring-ring',
                  isActive
                    ? 'font-semibold text-foreground'
                    : 'font-normal text-muted-foreground/50 hover:text-foreground',
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  handleLanguageChange(lang.locale)
                }}
                role="radio"
                title={lang.code}
                type="button"
              >
                {lang.code}
              </button>
            </span>
          )
        })}
      </div>
    </div>
  )
}

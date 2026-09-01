import type { LocalesValues } from 'intlayer'
import { useLocation } from '@tanstack/react-router'
import { getPathWithoutLocale, getPrefix, Locales } from 'intlayer'
import { useLocale } from 'react-intlayer'
import { Button } from '@/components/ui/button'
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from '@/components/ui/menu'

const LANGUAGES: Array<{
  flag: string
  label: string
  locale: LocalesValues
}> = [
  {
    flag: '🇺🇸',
    label: 'English',
    locale: Locales.ENGLISH,
  },
  {
    flag: '🇻🇳',
    label: 'Tiếng Việt',
    locale: Locales.VIETNAMESE,
  },
]

export function LanguageSelector({ className }: { className?: string }) {
  const { pathname } = useLocation()
  const { locale, setLocale } = useLocale()

  const currentLanguage = LANGUAGES.find(l => l.locale === locale) ?? LANGUAGES[0]

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) {
      return
    }

    const selectedLocale = newLocale as LocalesValues
    setLocale(selectedLocale)

    const pathWithoutLocale = getPathWithoutLocale(pathname)
    const { prefix } = getPrefix(selectedLocale)
    const targetPath = prefix ? `/${prefix}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}` : (pathWithoutLocale || '/')
    const targetUrl = `${targetPath}${window.location.search}${window.location.hash}`

    window.location.href = targetUrl
  }

  return (
    <Menu>
      <MenuTrigger
        render={(
          <Button
            className={className}
            size="sm"
            variant="outline"
          >
            <span className="hidden items-center gap-1.5 sm:inline-flex">
              <span>{currentLanguage?.flag}</span>
              <span>{currentLanguage?.label}</span>
            </span>
            <span className="sm:hidden">{currentLanguage?.flag}</span>
          </Button>
        )}
      />
      <MenuPopup align="end" className="w-44" sideOffset={6}>
        <MenuGroup>
          <MenuGroupLabel>
            {locale === Locales.VIETNAMESE ? 'Chọn ngôn ngữ' : 'Select Language'}
          </MenuGroupLabel>
        </MenuGroup>
        <MenuSeparator className="-mx-1" />
        <MenuRadioGroup
          onValueChange={handleLanguageChange}
          value={locale}
        >
          {LANGUAGES.map(lang => (
            <MenuRadioItem
              key={lang.locale}
              value={lang.locale}
            >
              <span className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </span>
            </MenuRadioItem>
          ))}
        </MenuRadioGroup>
      </MenuPopup>
    </Menu>
  )
}

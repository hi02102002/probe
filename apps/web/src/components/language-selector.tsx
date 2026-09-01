import type { LocalesValues } from 'intlayer'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { getPathWithoutLocale, getPrefix, Locales } from 'intlayer'
import { useState } from 'react'
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

export function LanguageSelector({
  align = 'start',
  className,
}: {
  align?: 'center' | 'end' | 'start'
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { locale, setLocale } = useLocale()

  const currentLanguage = LANGUAGES.find(l => l.locale === locale) ?? LANGUAGES[0]

  const handleLanguageChange = (newLocale: string) => {
    setOpen(false)

    if (newLocale === locale) {
      return
    }

    const selectedLocale = newLocale as LocalesValues
    setLocale(selectedLocale)

    const pathWithoutLocale = getPathWithoutLocale(pathname)
    const { prefix } = getPrefix(selectedLocale)
    const targetPath = prefix ? `/${prefix}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}` : (pathWithoutLocale || '/')

    void navigate({
      replace: true,
      search: true,
      to: targetPath as any,
    })
  }

  return (
    <Menu onOpenChange={setOpen} open={open}>
      <MenuTrigger
        render={(
          <Button
            className={className}
            size="sm"
            variant="outline"
          >
            <span className="inline-flex items-center gap-1.5">
              <span>{currentLanguage?.flag}</span>
              <span>{currentLanguage?.label}</span>
            </span>
          </Button>
        )}
      />
      <MenuPopup align={align} className="w-44" sideOffset={6}>
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
              closeOnClick
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

import type { IntlayerConfig } from 'intlayer'
import { Locales } from 'intlayer'

const config: IntlayerConfig = {
  internationalization: {
    locales: [
      Locales.ENGLISH,
      Locales.VIETNAMESE,
    ],
    defaultLocale: Locales.ENGLISH,
  },
}

export default config

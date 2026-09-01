import type { Dictionary } from 'intlayer'
import { t } from 'intlayer'

const dashboardContent = {
  key: 'dashboard',
  content: {
    // Navigation
    endpointsNav: t({ en: 'Endpoints', vi: 'Endpoints' }),
    billingNav: t({ en: 'Billing', vi: 'Thanh toán' }),
    settingsNav: t({ en: 'Settings', vi: 'Cài đặt' }),

    // User Menu & Settings
    languageLabel: t({ en: 'Language', vi: 'Ngôn ngữ' }),
    selectLanguage: t({ en: 'Select language', vi: 'Chọn ngôn ngữ' }),
    logOut: t({ en: 'Log Out', vi: 'Đăng xuất' }),
    loggingOut: t({ en: 'Logging out…', vi: 'Đang đăng xuất…' }),
  },
} satisfies Dictionary

export default dashboardContent

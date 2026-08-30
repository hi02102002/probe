import type { Dictionary } from 'intlayer'
import { t } from 'intlayer'

const homeContent = {
  key: 'home',
  content: {
    badge: 'Probe',
    title: t({
      en: 'Capture requests. Inspect every detail.',
      vi: 'Ghi nhận request. Kiểm tra từng chi tiết.',
    }),
    description: t({
      en: 'Clean starter with TanStack Start, Hono, oRPC, Better Auth, Drizzle and PostgreSQL ready for the product layer.',
      vi: 'Bộ khởi tạo monorepo tinh gọn với TanStack Start, Hono, oRPC, Better Auth, Drizzle và PostgreSQL.',
    }),
    signIn: t({
      en: 'Sign in',
      vi: 'Đăng nhập',
    }),
    openDashboard: t({
      en: 'Open dashboard',
      vi: 'Mở bảng điều khiển',
    }),
  },
} satisfies Dictionary

export default homeContent

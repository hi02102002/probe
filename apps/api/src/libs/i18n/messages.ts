import type { translateFunction } from 'hono-intlayer'

export type I18nTranslator = ReturnType<typeof translateFunction>

export function createI18n(t: I18nTranslator) {
  return {
    common: {
      notFound: () =>
        t({
          en: 'Not found',
          vi: 'Không tìm thấy',
        }),
      internalServerError: () =>
        t({
          en: 'Internal server error',
          vi: 'Lỗi máy chủ nội bộ',
        }),
      unauthorized: () =>
        t({
          en: 'Unauthorized',
          vi: 'Không có quyền truy cập',
        }),
      forbidden: () =>
        t({
          en: 'Access denied',
          vi: 'Từ chối truy cập',
        }),
      badRequest: () =>
        t({
          en: 'Bad request',
          vi: 'Yêu cầu không hợp lệ',
        }),
    },

    /**
     * Placeholders & Dynamic messages
     */
    placeholder: {
      // Dynamic resource not found: "User not found" / "Không tìm thấy User"
      resourceNotFound: (resource: string) =>
        t({
          en: `${resource} not found`,
          vi: `Không tìm thấy ${resource}`,
        }),

      // Dynamic field validation: "Field 'email' is required"
      fieldRequired: (fieldName: string) =>
        t({
          en: `Field '${fieldName}' is required`,
          vi: `Trường '${fieldName}' là bắt buộc`,
        }),

      // Dynamic greeting: "Welcome back, Huy!"
      welcomeUser: (name: string) =>
        t({
          en: `Welcome back, ${name}!`,
          vi: `Chào mừng bạn trở lại, ${name}!`,
        }),

      // Count / Pluralization helper
      itemCount: (count: number) =>
        t({
          en: `${count} item(s) found`,
          vi: `Tìm thấy ${count} mục`,
        }),
    },
  }
}

import type { Dictionary } from 'intlayer'
import { t } from 'intlayer'

const authContent = {
  key: 'auth',
  content: {
    // Layout
    termsPrefix: t({ en: 'By continuing, you agree to our', vi: 'Bằng việc tiếp tục, bạn đồng ý với' }),
    termsOfService: t({ en: 'Terms of Service', vi: 'Điều khoản dịch vụ' }),
    termsAnd: t({ en: 'and acknowledge our', vi: 'và xác nhận' }),
    privacyPolicy: t({ en: 'Privacy Policy', vi: 'Chính sách bảo mật' }),
    bannerEyebrow: t({ en: 'Probe', vi: 'Probe' }),
    bannerTitle1: t({ en: 'Capture webhooks.', vi: 'Ghi nhận webhook.' }),
    bannerTitle2: t({ en: 'Inspect everything.', vi: 'Kiểm tra mọi thứ.' }),
    bannerDescription: t({
      en: 'Get a unique endpoint, send any webhook to it, and inspect headers, query parameters, and payloads in real time.',
      vi: 'Nhận endpoint riêng biệt, gửi webhook bất kỳ và kiểm tra header, query param cũng như payload theo thời gian thực.',
    }),

    // Login Form
    welcomeTitle: t({ en: 'Welcome back', vi: 'Chào mừng trở lại' }),
    welcomeSubtitle: t({ en: 'Sign in to your Probe account', vi: 'Đăng nhập vào tài khoản Probe của bạn' }),
    continueWithGithub: t({ en: 'Continue with GitHub', vi: 'Tiếp tục với GitHub' }),
    continueWithGoogle: t({ en: 'Continue with Google', vi: 'Tiếp tục với Google' }),
    orDivider: t({ en: 'or', vi: 'hoặc' }),
    emailLabel: t({ en: 'Email', vi: 'Email' }),
    emailPlaceholder: t({ en: 'you@company.com', vi: 'ban@congty.com' }),
    emailErrorInvalid: t({ en: 'Enter a valid email address.', vi: 'Vui lòng nhập địa chỉ email hợp lệ.' }),
    sendLink: t({ en: 'Send sign-in link', vi: 'Gửi liên kết đăng nhập' }),
    sendLinkAgain: t({ en: 'Send link again', vi: 'Gửi lại liên kết' }),
    sendCooldownPrefix: t({ en: 'Send again in', vi: 'Gửi lại sau' }),
    linkSentTitle: t({ en: 'Sign-in link sent', vi: 'Đã gửi liên kết đăng nhập' }),
    linkSentDescPrefix: t({ en: 'Check', vi: 'Kiểm tra' }),
    linkSentDescSuffix: t({
      en: 'for your sign-in link. It expires in 10 minutes.',
      vi: 'để nhận liên kết đăng nhập. Liên kết hết hạn sau 10 phút.',
    }),
    unableToSend: t({ en: 'Unable to send the sign-in link. Try again.', vi: 'Không thể gửi liên kết đăng nhập. Vui lòng thử lại.' }),
    unableToSignInWith: t({ en: 'Unable to sign in with', vi: 'Không thể đăng nhập với' }),
    tryAgain: t({ en: 'Try again.', vi: 'Vui lòng thử lại.' }),
  },
} satisfies Dictionary

export default authContent

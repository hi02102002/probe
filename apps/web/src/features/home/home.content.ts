import type { Dictionary } from 'intlayer'
import { t } from 'intlayer'

const homeContent = {
  key: 'home',
  content: {
    announcement: t({ en: 'Debug your next webhook with Probe.', vi: 'Webhook lỗi? Mở Probe ra kiểm tra.' }),
    featuresNav: t({ en: 'Inspect', vi: 'Kiểm tra' }),
    compareNav: t({ en: 'How it works', vi: 'Cách dùng' }),
    pricingNav: t({ en: 'Start', vi: 'Bắt đầu' }),
    badge: t({ en: 'Webhook debugging without the guesswork', vi: 'Nhìn rõ webhook đã gửi gì' }),
    title: t({ en: 'Receive the webhook.', vi: 'Nhận webhook.' }),
    titleAccent: t({ en: 'Inspect every detail.', vi: 'Xem từng chi tiết.' }),
    description: t({
      en: 'Create a webhook URL. When a request arrives, inspect its headers, query, payload, and metadata.',
      vi: 'Tạo URL nhận webhook. Khi request tới, mở Probe để xem header, query param, payload và metadata.',
    }),
    signIn: t({ en: 'Sign in', vi: 'Đăng nhập' }),
    openDashboard: t({ en: 'Start debugging', vi: 'Bắt đầu debug' }),
    canvasEndpoint: t({ en: 'Your endpoint is ready', vi: 'Endpoint đang chờ webhook' }),
    canvasCaptured: t({ en: '4 requests captured', vi: 'Đã nhận 4 request' }),
    canvasRecent: t({ en: 'Incoming webhooks', vi: 'Webhook mới nhận' }),
    canvasRequestHeaders: t({ en: 'Request headers', vi: 'Header' }),
    canvasRequestBody: t({ en: 'Request body', vi: 'Payload' }),
    canvasReceived: t({ en: 'Received just now', vi: 'Vừa xong' }),
    featureEyebrow: t({ en: 'Everything that arrived', vi: 'Webhook gửi tới có gì?' }),
    featureTitle: t({ en: 'The request is the evidence.', vi: 'Không cần đoán. Mở request ra xem.' }),
    featureDescription: t({
      en: 'Probe keeps the parts of an incoming webhook together, so you can stop reconstructing failures from scattered logs and start with what the provider actually sent.',
      vi: 'Method, URL, header, payload và metadata nằm gọn trong một màn hình. Khi tích hợp có lỗi, bạn xem ngay bên gửi đã bắn sang dữ liệu gì.',
    }),
    fastTitle: t({ en: 'Unique endpoint', vi: 'Endpoint riêng' }),
    fastDescription: t({
      en: 'Name one endpoint for each integration or test.',
      vi: 'Đặt endpoint riêng cho từng tích hợp hoặc lần test.',
    }),
    inspectTitle: t({ en: 'Headers & payload', vi: 'Header và payload' }),
    inspectDescription: t({
      en: 'View every header and the full JSON payload.',
      vi: 'Xem đầy đủ header và JSON payload đã nhận.',
    }),
    privateTitle: t({ en: 'URL & query', vi: 'URL và query' }),
    privateDescription: t({
      en: 'Check the exact path and query values sent.',
      vi: 'Kiểm tra đúng đường dẫn và query được gửi.',
    }),
    liveTitle: t({ en: 'Request history', vi: 'Lịch sử request' }),
    liveDescription: t({
      en: 'Review requests by method and received time.',
      vi: 'Xem lại request theo method và thời điểm nhận.',
    }),
    deployTitle: t({ en: 'Request metadata', vi: 'Metadata request' }),
    deployDescription: t({
      en: 'See status, source IP, and request size.',
      vi: 'Xem status, IP nguồn và kích thước request.',
    }),
    deliveryEyebrow: t({ en: 'Every attempt, in order', vi: 'Từng lần gửi, đúng thứ tự' }),
    deliveryTitle: t({ en: 'See how each attempt ended.', vi: 'Biết từng lần gửi kết thúc ra sao.' }),
    deliveryDescription: t({
      en: 'Follow webhook retries from the first failure to the request that finally succeeds.',
      vi: 'Theo dõi webhook retry từ lần đầu bị lỗi đến request cuối cùng thành công.',
    }),
    deliveryFailed: t({ en: 'Bad Gateway', vi: 'Gateway lỗi' }),
    deliveryTimedOut: t({ en: 'Timed out', vi: 'Hết thời gian' }),
    deliverySucceeded: t({ en: 'Delivered', vi: 'Đã nhận' }),
    deliveryResult: t({ en: 'Delivered after 3 attempts · 10.2s', vi: 'Thành công sau 3 lần · 10,2 giây' }),
    compareEyebrow: t({ en: 'A simple debugging loop', vi: 'Chỉ 3 bước' }),
    compareTitle: t({ en: 'From endpoint to answer in three steps.', vi: 'Có URL. Gửi thử. Xem kết quả.' }),
    compareDescription: t({
      en: 'No SDK or local tunnel is required to see what a webhook provider sends.',
      vi: 'Không phải cài SDK hay mở local tunnel. Dùng URL của Probe là xem được request dịch vụ gửi sang.',
    }),
    stepOneNumber: t({ en: '01', vi: '01' }),
    stepOneTitle: t({ en: 'Create an endpoint', vi: 'Tạo endpoint' }),
    stepOneDescription: t({
      en: 'Give the endpoint a clear name and copy its unique URL.',
      vi: 'Đặt tên cho endpoint rồi copy URL mà Probe tạo sẵn.',
    }),
    stepTwoNumber: t({ en: '02', vi: '02' }),
    stepTwoTitle: t({ en: 'Send a webhook', vi: 'Gửi webhook' }),
    stepTwoDescription: t({
      en: 'Paste the URL into your provider, or send a test request yourself.',
      vi: 'Dán URL vào dịch vụ cần tích hợp, hoặc tự gửi một request test.',
    }),
    stepThreeNumber: t({ en: '03', vi: '03' }),
    stepThreeTitle: t({ en: 'Inspect what arrived', vi: 'Mở request ra xem' }),
    stepThreeDescription: t({
      en: 'Open the captured request and verify every field against your integration.',
      vi: 'Kiểm tra method, header, query param và payload mà endpoint vừa nhận.',
    }),
    pricingEyebrow: t({ en: 'Ready for the next webhook', vi: 'Thử với webhook tiếp theo' }),
    pricingTitle: t({ en: 'Give every webhook a place to land.', vi: 'Tạo endpoint đầu tiên.' }),
    pricingDescription: t({
      en: 'Sign in, create your first endpoint, and replace guesswork with the request in front of you.',
      vi: 'Đăng nhập, copy URL endpoint rồi gửi thử một webhook. Request vừa tới sẽ hiện ngay trong Probe.',
    }),
    startFree: t({ en: 'Start debugging', vi: 'Tạo endpoint' }),
    footerDescription: t({
      en: 'A focused webhook debugger for capturing incoming requests and understanding exactly what was sent.',
      vi: 'Nhận webhook test, xem trọn request và tìm lỗi tích hợp nhanh hơn.',
    }),
    rights: t({ en: 'Built for clearer webhook debugging.', vi: 'Debug webhook, gọn và rõ.' }),
    productFooter: t({ en: 'Product', vi: 'Sản phẩm' }),
    accountFooter: t({ en: 'Account', vi: 'Tài khoản' }),
  },
} satisfies Dictionary

export default homeContent

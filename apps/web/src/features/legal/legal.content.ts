import type { Dictionary } from 'intlayer'
import { t } from 'intlayer'

const legalContent = {
  key: 'legal',
  content: {
    // Navigation & Common
    eyebrow: t({ en: 'Legal', vi: 'Pháp lý' }),
    termsNav: t({ en: 'Terms', vi: 'Điều khoản' }),
    privacyNav: t({ en: 'Privacy', vi: 'Bảo mật' }),
    backToHome: t({ en: 'Back to home', vi: 'Quay lại trang chủ' }),
    lastUpdatedLabel: t({ en: 'Last updated:', vi: 'Cập nhật lần cuối:' }),
    lastUpdatedDate: t({ en: 'August 30, 2026', vi: '30 tháng 8, 2026' }),
    copyright: t({ en: '© 2026 Probe. All rights reserved.', vi: '© 2026 Probe. Đã đăng ký bản quyền.' }),

    // Terms of Service
    termsTitle: t({ en: 'Terms of Service', vi: 'Điều khoản Dịch vụ' }),
    termsDescription: t({
      en: 'Please read these terms carefully before using the Probe webhook debugging and request intelligence platform.',
      vi: 'Vui lòng đọc kỹ các điều khoản này trước khi sử dụng nền tảng gỡ lỗi webhook và giám sát request Probe.',
    }),
    termsSection1Title: t({ en: '1. Acceptance of Terms', vi: '1. Chấp thuận Điều khoản' }),
    termsSection1Content: t({
      en: 'By accessing or using Probe ("the Service"), you agree to be bound by these Terms of Service. If you are using the Service on behalf of an organization or entity, you represent and warrant that you have full authority to bind that organization to these terms.',
      vi: 'Bằng việc truy cập hoặc sử dụng Probe ("Dịch vụ"), bạn đồng ý chịu sự ràng buộc của các Điều khoản Dịch vụ này. Nếu bạn sử dụng Dịch vụ thay mặt cho một tổ chức hoặc doanh nghiệp, bạn cam kết rằng mình có toàn quyền đại diện để ràng buộc tổ chức đó với các điều khoản này.',
    }),
    termsSection2Title: t({ en: '2. Service Description & Endpoints', vi: '2. Mô tả Dịch vụ & Endpoint' }),
    termsSection2Content: t({
      en: 'Probe provides real-time webhook capture, API payload inspection, latency analytics, and debugging infrastructure. You are responsible for configuring your webhook endpoints, securing API credentials, and managing access permissions for your team members.',
      vi: 'Probe cung cấp hạ tầng ghi nhận webhook theo thời gian thực, kiểm tra payload API, phân tích độ trễ và hỗ trợ gỡ lỗi. Bạn chịu trách nhiệm cấu hình các endpoint webhook, bảo mật thông tin API và quản lý phân quyền truy cập cho các thành viên trong nhóm.',
    }),
    termsSection3Title: t({ en: '3. Acceptable Use & Restrictions', vi: '3. Quy định Sử dụng Hợp pháp' }),
    termsSection3Content: t({
      en: 'You agree not to use the Service to transmit malicious code, distribute unsolicited bulk data, intercept unauthorized communications, or perform denial-of-service attacks against third-party systems. You must use Probe\'s redaction capabilities to protect sensitive user credentials, private tokens, and confidential personal data before logging.',
      vi: 'Bạn cam kết không sử dụng Dịch vụ để truyền tải mã độc hại, phân phối dữ liệu rác số lượng lớn, đánh chặn trái phép các luồng truyền thông tin hoặc thực hiện tấn công từ chối dịch vụ. Bạn cần sử dụng tính năng ẩn dữ liệu nhạy cảm (redaction) của Probe để bảo vệ mật khẩu, token riêng tư và dữ liệu cá nhân trước khi lưu trữ.',
    }),
    termsSection4Title: t({ en: '4. Data Ownership & Processing License', vi: '4. Quyền Sở hữu Dữ liệu & Giấy phép Xử lý' }),
    termsSection4Content: t({
      en: 'You retain full ownership of all request payloads, headers, and telemetry transmitted to your endpoints. You grant Probe a limited, non-exclusive license to ingest, store, process, and display this data solely to provide, maintain, and troubleshoot the Service on your behalf.',
      vi: 'Bạn giữ toàn quyền sở hữu đối với tất cả payload request, header và dữ liệu telemetry gửi đến endpoint của bạn. Bạn cấp cho Probe quyền giới hạn, không độc quyền để tiếp nhận, lưu trữ, xử lý và hiển thị dữ liệu này nhằm mục đích duy nhất là cung cấp, duy trì và hỗ trợ kỹ thuật cho Dịch vụ.',
    }),
    termsSection5Title: t({ en: '5. Subscriptions, Billing & Cancellation', vi: '5. Gói Cước, Thanh toán & Hủy Dịch vụ' }),
    termsSection5Content: t({
      en: 'Paid subscription tiers are billed on a recurring monthly or annual basis. You may upgrade, downgrade, or cancel your subscription at any time via the dashboard billing settings. Cancellation takes effect at the end of the current billing cycle.',
      vi: 'Các gói đăng ký trả phí được thanh toán định kỳ theo tháng hoặc theo năm. Bạn có thể nâng cấp, hạ cấp hoặc hủy gói đăng ký bất kỳ lúc nào qua trang cài đặt thanh toán trong dashboard. Việc hủy dịch vụ sẽ có hiệu lực vào cuối chu kỳ thanh toán hiện tại.',
    }),
    termsSection6Title: t({ en: '6. Limitation of Liability & Warranties', vi: '6. Giới hạn Trách nhiệm & Bảo đảm' }),
    termsSection6Content: t({
      en: 'The Service is provided on an "as is" and "as available" basis without express or implied warranties. To the maximum extent permitted by law, Probe shall not be liable for indirect, incidental, punitive, or consequential damages resulting from service interruptions or data loss.',
      vi: 'Dịch vụ được cung cấp trên nguyên tắc "nguyên trạng" và "sẵn có" mà không có bất kỳ bảo đảm ngụ ý nào. Trong phạm vi tối đa được pháp luật cho phép, Probe không chịu trách nhiệm đối với bất kỳ thiệt hại gián tiếp, ngẫu nhiên hoặc do hậu quả phát sinh từ việc gián đoạn dịch vụ hay mất mát dữ liệu.',
    }),

    // Privacy Policy
    privacyTitle: t({ en: 'Privacy Policy', vi: 'Chính sách Bảo mật' }),
    privacyDescription: t({
      en: 'Learn how Probe collects, uses, encrypts, and protects your account details and webhook debugging telemetry.',
      vi: 'Tìm hiểu cách Probe thu thập, sử dụng, mã hóa và bảo vệ thông tin tài khoản cũng như dữ liệu gỡ lỗi webhook của bạn.',
    }),
    privacySection1Title: t({ en: '1. Information We Collect', vi: '1. Thông tin Chúng tôi Thu thập' }),
    privacySection1Content: t({
      en: 'We collect account details (such as your email address and OAuth profile information) and webhook telemetry data (HTTP method, headers, query parameters, request/response body contents, IP metadata, and timing metrics) transmitted to your assigned endpoints.',
      vi: 'Chúng tôi thu thập thông tin tài khoản (như địa chỉ email và hồ sơ OAuth của bạn) cùng với dữ liệu telemetry webhook (phương thức HTTP, header, query param, nội dung body request/response, metadata IP và chỉ số thời gian) được gửi đến các endpoint của bạn.',
    }),
    privacySection2Title: t({ en: '2. How We Use Collected Data', vi: '2. Mục đích Sử dụng Dữ liệu' }),
    privacySection2Content: t({
      en: 'Collected information is used exclusively to operate the webhook ingestion pipeline, render inspection interfaces, deliver authentication magic links, prevent brute force and abuse, and provide accurate observability analytics for your services.',
      vi: 'Dữ liệu thu thập được sử dụng duy nhất nhằm mục đích vận hành luồng ghi nhận webhook, hiển thị giao diện kiểm tra, gửi liên kết đăng nhập an toàn, ngăn chặn tấn công brute-force và cung cấp số liệu phân tích chính xác cho hệ thống của bạn.',
    }),
    privacySection3Title: t({ en: '3. Data Retention & Automatic Purging', vi: '3. Thời hạn Lưu trữ & Tự động Xóa' }),
    privacySection3Content: t({
      en: 'Webhook payloads are retained in according with your active plan tier (3 days for Developer tier, 30 days for Team tier). After the retention period expires, request payloads and detailed body logs are permanently and irreversibly purged from our storage systems.',
      vi: 'Dữ liệu payload webhook được lưu trữ theo quy định của gói cước bạn đang sử dụng (3 ngày đối với gói Developer, 30 ngày đối với gói Team). Sau khi hết thời hạn lưu trữ, nội dung payload và log chi tiết sẽ được tự động xóa vĩnh viễn khỏi hệ thống.',
    }),
    privacySection4Title: t({ en: '4. Security & Encryption Standards', vi: '4. Tiêu chuẩn Bảo mật & Mã hóa' }),
    privacySection4Content: t({
      en: 'All data is encrypted in transit using modern TLS (HTTPS) protocols and encrypted at rest in our databases. We employ strict access controls, session token hashing, IP rate limiting, and continuous vulnerability monitoring to protect your infrastructure.',
      vi: 'Mọi dữ liệu đều được mã hóa trong quá trình truyền tải bằng giao thức TLS (HTTPS) và mã hóa an toàn khi lưu trữ trong cơ sở dữ liệu. Chúng tôi áp dụng cơ chế kiểm soát truy cập nghiêm ngặt, băm session token, giới hạn tần suất request theo IP và theo dõi bảo mật liên tục.',
    }),
    privacySection5Title: t({ en: '5. Subprocessors & Third Parties', vi: '5. Đối tác Hạ tầng & Bên thứ ba' }),
    privacySection5Content: t({
      en: 'We work with trusted infrastructure providers (cloud hosting, managed PostgreSQL database, and Resend for transactional emails) strictly to operate Probe. We do not sell, rent, or trade your personal information or webhook payloads with any third party.',
      vi: 'Chúng tôi hợp tác với các nhà cung cấp hạ tầng uy tín (cloud hosting, cơ sở dữ liệu PostgreSQL và Resend cho email giao dịch) chỉ để vận hành Probe. Chúng tôi tuyệt đối không bán, cho thuê hay thương mại hóa dữ liệu cá nhân cũng như payload webhook của bạn.',
    }),
    privacySection6Title: t({ en: '6. Your Rights & Data Controls', vi: '6. Quyền Hạn của Bạn & Quản lý Dữ liệu' }),
    privacySection6Content: t({
      en: 'You have the right to inspect, export, or manually clear your captured webhook records at any time. You can also request complete account termination and permanent deletion of all associated organization data by contacting support@probe.dev.',
      vi: 'Bạn có quyền kiểm tra, xuất dữ liệu hoặc chủ động xóa toàn bộ bản ghi webhook đã lưu bất kỳ lúc nào. Bạn cũng có thể yêu cầu xóa vĩnh viễn tài khoản và toàn bộ dữ liệu tổ chức liên quan bằng cách liên hệ với support@probe.dev.',
    }),
  },
} satisfies Dictionary

export default legalContent

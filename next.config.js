/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: [
    'antd',
    '@ant-design/icons',
    '@ant-design/cssinjs',
    'rc-util',
    'rc-pagination',
    'rc-picker',
    'rc-tree',
    'rc-table',
    'rc-input',
    'rc-field-form',
    'rc-select',
    'rc-checkbox',
  ],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Next.js hydration + styled-components 需要 unsafe-inline
              // Dev mode React Fast Refresh 需要 unsafe-eval（production build 不使用 eval）
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              // styled-components / Ant Design CSS-in-JS + Google Fonts CSS
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Google Fonts 字型檔
              "font-src 'self' https://fonts.gstatic.com data:",
              // 允許 data: URI 圖片（Ant Design icons）與 HTTPS 外部圖片
              "img-src 'self' data: https:",
              // API 呼叫均為同源
              "connect-src 'self'",
              // 防止本站被嵌入 iframe（與 X-Frame-Options 雙重保護）
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;

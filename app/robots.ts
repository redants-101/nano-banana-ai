import { MetadataRoute } from 'next'

// 站点基础URL，优先使用环境变量，否则使用默认值
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',           // API 路由不需要索引
          '/payment/cancel', // 支付相关页面不需要公开索引
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}


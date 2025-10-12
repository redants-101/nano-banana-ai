import { MetadataRoute } from 'next'
import { locales, defaultLocale } from '@/i18n'

// 站点基础URL，优先使用环境变量，否则使用默认值
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'

// 定义网站的所有路径
const routes = [
  {
    path: '',
    priority: 1.0,
    changeFrequency: 'daily' as const,
  },
  {
    path: '/pricing',
    priority: 0.9,
    changeFrequency: 'weekly' as const,
  },
  {
    path: '/payment/success',
    priority: 0.5,
    changeFrequency: 'monthly' as const,
  },
  {
    path: '/payment/cancel',
    priority: 0.5,
    changeFrequency: 'monthly' as const,
  },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date()
  
  // 为每个语言生成所有路径
  const urls: MetadataRoute.Sitemap = []
  
  locales.forEach((locale) => {
    routes.forEach((route) => {
      const url = locale === defaultLocale 
        ? `${baseUrl}${route.path}`
        : `${baseUrl}/${locale}${route.path}`
      
      urls.push({
        url,
        lastModified: currentDate,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        // 添加多语言替代链接
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [
              l,
              l === defaultLocale
                ? `${baseUrl}${route.path}`
                : `${baseUrl}/${l}${route.path}`
            ])
          )
        }
      })
    })
  })
  
  return urls
}


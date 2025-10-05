import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  // 支持的语言列表
  locales,
  
  // 默认语言
  defaultLocale,
  
  // 始终在 URL 中使用语言前缀
  localePrefix: 'always'
});

export const config = {
  // 匹配除以下路径外的所有路径：
  // - API 路由
  // - 静态文件 (_next/static)
  // - 图片优化文件 (_next/image)
  // - favicon
  // - 公共文件夹中的文件（带文件扩展名的）
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
};
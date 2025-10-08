import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const intlMiddleware = createMiddleware({
  // 支持的语言列表
  locales,
  
  // 默认语言
  defaultLocale,
  
  // 始终在 URL 中使用语言前缀
  localePrefix: 'always'
});

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 刷新用户会话
  await supabase.auth.getUser()

  // 执行国际化 middleware
  return intlMiddleware(request)
}

export const config = {
  // 匹配除以下路径外的所有路径：
  // - API 路由
  // - 静态文件 (_next/static)
  // - 图片优化文件 (_next/image)
  // - favicon
  // - 公共文件夹中的文件（带文件扩展名的）
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
};
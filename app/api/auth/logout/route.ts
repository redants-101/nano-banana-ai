import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // 获取当前用户信息（用于日志记录）
    const { data: { user } } = await supabase.auth.getUser()
    
    // 记录用户登录类型（GitHub 或 Google）
    const provider = user?.app_metadata?.provider || 'unknown'
    const userEmail = user?.email || 'unknown'
    
    console.log(`User logout: ${userEmail} (Provider: ${provider})`)
    
    // 执行退出操作
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Logout error:', error)
      return NextResponse.json({ 
        error: error.message,
        provider 
      }, { status: 400 })
    }
    
    // 清除所有 Supabase 相关的 cookies
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()
    
    // 创建响应并清除 Supabase cookies
    const response = NextResponse.json({ 
      success: true,
      message: `Successfully logged out from ${provider}`,
      provider 
    })
    
    // 清除所有以 'sb-' 开头的 Supabase cookies
    allCookies.forEach(cookie => {
      if (cookie.name.startsWith('sb-')) {
        response.cookies.set(cookie.name, '', {
          value: '',
          maxAge: 0,
          path: '/',
        })
      }
    })
    
    return response
  } catch (error) {
    console.error('Unexpected logout error:', error)
    return NextResponse.json({ 
      error: 'An unexpected error occurred during logout',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}


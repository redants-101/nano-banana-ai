'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogIn, LogOut, User as UserIcon, Github, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useTranslations } from 'next-intl'

export function UserAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const t = useTranslations('auth')

  useEffect(() => {
    // 获取初始用户状态
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // 监听认证状态变化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleLogin = async (provider: 'github' | 'google') => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          redirectTo: window.location.pathname,
        }),
      })

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Login error:', error)
    }
    setIsLoginDialogOpen(false)
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || t('logoutFailedMessage'))
      }
      
      // 清理本地存储
      localStorage.removeItem('supabase.auth.token')
      sessionStorage.clear()
      
      setUser(null)
      setIsDropdownOpen(false)
      
      // 直接刷新和跳转，不延迟
      router.refresh()
      router.push('/')
      
    } catch (error) {
      console.error('Logout error:', error)
      // 即使出错也关闭菜单
      setIsDropdownOpen(false)
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (loading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <UserIcon className="h-4 w-4" />
      </Button>
    )
  }

  if (!user) {
    return (
      <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="default" size="sm">
            <LogIn className="h-4 w-4 mr-2" />
            {t('login')}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('selectLoginMethod')}</DialogTitle>
            <DialogDescription>
              {t('loginDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button
              onClick={() => handleLogin('google')}
              variant="outline"
              className="w-full justify-start"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {t('loginWithGoogle')}
            </Button>
            <Button
              onClick={() => handleLogin('github')}
              variant="outline"
              className="w-full justify-start"
            >
              <Github className="mr-2 h-4 w-4" />
              {t('loginWithGitHub')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // 获取用户信息
  const username = user.user_metadata?.full_name || user.user_metadata?.user_name || user.email?.split('@')[0] || 'User'
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture
  const provider = user.app_metadata?.provider || 'unknown'

  return (
    <>
      {/* 简化版下拉菜单 - 使用原生HTML */}
      <div className="relative">
        <Button 
          variant="ghost" 
          className="relative h-9 w-9 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all"
          aria-label={t('userMenu')}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={avatarUrl} alt={username} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
        
        {/* 使用简单的绝对定位实现下拉菜单 */}
        {isDropdownOpen && (
          <>
            {/* 点击外部关闭的遮罩层 */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsDropdownOpen(false)}
            />
            
            {/* 下拉菜单内容 - 优化样式 */}
            <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
              <div className="py-1">
                {/* 用户信息 */}
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{username}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{user.email}</p>
                  <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-500">
                    {provider === 'google' && (
                      <svg className="mr-1 h-3 w-3" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    )}
                    {provider === 'github' && <Github className="mr-1 h-3 w-3" />}
                    {provider === 'google' ? t('googleAccount') : provider === 'github' ? t('githubAccount') : provider}
                  </div>
                </div>
                
                {/* 退出按钮 */}
                <button
                  onClick={() => {
                    const providerName = provider === 'google' ? t('googleAccount') : t('githubAccount')
                    if (confirm(t('confirmLogoutMessage', { provider: providerName }))) {
                      handleLogout()
                    }
                  }}
                  disabled={isLoggingOut}
                  className="flex items-center w-full px-4 py-2.5 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoggingOut ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>{t('loggingOut')}</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t('logout')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      
    </>
  )
}

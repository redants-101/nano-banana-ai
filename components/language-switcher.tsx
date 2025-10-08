'use client'

import { useState, useTransition } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname as useNextPathname, useRouter as useNextRouter } from 'next/navigation'
import { locales, localeConfigs, type Locale } from '@/lib/i18n/config'
import { Button } from "@/components/ui/button"
import { Globe, Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function LanguageSwitcher() {
  const locale = useLocale() as Locale
  const pathname = useNextPathname()
  const router = useNextRouter()
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations('common')

  const handleLanguageChange = (newLocale: Locale) => {
    // Don't do anything if selecting the same language
    if (newLocale === locale) return

    setIsOpen(false)

    startTransition(() => {
      // 获取当前路径，移除语言前缀
      const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'
      
      // 构建新的路径
      const newPath = `/${newLocale}${pathWithoutLocale}`
            
      // 使用 Next.js 路由进行平滑切换
      router.push(newPath)
      router.refresh()
    })
  }

  const currentConfig = localeConfigs[locale]

  return (
    <div className="relative">
      {/* 语言切换按钮 */}
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-2 border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all"
        disabled={isPending}
        aria-label={t('switchLanguage')}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        ) : (
          <>
            <Globe className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline font-medium">
              {currentConfig.flag} {currentConfig.name}
            </span>
            <span className="sm:hidden text-xl">{currentConfig.flag}</span>
          </>
        )}
      </Button>

      {/* 下拉菜单 */}
      {isOpen && (
        <>
          {/* 遮罩层 */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* 菜单内容 */}
          <div className="absolute right-0 mt-2 min-w-[180px] rounded-lg shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
            <div className="py-1">
              {locales.map((lng) => {
                const config = localeConfigs[lng]
                const isActive = locale === lng
                
                return (
                  <button
                    key={lng}
                    onClick={() => handleLanguageChange(lng)}
                    disabled={isPending || isActive}
                    className={cn(
                      "flex items-center gap-3 w-full px-3 py-2.5 text-sm text-left transition-colors",
                      "hover:bg-gray-100 dark:hover:bg-gray-700",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      isActive && "bg-primary/10 text-primary font-medium"
                    )}
                  >
                    <span className="text-xl">{config.flag}</span>
                    <span className="flex-1">{config.name}</span>
                    {isActive && <Check className="h-4 w-4 text-primary" />}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

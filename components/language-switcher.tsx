'use client'

import { useTransition } from 'react'
import { useLocale } from 'next-intl'
import { usePathname as useNextPathname, useRouter as useNextRouter } from 'next/navigation'
import { locales, localeConfigs, type Locale } from '@/lib/i18n/config'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Globe, Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function LanguageSwitcher() {
  const locale = useLocale() as Locale
  const pathname = useNextPathname()
  const router = useNextRouter()
  const [isPending, startTransition] = useTransition()

  const handleLanguageChange = (newLocale: Locale) => {
    // Don't do anything if selecting the same language
    if (newLocale === locale) return

    startTransition(() => {
      // 获取当前路径，移除语言前缀
      const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'
      
      // 构建新的路径
      const newPath = `/${newLocale}${pathWithoutLocale}`
      
      // 使用 Next.js 路由进行平滑切换
      router.push(newPath)
    })
  }

  const currentConfig = localeConfigs[locale]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all"
          disabled={isPending}
          aria-label="切换语言 / Change language"
          title="切换语言 / Change language"
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
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        {locales.map((lng) => {
          const config = localeConfigs[lng]
          const isActive = locale === lng
          
          return (
            <DropdownMenuItem
              key={lng}
              onClick={() => handleLanguageChange(lng)}
              className={cn(
                "gap-3 cursor-pointer py-2.5 px-3 transition-colors",
                isActive && "bg-primary/10 text-primary font-medium"
              )}
              disabled={isPending || isActive}
            >
              <span className="text-xl">{config.flag}</span>
              <span className="flex-1 text-sm">{config.name}</span>
              {isActive && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
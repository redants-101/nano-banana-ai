"use client"

import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { UserAuth } from "@/components/user-auth"
import { useTranslations } from "next-intl"
import { Link } from "@/lib/i18n/navigation"

export function Header() {
  const t = useTranslations()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🍌</span>
          <span className="text-xl font-bold">Nano Banana</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="#editor" className="text-sm font-medium hover:text-primary transition-colors">
            {t('header.imageEditor')}
          </Link>
          <Link href="#showcase" className="text-sm font-medium hover:text-primary transition-colors">
            {t('header.showcase')}
          </Link>
          <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
            {t('header.features')}
          </Link>
          <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
            {t('header.pricing')}
          </Link>
          <Link href="#api" className="text-sm font-medium hover:text-primary transition-colors">
            {t('header.api')}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <UserAuth />
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
            {t('common.getStarted')}
          </Button>
        </div>
      </div>
    </header>
  )
}
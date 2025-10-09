"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/lib/i18n/navigation"

export function Footer() {
  const t = useTranslations('footer')
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="border-t py-12 bg-card">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🍌</span>
              <span className="text-xl font-bold">Nano Banana</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('tagline')}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('product.title')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/#editor" className="hover:text-primary transition-colors">
                  {t('product.imageEditor')}
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-primary transition-colors">
                  {t('product.features')}
                </Link>
              </li>
              <li>
                <Link href="/#showcase" className="hover:text-primary transition-colors">
                  {t('product.showcase')}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-primary transition-colors">
                  {t('product.pricing')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('resources.title')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  {t('resources.documentation')}
                </Link>
              </li>
              <li>
                <Link href="/#api" className="hover:text-primary transition-colors">
                  {t('resources.api')}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  {t('resources.tutorials')}
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-primary transition-colors">
                  {t('resources.faq')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('company.title')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  {t('company.about')}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  {t('company.blog')}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  {t('company.contact')}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  {t('company.privacy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>{t('copyright', { year: currentYear })}</p>
          <p className="text-xs">
            {t('disclaimer')}
          </p>
        </div>
      </div>
    </footer>
  )
}

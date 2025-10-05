import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { locales, type Locale } from '@/i18n'
import "./globals.css"

// Next.js 14+ 类型定义
type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

// Generate metadata for each locale
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  
  // Ensure locale is valid
  if (!locales.includes(locale as Locale)) {
    return {}
  }

  // Get translations for metadata
  const t = await getTranslations({ locale, namespace: 'metadata' })

  // Language-specific metadata
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://nano-banana.ai'
  const currentUrl = `${baseUrl}/${locale}`

  return {
    title: t('title'),
    description: t('description'),
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: currentUrl,
      languages: {
        'en': `${baseUrl}/en`,
        'zh': `${baseUrl}/zh`,
      }
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: currentUrl,
      siteName: 'Nano Banana',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'Nano Banana AI Image Editor'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: [`${baseUrl}/og-image.png`]
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    }
  }
}

// Generate static params for all locales
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

// Loading component with locale support
function LocaleLoading({ locale }: { locale: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">
          {locale === 'zh' ? '加载中...' : 'Loading...'}
        </p>
      </div>
    </div>
  )
}

export default async function LocaleLayout({
  children,
  params
}: Props) {
  const { locale } = await params
  
  // Type-safe locale validation
  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  // Load messages server-side
  const messages = await getMessages({ locale })

  return (
    <html lang={locale} dir="ltr">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <NextIntlClientProvider 
          locale={locale} 
          messages={messages}
        >
          <Suspense fallback={<LocaleLoading locale={locale} />}>
            {children}
          </Suspense>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  )
}
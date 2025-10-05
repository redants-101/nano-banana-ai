import type { LocaleConfig } from './types'
import { locales, defaultLocale, type Locale } from '@/i18n'

// Re-export for convenience
export { locales, defaultLocale, type Locale }

export const localeConfigs = {
  en: {
    locale: 'en',
    name: 'English',
    flag: '🇺🇸',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    direction: 'ltr' as const
  },
  zh: {
    locale: 'zh',
    name: '中文',
    flag: '🇨🇳',
    dateFormat: 'YYYY年MM月DD日',
    currency: 'CNY',
    direction: 'ltr' as const
  }
} satisfies Record<Locale, LocaleConfig>

// Browser language detection mapping
export const browserLanguageMap: Record<string, Locale> = {
  'en': 'en',
  'en-US': 'en',
  'en-GB': 'en',
  'zh': 'zh',
  'zh-CN': 'zh',
  'zh-TW': 'zh',
  'zh-HK': 'zh'
}

export function detectBrowserLanguage(): Locale {
  if (typeof window === 'undefined') return defaultLocale
  
  const browserLang = navigator.language || navigator.languages[0]
  const langCode = browserLang.split('-')[0]
  
  return browserLanguageMap[browserLang] || browserLanguageMap[langCode] || defaultLocale
}

import { locales, type Locale } from '@/i18n'

// Get locale from pathname
export function getLocaleFromPathname(pathname: string): Locale | null {
  const segments = pathname.split('/')
  const potentialLocale = segments[1]
  
  if (locales.includes(potentialLocale as Locale)) {
    return potentialLocale as Locale
  }
  
  return null
}

// Remove locale from pathname
export function removeLocaleFromPathname(pathname: string): string {
  const locale = getLocaleFromPathname(pathname)
  
  if (locale) {
    const segments = pathname.split('/')
    segments.splice(1, 1)
    return segments.join('/') || '/'
  }
  
  return pathname
}

// Add locale to pathname
export function addLocaleToPathname(pathname: string, locale: Locale): string {
  const cleanPath = removeLocaleFromPathname(pathname)
  return `/${locale}${cleanPath === '/' ? '' : cleanPath}`
}

// Format date based on locale
export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US').format(date)
}

// Format number based on locale
export function formatNumber(number: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === 'zh' ? 'zh-CN' : 'en-US').format(number)
}

// Format currency based on locale
export function formatCurrency(amount: number, locale: Locale): string {
  const currency = locale === 'zh' ? 'CNY' : 'USD'
  return new Intl.NumberFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    style: 'currency',
    currency
  }).format(amount)
}

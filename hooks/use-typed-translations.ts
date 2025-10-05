'use client'

import { useTranslations } from 'next-intl'
import type { Messages, TranslationPath } from '@/lib/i18n/types'

// Type-safe translation hook
export function useTypedTranslations<Namespace extends keyof Messages>(
  namespace?: Namespace
) {
  const t = useTranslations(namespace as string)
  
  // Return typed translation function
  return {
    t,
    // Helper for getting nested keys with type safety
    get: <Key extends TranslationPath>(key: Key): string => {
      return t(key as any)
    }
  }
}

// Hook for common translations
export function useCommonTranslations() {
  return useTypedTranslations('common')
}

// Hook for error messages
export function useErrorTranslations() {
  return useTypedTranslations('editor')
}

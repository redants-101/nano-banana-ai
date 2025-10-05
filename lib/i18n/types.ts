// Type-safe translation keys
import type enMessages from '@/messages/en.json'
import type { locales } from '@/lib/i18n/config'

export type Messages = typeof enMessages
export type TranslationKeys = keyof Messages

// Utility type for nested keys
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`
}[keyof ObjectType & (string | number)]

export type TranslationPath = NestedKeyOf<Messages>

// Locale configuration
export interface LocaleConfig {
  locale: string
  name: string
  flag: string
  dateFormat: string
  currency: string
  direction: 'ltr' | 'rtl'
}

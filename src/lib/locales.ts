export const locales = ['pt-PT', 'pt-BR', 'en', 'es'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'pt-PT'

export function hasLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}

'use client'

import { usePathname } from 'next/navigation'
import { locales, defaultLocale } from './locales'

export function useLang(): string {
  const pathname = usePathname()
  const segment = pathname.split('/')[1]
  return locales.includes(segment as any) ? segment : defaultLocale
}

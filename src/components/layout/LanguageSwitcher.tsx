'use client'

import { usePathname, useRouter } from 'next/navigation'
import { type Locale } from '@/lib/locales'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const options: { locale: Locale; flag: string; label: string }[] = [
  { locale: 'pt-PT', flag: '🇵🇹', label: 'Português (PT)' },
  { locale: 'pt-BR', flag: '🇧🇷', label: 'Português (BR)' },
  { locale: 'en',    flag: '🇬🇧', label: 'English' },
  { locale: 'es',    flag: '🇪🇸', label: 'Español' },
]

export default function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const pathname = usePathname()
  const router = useRouter()

  function switchLang(newLang: string) {
    const segments = pathname.split('/')
    segments[1] = newLang
    router.push(segments.join('/'))
  }

  const current = options.find(o => o.locale === currentLang) ?? options[0]

  return (
    <Select value={currentLang} onValueChange={switchLang}>
      <SelectTrigger className="h-8 w-auto gap-1.5 border-border bg-transparent text-xs font-medium focus:ring-0 focus:ring-offset-0 [&>svg]:size-3">
        <SelectValue>
          <span className="flex items-center gap-1.5">
            <span className="text-base leading-none">{current.flag}</span>
            <span className="hidden sm:inline">{current.locale === 'pt-PT' ? 'PT' : current.locale === 'pt-BR' ? 'BR' : current.locale.toUpperCase()}</span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="end">
        {options.map(({ locale, flag, label }) => (
          <SelectItem key={locale} value={locale}>
            <span className="flex items-center gap-2">
              <span className="text-base leading-none">{flag}</span>
              <span>{label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

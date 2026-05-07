import type { ReactNode } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getDictionary, hasLocale, defaultLocale, type Locale } from '@/lib/i18n'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'

export default async function PublicLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale: Locale = hasLocale(lang) ? lang : defaultLocale
  const dict = await getDictionary(locale)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={`/${locale}`} className="font-bold text-xl text-primary">
            {dict.common.platform_name}
          </Link>
          <nav className="flex items-center gap-3">
            <Link href={`/${locale}/servicos`} className="text-sm text-foreground/70 hover:text-foreground">
              {dict.landing.nav_services}
            </Link>
            <Link href={`/${locale}/login`}>
              <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
                {dict.landing.nav_login}
              </Button>
            </Link>
            <Link href={`/${locale}/cadastro`}>
              <Button size="sm">{dict.landing.nav_register}</Button>
            </Link>
            <LanguageSwitcher currentLang={locale} />
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} {dict.common.platform_name}. {dict.landing.footer}
        </div>
      </footer>
    </div>
  )
}

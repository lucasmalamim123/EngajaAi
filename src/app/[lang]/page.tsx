import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ShieldCheck, FileText, MessageSquare, CreditCard } from 'lucide-react'
import { getDictionary, hasLocale, defaultLocale, type Locale } from '@/lib/i18n'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale: Locale = hasLocale(lang) ? lang : defaultLocale
  const dict = await getDictionary(locale)

  const features = [
    { icon: <ShieldCheck className="text-primary" size={28} />, title: dict.common.platform_name, description: dict.landing.hero_subtitle },
    { icon: <FileText className="text-primary" size={28} />, title: 'Contratos digitais', description: 'Gere, assine e armazene seus contratos com segurança na nuvem.' },
    { icon: <MessageSquare className="text-primary" size={28} />, title: 'Comunicação direta', description: 'Troque mensagens com seu advogado diretamente pela plataforma.' },
    { icon: <CreditCard className="text-primary" size={28} />, title: 'Pagamento seguro', description: 'Pague com total segurança.' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="font-bold text-xl text-primary">{dict.common.platform_name}</span>
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

      <section className="text-white py-24 px-4" style={{ background: 'var(--gradient-hero)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            {dict.landing.hero_title}
          </h1>
          <p className="text-lg text-white/75 mb-10 max-w-2xl mx-auto">
            {dict.landing.hero_subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/servicos`}>
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8">
                {dict.landing.cta_primary}
              </Button>
            </Link>
            <Link href={`/${locale}/cadastro`}>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                {dict.landing.cta_secondary}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-background">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            {dict.landing.features_title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(f => (
              <Card key={f.title} className="border hover:border-primary/30 hover:shadow-md transition-all">
                <CardContent className="pt-6">
                  <div className="mb-4">{f.icon}</div>
                  <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-primary/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">{dict.landing.cta_section_title}</h2>
          <p className="text-muted-foreground mb-8">{dict.landing.cta_section_text}</p>
          <Link href={`/${locale}/servicos`}>
            <Button size="lg">{dict.landing.cta_primary}</Button>
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} {dict.common.platform_name}. {dict.landing.footer}
        </div>
      </footer>
    </div>
  )
}

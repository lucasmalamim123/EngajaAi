import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShieldCheck, FileText, MessageSquare, CreditCard, ChevronRight } from 'lucide-react'
import { getDictionary, hasLocale, defaultLocale, type Locale } from '@/lib/i18n'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale: Locale = hasLocale(lang) ? lang : defaultLocale
  const dict = await getDictionary(locale)

  const features = [
    {
      icon: <ShieldCheck size={20} />,
      title: 'Segurança garantida',
      description: 'Dados protegidos com encriptação de nível bancário e armazenamento certificado.',
    },
    {
      icon: <FileText size={20} />,
      title: 'Contratos digitais',
      description: 'Gere, assine e armazene contratos com total segurança na nuvem.',
    },
    {
      icon: <MessageSquare size={20} />,
      title: 'Comunicação direta',
      description: 'Troque mensagens com o seu advogado diretamente pela plataforma.',
    },
    {
      icon: <CreditCard size={20} />,
      title: 'Pagamento seguro',
      description: 'Pague com cartão de forma simples e segura via Stripe.',
    },
  ]

  const steps = [
    {
      number: '01',
      title: 'Escolha o serviço',
      description: 'Navegue pelo catálogo e selecione o serviço jurídico adequado às suas necessidades.',
    },
    {
      number: '02',
      title: 'Efetue o pagamento',
      description: 'Pague de forma segura via Stripe. O seu caso é criado automaticamente.',
    },
    {
      number: '03',
      title: 'Acompanhe o processo',
      description: 'Um advogado é designado e pode acompanhar tudo no seu painel pessoal.',
    },
  ]

  const stats = [
    { value: '500+', label: 'Clientes ativos' },
    { value: '50+',  label: 'Advogados' },
    { value: '98%',  label: 'Satisfação' },
  ]

  return (
    <div className="min-h-screen flex flex-col">

      {/* ══════════════════════ HEADER ══════════════════════ */}
      <header
        className="sticky top-0 z-50 border-b border-white/[0.08]"
        style={{ background: 'rgba(11, 9, 20, 0.92)', backdropFilter: 'blur(12px)' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <ShieldCheck size={15} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-white text-[15px] tracking-tight">
              {dict.common.platform_name}
            </span>
          </div>

          <nav className="flex items-center gap-2">
            <Link
              href={`/${locale}/servicos`}
              className="hidden sm:block text-sm text-white/50 hover:text-white/90 transition-colors px-3 py-1.5 rounded-md hover:bg-white/[0.06]"
            >
              {dict.landing.nav_services}
            </Link>
            <Link href={`/${locale}/login`}>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/65 hover:text-white hover:bg-white/[0.08] border border-white/[0.12] h-8 text-xs px-3"
              >
                {dict.landing.nav_login}
              </Button>
            </Link>
            <Link href={`/${locale}/cadastro`}>
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-white h-8 text-xs px-3">
                {dict.landing.nav_register}
              </Button>
            </Link>
            <LanguageSwitcher currentLang={locale} />
          </nav>
        </div>
      </header>

      {/* ══════════════════════ HERO ══════════════════════ */}
      <section
        className="relative overflow-hidden text-white flex items-center"
        style={{
          minHeight: '88vh',
          background: 'linear-gradient(145deg, #0b0914 0%, #141028 50%, #0e0c1e 100%)',
        }}
      >
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid-white pointer-events-none" />

        {/* Radial purple glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '40%',
            left: '52%',
            transform: 'translate(-50%, -50%)',
            width: '700px',
            height: '700px',
            background: 'radial-gradient(circle, oklch(0.42 0.21 270 / 0.18) 0%, transparent 65%)',
          }}
        />

        {/* Abstract scales of justice — SVG decoration */}
        <div
          className="absolute right-6 md:right-20 top-1/2 -translate-y-1/2 pointer-events-none select-none hidden md:block"
          style={{ opacity: 0.11 }}
          aria-hidden
        >
          <svg width="420" height="420" viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Crossbar & post */}
            <circle cx="210" cy="60" r="10" fill="white" />
            <rect x="208" y="70" width="4" height="115" fill="white" />
            <rect x="65" y="128" width="290" height="3" rx="1.5" fill="white" />
            {/* Left pan chain */}
            <circle cx="65" cy="129.5" r="6" fill="white" />
            <rect x="63" y="135" width="4" height="72" fill="white" />
            <ellipse cx="65" cy="207" rx="44" ry="13" stroke="white" strokeWidth="2" fill="none" />
            {/* Right pan chain */}
            <circle cx="355" cy="129.5" r="6" fill="white" />
            <rect x="353" y="135" width="4" height="72" fill="white" />
            <ellipse cx="355" cy="207" rx="44" ry="13" stroke="white" strokeWidth="2" fill="none" />
            {/* Base */}
            <rect x="160" y="185" width="100" height="4" rx="2" fill="white" />
            {/* Decorative rings */}
            <circle cx="210" cy="310" r="55" stroke="white" strokeWidth="0.6" fill="none" opacity="0.5" />
            <circle cx="210" cy="310" r="80" stroke="white" strokeWidth="0.35" fill="none" opacity="0.3" />
            <circle cx="90"  cy="340" r="32" stroke="white" strokeWidth="0.35" fill="none" opacity="0.25" />
            <circle cx="345" cy="300" r="42" stroke="white" strokeWidth="0.35" fill="none" opacity="0.25" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28 w-full">
          <div className="max-w-[600px]">

            {/* Status badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.14] bg-white/[0.05] mb-8 animate-fade-in">
              <span
                className="w-2 h-2 rounded-full bg-emerald-400 block shrink-0"
                style={{ boxShadow: '0 0 7px #34d399' }}
              />
              <span className="text-[11px] text-white/55 font-medium tracking-[0.15em] uppercase">
                Plataforma Jurídica Digital
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-heading text-5xl sm:text-6xl md:text-[4.25rem] font-bold leading-[1.05] mb-6 animate-fade-in-up delay-75">
              {dict.landing.hero_title}
            </h1>

            {/* Subtitle */}
            <p className="text-[1.0625rem] text-white/50 mb-10 max-w-[440px] leading-relaxed animate-fade-in-up delay-150">
              {dict.landing.hero_subtitle}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up delay-250">
              <Link href={`/${locale}/servicos`}>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white h-12 px-7 text-sm font-semibold gap-1.5 group"
                >
                  {dict.landing.cta_primary}
                  <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
              <Link href={`/${locale}/cadastro`}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/[0.16] bg-white/[0.04] text-white hover:bg-white/[0.08] hover:border-white/[0.24] h-12 px-7 text-sm"
                >
                  {dict.landing.cta_secondary}
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-14 animate-fade-in-up delay-350">
              {stats.map(s => (
                <div key={s.value}>
                  <p className="text-[1.6rem] font-bold text-white font-heading leading-none">{s.value}</p>
                  <p className="text-[11px] text-white/35 mt-1 tracking-wide">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom fade-to-background */}
        <div
          className="absolute bottom-0 inset-x-0 h-28 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, oklch(0.97 0.015 265))' }}
        />
      </section>

      {/* ══════════════════════ HOW IT WORKS ══════════════════════ */}
      <section className="py-24 px-4 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[11px] font-semibold text-primary uppercase tracking-[0.22em] mb-3">
              Como funciona
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Resolva o seu problema jurídico
              <br className="hidden md:block" />
              em 3 passos simples
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative">
            {/* Connecting line */}
            <div
              className="hidden md:block absolute top-[2.2rem] left-[calc(33.33%+0.75rem)] right-[calc(33.33%+0.75rem)] h-px"
              style={{ background: 'linear-gradient(90deg, var(--border), oklch(0.42 0.21 270 / 0.4), var(--border))' }}
            />

            {steps.map((step, i) => (
              <div key={step.number} className="flex flex-col items-center text-center group">
                <div
                  className="w-[4.25rem] h-[4.25rem] rounded-2xl flex items-center justify-center mb-5 relative z-10 transition-transform duration-300 group-hover:-translate-y-1"
                  style={
                    i === 1
                      ? {
                          background: 'var(--gradient-hero)',
                          boxShadow: '0 8px 28px oklch(0.42 0.21 270 / 0.38)',
                        }
                      : {
                          background: 'oklch(1 0 0)',
                          border: '1.5px solid var(--border)',
                          boxShadow: '0 2px 10px oklch(0 0 0 / 0.06)',
                        }
                  }
                >
                  <span
                    className={`text-[1.85rem] font-bold font-heading leading-none ${
                      i === 1 ? 'text-white' : 'text-primary'
                    }`}
                  >
                    {step.number}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[210px]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ FEATURES ══════════════════════ */}
      <section className="py-24 px-4 bg-card">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[11px] font-semibold text-primary uppercase tracking-[0.22em] mb-3">
              Funcionalidades
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              {dict.landing.features_title}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map(f => (
              <div
                key={f.title}
                className="group p-7 rounded-2xl bg-background border border-border hover:border-primary/25 transition-all duration-300 hover:shadow-xl"
                style={{ ['--tw-shadow' as string]: '0 12px 32px oklch(0.42 0.21 270 / 0.07)' }}
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5 text-primary group-hover:bg-primary/[0.15] transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ CTA ══════════════════════ */}
      <section
        className="py-24 px-4 relative overflow-hidden"
        style={{ background: 'var(--gradient-hero)' }}
      >
        <div className="absolute inset-0 bg-grid-white pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 30% 50%, oklch(0.55 0.25 260 / 0.4) 0%, transparent 58%)',
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center text-white">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            {dict.landing.cta_section_title}
          </h2>
          <p className="text-white/60 mb-8 text-base md:text-[1.0625rem] max-w-lg mx-auto leading-relaxed">
            {dict.landing.cta_section_text}
          </p>
          <Link href={`/${locale}/servicos`}>
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/92 font-semibold px-10 h-12 text-sm group gap-1.5"
            >
              {dict.landing.cta_primary}
              <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ══════════════════════ FOOTER ══════════════════════ */}
      <footer style={{ background: '#0b0914' }} className="text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                <ShieldCheck size={15} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="font-semibold text-white text-[15px]">{dict.common.platform_name}</span>
            </div>

            <nav className="flex flex-wrap gap-x-8 gap-y-3">
              {[
                { label: dict.landing.nav_services, href: `/${locale}/servicos` },
                { label: dict.landing.nav_login,    href: `/${locale}/login` },
                { label: dict.landing.nav_register, href: `/${locale}/cadastro` },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/35 hover:text-white/75 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <p className="text-center text-xs text-white/20 mt-8">
            © {new Date().getFullYear()} {dict.common.platform_name}. {dict.landing.footer}
          </p>
        </div>
      </footer>
    </div>
  )
}

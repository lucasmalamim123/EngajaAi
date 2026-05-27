import type { ReactNode } from 'react'
import Link from 'next/link'
import { ShieldCheck, FileText, MessageSquare } from 'lucide-react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">

      {/* ══════ Left decorative panel ══════ */}
      <div
        className="hidden lg:flex lg:w-[44%] xl:w-2/5 flex-col justify-between p-10 xl:p-14 relative overflow-hidden shrink-0"
        style={{
          background:
            'linear-gradient(148deg, #0b0914 0%, #161030 55%, #0e0c1f 100%)',
        }}
      >
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid-white pointer-events-none" />

        {/* Bottom-left purple glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: '15%',
            left: '20%',
            width: '340px',
            height: '340px',
            background:
              'radial-gradient(circle, oklch(0.42 0.21 270 / 0.22) 0%, transparent 65%)',
          }}
        />

        {/* Abstract scales of justice */}
        <div
          className="absolute right-4 top-1/3 -translate-y-1/2 pointer-events-none select-none"
          style={{ opacity: 0.08 }}
          aria-hidden
        >
          <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="150" cy="48" r="9" fill="white" />
            <rect x="148" y="57" width="4" height="90" fill="white" />
            <rect x="45" y="104" width="210" height="2.5" rx="1.25" fill="white" />
            <circle cx="45" cy="105" r="5" fill="white" />
            <circle cx="255" cy="105" r="5" fill="white" />
            <rect x="43" y="110" width="4" height="62" fill="white" />
            <rect x="253" y="110" width="4" height="62" fill="white" />
            <ellipse cx="45"  cy="172" rx="38" ry="12" stroke="white" strokeWidth="1.5" fill="none" />
            <ellipse cx="255" cy="172" rx="38" ry="12" stroke="white" strokeWidth="1.5" fill="none" />
            <rect x="112" y="147" width="76" height="3" rx="1.5" fill="white" />
            <circle cx="150" cy="230" r="46" stroke="white" strokeWidth="0.5" fill="none" opacity="0.5" />
            <circle cx="150" cy="230" r="65" stroke="white" strokeWidth="0.3" fill="none" opacity="0.3" />
          </svg>
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0 group-hover:bg-primary/85 transition-colors">
              <ShieldCheck size={17} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-white text-[15px] tracking-tight">
              Plataforma Jurídica
            </span>
          </Link>
        </div>

        {/* Headline + feature list */}
        <div className="relative z-10">
          <h2 className="font-heading text-4xl xl:text-5xl font-bold text-white leading-[1.1] mb-4">
            Direito ao seu<br />alcance.
          </h2>
          <p className="text-white/45 text-[0.9375rem] leading-relaxed max-w-[280px] mb-10">
            Serviços jurídicos acessíveis, digitais e seguros para si e a sua família.
          </p>

          <div className="flex flex-col gap-3.5">
            {[
              { icon: <ShieldCheck size={15} />, text: 'Dados encriptados e seguros' },
              { icon: <FileText size={15} />,    text: 'Contratos digitais certificados' },
              { icon: <MessageSquare size={15} />, text: 'Comunicação direta com advogado' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.07] flex items-center justify-center text-white/50 shrink-0">
                  {f.icon}
                </div>
                <span className="text-sm text-white/45">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div className="relative z-10 border-t border-white/[0.09] pt-6">
          <p className="text-sm text-white/30 italic font-heading leading-snug">
            &ldquo;A justiça adiada é a justiça negada.&rdquo;
          </p>
          <p className="text-xs text-white/18 mt-1.5">— William E. Gladstone</p>
        </div>
      </div>

      {/* ══════ Right form panel ══════ */}
      <div className="flex-1 flex items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-[420px]">

          {/* Mobile logo */}
          <div className="text-center mb-8 lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2 justify-center">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <ShieldCheck size={15} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="font-semibold text-primary text-base tracking-tight">
                Plataforma Jurídica
              </span>
            </Link>
            <p className="text-xs text-muted-foreground mt-2">Seu escritório digital</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}

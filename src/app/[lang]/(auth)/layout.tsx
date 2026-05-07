import type { ReactNode } from 'react'
import { ShieldCheck, FileText, MessageSquare } from 'lucide-react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <div
        className="hidden lg:flex lg:w-1/2 xl:w-2/5 flex-col items-center justify-center p-12 text-white"
        style={{ background: 'var(--gradient-hero)' }}
      >
        <div className="max-w-sm">
          <h1 className="text-3xl font-bold mb-3">Plataforma Jurídica</h1>
          <p className="text-white/75 text-lg leading-relaxed">
            Serviços jurídicos acessíveis, simples e seguros para você e sua família.
          </p>
          <div className="flex gap-6 mt-10">
            <div className="flex flex-col items-center gap-2 opacity-70">
              <ShieldCheck size={28} />
              <span className="text-xs text-white/70">Seguro</span>
            </div>
            <div className="flex flex-col items-center gap-2 opacity-70">
              <FileText size={28} />
              <span className="text-xs text-white/70">Digital</span>
            </div>
            <div className="flex flex-col items-center gap-2 opacity-70">
              <MessageSquare size={28} />
              <span className="text-xs text-white/70">Direto</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <h1 className="text-2xl font-bold text-primary">Plataforma Jurídica</h1>
            <p className="text-sm text-muted-foreground mt-1">Seu escritório digital</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

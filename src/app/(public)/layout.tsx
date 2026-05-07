import type { ReactNode } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-gray-900">
            Plataforma Jurídica
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/servicos" className="text-sm text-gray-600 hover:text-gray-900">
              Serviços
            </Link>
            <Link href="/login">
              <Button variant="outline" size="sm">Entrar</Button>
            </Link>
            <Link href="/cadastro">
              <Button size="sm">Cadastrar</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Plataforma Jurídica. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  )
}

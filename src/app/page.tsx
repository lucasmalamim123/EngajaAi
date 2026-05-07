import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ShieldCheck, FileText, MessageSquare, CreditCard } from 'lucide-react'

const features = [
  {
    icon: <ShieldCheck className="text-primary" size={28} />,
    title: 'Advogados verificados',
    description: 'Todos os advogados têm OAB verificada e atuação comprovada.',
  },
  {
    icon: <FileText className="text-primary" size={28} />,
    title: 'Contratos digitais',
    description: 'Gere, assine e armazene seus contratos com segurança na nuvem.',
  },
  {
    icon: <MessageSquare className="text-primary" size={28} />,
    title: 'Comunicação direta',
    description: 'Troque mensagens com seu advogado diretamente pela plataforma.',
  },
  {
    icon: <CreditCard className="text-primary" size={28} />,
    title: 'Pagamento seguro',
    description: 'Pague com cartão de crédito com total segurança.',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="font-bold text-xl text-primary">Plataforma Jurídica</span>
          <nav className="flex items-center gap-4">
            <Link href="/servicos" className="text-sm text-foreground/70 hover:text-foreground">Serviços</Link>
            <Link href="/login">
              <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
                Entrar
              </Button>
            </Link>
            <Link href="/cadastro"><Button size="sm">Cadastrar</Button></Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="text-white py-24 px-4" style={{ background: 'var(--gradient-hero)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Serviços jurídicos acessíveis,<br />simples e seguros
          </h1>
          <p className="text-lg text-white/75 mb-10 max-w-2xl mx-auto">
            Conectamos você ao advogado ideal para resolver sua situação jurídica com agilidade,
            transparência e preço justo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/servicos">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8">
                Ver serviços disponíveis
              </Button>
            </Link>
            <Link href="/cadastro">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                Criar conta grátis
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Por que escolher nossa plataforma?
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

      {/* CTA */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Pronto para resolver sua situação?</h2>
          <p className="text-muted-foreground mb-8">
            Escolha o serviço, faça o pagamento e um advogado qualificado cuidará do seu caso.
          </p>
          <Link href="/servicos"><Button size="lg">Contratar um serviço</Button></Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Plataforma Jurídica. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { FileText, MessageSquare, CreditCard } from 'lucide-react'
import { formatCurrency, caseStatusLabel, formatDate } from '@/lib/utils'

const statusColor: Record<string, string> = {
  pending:     'bg-yellow-100 text-yellow-700',
  open:        'bg-[#A6DEF7]/40 text-[#2B2BFF]',
  in_progress: 'bg-primary/10 text-primary',
  completed:   'bg-[#16A99B]/10 text-[#16A99B]',
  cancelled:   'bg-red-100 text-red-600',
}

export default async function ClienteDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [casesRes, ticketsRes, paymentsRes] = await Promise.all([
    supabase.from('cases').select('*, service_types(name, price)').eq('client_id', user!.id).order('created_at', { ascending: false }).limit(5),
    supabase.from('tickets').select('*').eq('created_by', user!.id).eq('status', 'open'),
    supabase.from('payments').select('*, cases!inner(client_id)').eq('cases.client_id', user!.id).eq('status', 'paid'),
  ])

  const cases = casesRes.data ?? []
  const openTickets = ticketsRes.data?.length ?? 0
  const totalPaid = (paymentsRes.data ?? []).reduce((s, p) => s + (p.amount ?? 0), 0)
  const inProgress = cases.filter(c => c.status === 'in_progress').length

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Meu painel</h1>

      {/* Hero card */}
      <div className="rounded-2xl p-6 text-white" style={{ background: 'var(--gradient-hero)' }}>
        <p className="text-sm text-white/70 uppercase tracking-wider font-medium">Total de Casos</p>
        <p className="text-5xl font-bold mt-2">{cases.length}</p>
        <div className="flex gap-6 mt-4">
          <div>
            <p className="text-2xl font-semibold">{inProgress}</p>
            <p className="text-xs text-white/60">Em andamento</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{cases.filter(c => c.status === 'open').length}</p>
            <p className="text-xs text-white/60">Aguardando advogado</p>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-[#F62088]/10">
                <MessageSquare size={18} className="text-[#F62088]" />
              </div>
              <div>
                <p className="text-2xl font-bold">{openTickets}</p>
                <p className="text-xs text-muted-foreground">Tickets abertos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-[#16A99B]/10">
                <CreditCard size={18} className="text-[#16A99B]" />
              </div>
              <div>
                <p className="text-lg font-bold">{formatCurrency(totalPaid)}</p>
                <p className="text-xs text-muted-foreground">Total pago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 sm:col-span-1">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-primary/10">
                <FileText size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{cases.filter(c => c.status === 'completed').length}</p>
                <p className="text-xs text-muted-foreground">Concluídos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Casos recentes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Casos recentes</CardTitle>
          <Link href="/cliente/dashboard/casos" className="text-sm text-primary hover:underline">
            Ver todos
          </Link>
        </CardHeader>
        <CardContent>
          {cases.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">Você ainda não tem casos</p>
              <Link href="/servicos" className="text-primary text-sm hover:underline">
                Contratar um serviço
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {cases.map(c => {
                const service = Array.isArray(c.service_types) ? c.service_types[0] : c.service_types
                return (
                  <Link
                    key={c.id}
                    href={`/cliente/dashboard/casos/${c.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-primary">
                          {c.title.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{c.title}</p>
                        <p className="text-xs text-muted-foreground">{service?.name} · {formatDate(c.created_at)}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[c.status] ?? ''}`}>
                      {caseStatusLabel(c.status)}
                    </span>
                  </Link>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

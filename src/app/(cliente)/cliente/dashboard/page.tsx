import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
<<<<<<< HEAD
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

=======
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { FolderOpen, FileText, MessageSquare, CreditCard } from 'lucide-react'
import { formatCurrency, caseStatusLabel, formatDate } from '@/lib/utils'

>>>>>>> 955191e115df3f4d6ded61657ce3ee94843eb863
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
<<<<<<< HEAD
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
=======

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    open: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-indigo-100 text-indigo-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Meu painel</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <FolderOpen className="text-blue-600" size={22} />
              <div>
                <p className="text-2xl font-bold">{cases.length}</p>
                <p className="text-xs text-gray-500">Casos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="text-orange-500" size={22} />
              <div>
                <p className="text-2xl font-bold">{openTickets}</p>
                <p className="text-xs text-gray-500">Tickets abertos</p>
>>>>>>> 955191e115df3f4d6ded61657ce3ee94843eb863
              </div>
            </div>
          </CardContent>
        </Card>
<<<<<<< HEAD

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-[#16A99B]/10">
                <CreditCard size={18} className="text-[#16A99B]" />
              </div>
              <div>
                <p className="text-lg font-bold">{formatCurrency(totalPaid)}</p>
                <p className="text-xs text-muted-foreground">Total pago</p>
=======
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CreditCard className="text-green-600" size={22} />
              <div>
                <p className="text-xl font-bold">{formatCurrency(totalPaid)}</p>
                <p className="text-xs text-gray-500">Total pago</p>
>>>>>>> 955191e115df3f4d6ded61657ce3ee94843eb863
              </div>
            </div>
          </CardContent>
        </Card>
<<<<<<< HEAD

        <Card className="col-span-2 sm:col-span-1">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-primary/10">
                <FileText size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{cases.filter(c => c.status === 'completed').length}</p>
                <p className="text-xs text-muted-foreground">Concluídos</p>
=======
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <FileText className="text-purple-600" size={22} />
              <div>
                <p className="text-2xl font-bold">
                  {cases.filter(c => c.status === 'in_progress').length}
                </p>
                <p className="text-xs text-gray-500">Em andamento</p>
>>>>>>> 955191e115df3f4d6ded61657ce3ee94843eb863
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Casos recentes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Casos recentes</CardTitle>
<<<<<<< HEAD
          <Link href="/cliente/dashboard/casos" className="text-sm text-primary hover:underline">
=======
          <Link href="/cliente/dashboard/casos" className="text-sm text-blue-600 hover:underline">
>>>>>>> 955191e115df3f4d6ded61657ce3ee94843eb863
            Ver todos
          </Link>
        </CardHeader>
        <CardContent>
          {cases.length === 0 ? (
            <div className="text-center py-10">
<<<<<<< HEAD
              <p className="text-muted-foreground mb-4">Você ainda não tem casos</p>
              <Link href="/servicos" className="text-primary text-sm hover:underline">
=======
              <p className="text-gray-400 mb-4">Você ainda não tem casos</p>
              <Link href="/servicos" className="text-blue-600 text-sm hover:underline">
>>>>>>> 955191e115df3f4d6ded61657ce3ee94843eb863
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
<<<<<<< HEAD
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
=======
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm">{c.title}</p>
                      <p className="text-xs text-gray-400">{service?.name} · {formatDate(c.created_at)}</p>
>>>>>>> 955191e115df3f4d6ded61657ce3ee94843eb863
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

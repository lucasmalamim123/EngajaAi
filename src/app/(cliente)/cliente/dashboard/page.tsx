import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { FolderOpen, FileText, MessageSquare, CreditCard } from 'lucide-react'
import { formatCurrency, caseStatusLabel, formatDate } from '@/lib/utils'

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
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CreditCard className="text-green-600" size={22} />
              <div>
                <p className="text-xl font-bold">{formatCurrency(totalPaid)}</p>
                <p className="text-xs text-gray-500">Total pago</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <FileText className="text-purple-600" size={22} />
              <div>
                <p className="text-2xl font-bold">
                  {cases.filter(c => c.status === 'in_progress').length}
                </p>
                <p className="text-xs text-gray-500">Em andamento</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Casos recentes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Casos recentes</CardTitle>
          <Link href="/cliente/dashboard/casos" className="text-sm text-blue-600 hover:underline">
            Ver todos
          </Link>
        </CardHeader>
        <CardContent>
          {cases.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-400 mb-4">Você ainda não tem casos</p>
              <Link href="/servicos" className="text-blue-600 text-sm hover:underline">
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
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm">{c.title}</p>
                      <p className="text-xs text-gray-400">{service?.name} · {formatDate(c.created_at)}</p>
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

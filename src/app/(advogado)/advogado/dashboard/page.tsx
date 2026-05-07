import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { FolderOpen, Clock, CheckCircle, MessageSquare } from 'lucide-react'
import { formatDate, caseStatusLabel } from '@/lib/utils'

export default async function AdvogadoDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [openCasesRes, myCasesRes, ticketsRes] = await Promise.all([
    supabase.from('cases').select('id').eq('status', 'open'),
    supabase.from('case_assignments').select('cases(id, title, status, service_types(name), created_at)').eq('lawyer_id', user!.id).eq('status', 'accepted').limit(5),
    supabase.from('tickets').select('id, status').eq('created_by', user!.id),
  ])

  const openCount = openCasesRes.data?.length ?? 0
  const myAssignments = myCasesRes.data ?? []
  const openTickets = (ticketsRes.data ?? []).filter(t => t.status !== 'closed').length

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Meu painel</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <FolderOpen className="text-blue-600" size={22} />
              <div>
                <p className="text-2xl font-bold">{openCount}</p>
                <p className="text-xs text-gray-500">Disponíveis</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="text-indigo-500" size={22} />
              <div>
                <p className="text-2xl font-bold">{myAssignments.filter(a => { const c = Array.isArray(a.cases) ? a.cases[0] : a.cases; return c?.status === 'in_progress' }).length}</p>
                <p className="text-xs text-gray-500">Em andamento</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={22} />
              <div>
                <p className="text-2xl font-bold">{myAssignments.length}</p>
                <p className="text-xs text-gray-500">Meus casos</p>
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
      </div>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-sm">Meus casos recentes</p>
            <Link href="/advogado/dashboard/meus-casos" className="text-xs text-blue-600 hover:underline">Ver todos</Link>
          </div>
          {myAssignments.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p className="mb-3">Você ainda não aceitou nenhum caso.</p>
              <Link href="/advogado/dashboard/casos-disponiveis" className="text-blue-600 text-sm hover:underline">
                Ver casos disponíveis
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myAssignments.map(a => {
                const c = Array.isArray(a.cases) ? a.cases[0] : a.cases
                const service = Array.isArray(c?.service_types) ? c?.service_types[0] : c?.service_types
                return (
                  <div key={JSON.stringify(a)} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{c?.title}</p>
                      <p className="text-xs text-gray-400">{service?.name} · {c ? formatDate(c.created_at) : ''}</p>
                    </div>
                    <span className="text-xs text-gray-500">{c ? caseStatusLabel(c.status) : ''}</span>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

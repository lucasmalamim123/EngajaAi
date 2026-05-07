import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { formatDate, ticketStatusLabel, shortId } from '@/lib/utils'

export default async function AdvogadoTicketsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Tickets de casos que este advogado está gerenciando
  const { data: assignments } = await supabase
    .from('case_assignments')
    .select('case_id')
    .eq('lawyer_id', user!.id)
    .eq('status', 'accepted')

  const caseIds = (assignments ?? []).map(a => a.case_id)

  const tickets = caseIds.length > 0
    ? (await supabase
        .from('tickets')
        .select('*, cases(title)')
        .in('case_id', caseIds)
        .order('updated_at', { ascending: false })
      ).data ?? []
    : []

  const statusColor: Record<string, string> = {
    open: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-indigo-100 text-indigo-700',
    closed: 'bg-gray-100 text-gray-500',
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>

      {tickets.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16 text-gray-400">
            Nenhum ticket nos seus casos.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tickets.map(ticket => {
            const c = Array.isArray(ticket.cases) ? ticket.cases[0] : ticket.cases
            return (
              <Link key={ticket.id} href={`/advogado/dashboard/tickets/${ticket.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="py-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-sm">{ticket.subject}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {c?.title ?? shortId(ticket.case_id)} · {formatDate(ticket.updated_at)}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${statusColor[ticket.status] ?? ''}`}>
                      {ticketStatusLabel(ticket.status)}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

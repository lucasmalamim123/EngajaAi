import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { formatDate, ticketStatusLabel, shortId } from '@/lib/utils'
import NovoTicketForm from './NovoTicketForm'

export default async function ClienteTicketsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: cases } = await supabase
    .from('cases')
    .select('id, title')
    .eq('client_id', user!.id)
    .in('status', ['open', 'in_progress'])

  const { data: tickets } = await supabase
    .from('tickets')
    .select('*, cases(title)')
    .eq('created_by', user!.id)
    .order('updated_at', { ascending: false })

  const statusColor: Record<string, string> = {
    open: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-indigo-100 text-indigo-700',
    closed: 'bg-gray-100 text-gray-500',
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Tickets de suporte</h1>

      {cases && cases.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Abrir novo ticket</CardTitle></CardHeader>
          <CardContent><NovoTicketForm cases={cases} /></CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {(!tickets || tickets.length === 0) ? (
          <Card>
            <CardContent className="text-center py-12 text-gray-400">
              Nenhum ticket aberto ainda.
            </CardContent>
          </Card>
        ) : tickets.map(ticket => {
          const c = Array.isArray(ticket.cases) ? ticket.cases[0] : ticket.cases
          return (
            <Link key={ticket.id} href={`/cliente/dashboard/tickets/${ticket.id}`}>
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
    </div>
  )
}

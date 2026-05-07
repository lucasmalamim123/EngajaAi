import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, caseStatusLabel, formatDate, shortId } from '@/lib/utils'
import { Plus } from 'lucide-react'

export default async function ClienteCasosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: cases } = await supabase
    .from('cases')
    .select('*, service_types(name, price, category), case_assignments(lawyer_id, status)')
    .eq('client_id', user!.id)
    .order('created_at', { ascending: false })

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    open: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-indigo-100 text-indigo-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Meus casos</h1>
        <Link href="/servicos">
          <Button size="sm"><Plus size={16} className="mr-1" /> Novo caso</Button>
        </Link>
      </div>

      {(!cases || cases.length === 0) ? (
        <Card>
          <CardContent className="text-center py-16">
            <p className="text-gray-400 mb-4">Você ainda não tem casos</p>
            <Link href="/servicos"><Button>Contratar um serviço</Button></Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {cases.map(c => {
            const service = Array.isArray(c.service_types) ? c.service_types[0] : c.service_types
            const hasLawyer = (c.case_assignments ?? []).some((a: { status: string }) => a.status === 'accepted')
            return (
              <Link key={c.id} href={`/cliente/dashboard/casos/${c.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="py-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{c.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {service?.name} · #{shortId(c.id)} · {formatDate(c.created_at)}
                      </p>
                      {!hasLawyer && c.status === 'open' && (
                        <p className="text-xs text-orange-500 mt-1">Aguardando advogado aceitar</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <p className="text-sm font-semibold text-gray-700">
                        {formatCurrency(service?.price ?? 0)}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${statusColor[c.status] ?? ''}`}>
                        {caseStatusLabel(c.status)}
                      </span>
                    </div>
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

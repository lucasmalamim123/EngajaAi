import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, caseStatusLabel, shortId, formatCurrency } from '@/lib/utils'

type CaseRow = {
  id: string; title: string; status: string; created_at: string
  service_types: { name: string; price: number } | null
  profiles: { full_name: string } | null
}

export default async function AdminCasosPage() {
  const supabase = await createClient()
  const { data: cases } = await supabase
    .from('cases')
    .select('*, service_types(name, price), profiles(full_name)')
    .order('created_at', { ascending: false }) as { data: CaseRow[] | null }

  const statusColor: Record<string, string> = {
    pending:     'bg-yellow-100 text-yellow-700',
    open:        'bg-[#A6DEF7]/40 text-[#2B2BFF]',
    in_progress: 'bg-primary/10 text-primary',
    completed:   'bg-[#16A99B]/10 text-[#16A99B]',
    cancelled:   'bg-red-100 text-red-600',
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Casos</h1>
      <Card>
        <CardHeader><CardTitle className="text-base">Todos os casos ({cases?.length ?? 0})</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">ID</th>
                  <th className="pb-3 pr-4 font-medium">Título</th>
                  <th className="pb-3 pr-4 font-medium">Cliente</th>
                  <th className="pb-3 pr-4 font-medium">Serviço</th>
                  <th className="pb-3 pr-4 font-medium">Valor</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {(cases ?? []).map(c => {
                  const service = Array.isArray(c.service_types) ? c.service_types[0] : c.service_types
                  const client = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles
                  return (
                    <tr key={c.id} className="border-b last:border-0 hover:bg-accent/20">
                      <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">#{shortId(c.id)}</td>
                      <td className="py-3 pr-4 font-medium max-w-[200px] truncate">{c.title}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{client?.full_name ?? '—'}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{service?.name ?? '—'}</td>
                      <td className="py-3 pr-4 font-semibold">{formatCurrency(service?.price ?? 0)}</td>
                      <td className="py-3 pr-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[c.status] ?? ''}`}>
                          {caseStatusLabel(c.status)}
                        </span>
                      </td>
                      <td className="py-3 text-muted-foreground">{formatDate(c.created_at)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

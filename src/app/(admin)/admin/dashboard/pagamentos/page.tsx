import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate, shortId } from '@/lib/utils'

export default async function AdminPagamentosPage() {
  const supabase = await createClient()
  const { data: payments } = await supabase
    .from('payments')
    .select('*, cases(title, profiles(full_name))')
    .order('created_at', { ascending: false })

  const totalPaid = (payments ?? []).filter(p => p.status === 'paid').reduce((s, p) => s + (p.amount ?? 0), 0)

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
    refunded: 'bg-gray-100 text-gray-500',
  }
  const statusLabel: Record<string, string> = {
    pending: 'Pendente',
    paid: 'Pago',
    failed: 'Falhou',
    refunded: 'Reembolsado',
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Pagamentos</h1>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-gray-500 mb-1">Total recebido</p>
            <p className="text-2xl font-bold text-green-700">{formatCurrency(totalPaid)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-gray-500 mb-1">Transações</p>
            <p className="text-2xl font-bold">{payments?.length ?? 0}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Todas as transações</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-3 pr-4 font-medium">ID</th>
                  <th className="pb-3 pr-4 font-medium">Caso</th>
                  <th className="pb-3 pr-4 font-medium">Cliente</th>
                  <th className="pb-3 pr-4 font-medium">Valor</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {(payments ?? []).map(p => {
                  const c = Array.isArray(p.cases) ? p.cases[0] : p.cases
                  const client = Array.isArray(c?.profiles) ? c?.profiles[0] : c?.profiles
                  return (
                    <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-3 pr-4 font-mono text-xs text-gray-400">#{shortId(p.id)}</td>
                      <td className="py-3 pr-4 font-medium">{c?.title ?? '—'}</td>
                      <td className="py-3 pr-4 text-gray-500">{client?.full_name ?? '—'}</td>
                      <td className="py-3 pr-4 font-semibold">{formatCurrency(p.amount)}</td>
                      <td className="py-3 pr-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[p.status] ?? ''}`}>
                          {statusLabel[p.status] ?? p.status}
                        </span>
                      </td>
                      <td className="py-3 text-gray-400">{formatDate(p.created_at)}</td>
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

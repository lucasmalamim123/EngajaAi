import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate, shortId, caseStatusLabel } from '@/lib/utils'
import { TrendingUp, Users, Percent } from 'lucide-react'

const statusColor: Record<string, string> = {
  pending:     'bg-yellow-100 text-yellow-700',
  open:        'bg-[#A6DEF7]/40 text-[#2B2BFF]',
  in_progress: 'bg-primary/10 text-primary',
  completed:   'bg-[#16A99B]/10 text-[#16A99B]',
  cancelled:   'bg-red-100 text-red-600',
}

export default async function IndicacoesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: engager } = await supabase
    .from('engagers')
    .select('commission_rate, referral_code')
    .eq('profile_id', user!.id)
    .single()

  const { data: cases } = await supabase
    .from('cases')
    .select('*, service_types(name, price, category), profiles(full_name)')
    .eq('engager_id', user!.id)
    .order('created_at', { ascending: false })

  const commission = engager?.commission_rate ?? 10
  const total = cases?.length ?? 0
  const converted = (cases ?? []).filter(c => c.status === 'in_progress' || c.status === 'completed').length
  const totalCommission = (cases ?? [])
    .filter(c => c.status === 'in_progress' || c.status === 'completed')
    .reduce((sum, c) => {
      const service = Array.isArray(c.service_types) ? c.service_types[0] : c.service_types as any
      return sum + ((service?.price ?? 0) * commission / 100)
    }, 0)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Minhas indicações</h1>

      {/* Hero */}
      <div className="rounded-2xl p-6 text-white" style={{ background: 'var(--gradient-hero)' }}>
        <p className="text-sm text-white/70 uppercase tracking-wider font-medium">Comissão Total Estimada</p>
        <p className="text-4xl font-bold mt-2">{formatCurrency(totalCommission)}</p>
        <div className="flex gap-6 mt-4">
          <div>
            <p className="text-2xl font-semibold">{total}</p>
            <p className="text-xs text-white/60">Indicações</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{converted}</p>
            <p className="text-xs text-white/60">Convertidas</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{commission}%</p>
            <p className="text-xs text-white/60">Taxa</p>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-primary/10">
                <Users size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{total}</p>
                <p className="text-xs text-muted-foreground">Total de indicações</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-[#16A99B]/10">
                <TrendingUp size={18} className="text-[#16A99B]" />
              </div>
              <div>
                <p className="text-2xl font-bold">{converted}</p>
                <p className="text-xs text-muted-foreground">Convertidas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-[#F62088]/10">
                <Percent size={18} className="text-[#F62088]" />
              </div>
              <div>
                <p className="text-2xl font-bold">{commission}%</p>
                <p className="text-xs text-muted-foreground">Sua taxa de comissão</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Histórico de indicações</CardTitle>
        </CardHeader>
        <CardContent>
          {(!cases || cases.length === 0) ? (
            <p className="text-center text-muted-foreground text-sm py-10">
              Nenhuma indicação registrada ainda.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">ID</th>
                    <th className="pb-3 pr-4 font-medium">Caso</th>
                    <th className="pb-3 pr-4 font-medium">Cliente</th>
                    <th className="pb-3 pr-4 font-medium">Serviço</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                    <th className="pb-3 pr-4 font-medium">Comissão</th>
                    <th className="pb-3 font-medium">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map(c => {
                    const service = Array.isArray(c.service_types) ? c.service_types[0] : c.service_types as any
                    const client = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles as any
                    const earned = (c.status === 'in_progress' || c.status === 'completed')
                      ? (service?.price ?? 0) * commission / 100
                      : null
                    return (
                      <tr key={c.id} className="border-b last:border-0 hover:bg-accent/20 transition-colors">
                        <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">
                          #{shortId(c.id)}
                        </td>
                        <td className="py-3 pr-4 font-medium max-w-[180px] truncate">
                          {c.title}
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground">
                          {client?.full_name ?? '—'}
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground">
                          {service?.name ?? '—'}
                        </td>
                        <td className="py-3 pr-4">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[c.status] ?? 'bg-gray-100 text-gray-500'}`}>
                            {caseStatusLabel(c.status)}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          {earned !== null ? (
                            <span className="font-semibold text-[#16A99B]">+{formatCurrency(earned)}</span>
                          ) : (
                            <span className="text-muted-foreground text-xs">Pendente</span>
                          )}
                        </td>
                        <td className="py-3 text-muted-foreground text-xs">
                          {formatDate(c.created_at)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Copy, Link2, Users, DollarSign } from 'lucide-react'
import CopyButton from './CopyButton'

export default async function EngajadorDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: engager } = await supabase
    .from('engagers')
    .select('*')
    .eq('profile_id', user!.id)
    .single()

  const { data: indicacoes } = await supabase
    .from('cases')
    .select('id, title, status, service_types(price), created_at')
    .eq('engager_id', user!.id)
    .order('created_at', { ascending: false })

  const totalCases = indicacoes?.length ?? 0
  const paidCases = (indicacoes ?? []).filter(c => c.status === 'in_progress' || c.status === 'completed')
  const commission = engager?.commission_rate ?? 10
  const totalCommission = paidCases.reduce((sum, c) => {
    const service = Array.isArray(c.service_types) ? c.service_types[0] : c.service_types
    return sum + ((service?.price ?? 0) * commission / 100)
  }, 0)

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const referralUrl = engager ? `${appUrl}/cadastro?ref=${engager.referral_code}` : ''

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Meu painel</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="text-blue-600" size={22} />
              <div>
                <p className="text-2xl font-bold">{totalCases}</p>
                <p className="text-xs text-gray-500">Indicações</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <DollarSign className="text-green-600" size={22} />
              <div>
                <p className="text-xl font-bold">{formatCurrency(totalCommission)}</p>
                <p className="text-xs text-gray-500">Comissão estimada ({commission}%)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Link2 className="text-purple-600" size={22} />
              <div>
                <p className="text-lg font-bold">{engager?.referral_code ?? '—'}</p>
                <p className="text-xs text-gray-500">Código de indicação</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {engager && (
        <Card>
          <CardHeader><CardTitle className="text-base">Seu link de indicação</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 bg-gray-50 border rounded-lg px-4 py-3">
              <p className="flex-1 text-sm text-gray-700 truncate">{referralUrl}</p>
              <CopyButton text={referralUrl} />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Compartilhe esse link. Quando um cliente se cadastrar por ele e contratar um serviço, você ganha {commission}% de comissão.
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Últimas indicações</CardTitle>
        </CardHeader>
        <CardContent>
          {(!indicacoes || indicacoes.length === 0) ? (
            <p className="text-gray-400 text-sm text-center py-6">Nenhuma indicação ainda.</p>
          ) : (
            <div className="space-y-3">
              {indicacoes.map(c => {
                const service = Array.isArray(c.service_types) ? c.service_types[0] : c.service_types
                return (
                  <div key={c.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{c.title}</p>
                      <p className="text-xs text-gray-400">{formatDate(c.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">
                        +{formatCurrency((service?.price ?? 0) * commission / 100)}
                      </p>
                      <p className="text-xs text-gray-400">{c.status}</p>
                    </div>
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

import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
<<<<<<< HEAD
import { formatCurrency, formatDate } from '@/lib/utils'
import { Link2, Users } from 'lucide-react'
=======
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Copy, Link2, Users, DollarSign } from 'lucide-react'
>>>>>>> 955191e115df3f4d6ded61657ce3ee94843eb863
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
<<<<<<< HEAD
    const service = Array.isArray(c.service_types) ? c.service_types[0] : c.service_types as any
=======
    const service = Array.isArray(c.service_types) ? c.service_types[0] : c.service_types
>>>>>>> 955191e115df3f4d6ded61657ce3ee94843eb863
    return sum + ((service?.price ?? 0) * commission / 100)
  }, 0)

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const referralUrl = engager ? `${appUrl}/cadastro?ref=${engager.referral_code}` : ''

  return (
    <div className="space-y-6">
<<<<<<< HEAD
      <h1 className="text-2xl font-bold text-foreground">Meu painel</h1>

      {/* Hero card */}
      <div className="rounded-2xl p-6 text-white" style={{ background: 'var(--gradient-hero)' }}>
        <p className="text-sm text-white/70 uppercase tracking-wider font-medium">Comissão Estimada</p>
        <p className="text-4xl font-bold mt-2">{formatCurrency(totalCommission)}</p>
        <div className="flex gap-6 mt-4">
          <div>
            <p className="text-2xl font-semibold">{totalCases}</p>
            <p className="text-xs text-white/60">Indicações totais</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{commission}%</p>
            <p className="text-xs text-white/60">Taxa de comissão</p>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-primary/10">
                <Link2 size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold">{engager?.referral_code ?? '—'}</p>
                <p className="text-xs text-muted-foreground">Código de indicação</p>
=======
      <h1 className="text-2xl font-bold text-gray-900">Meu painel</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="text-blue-600" size={22} />
              <div>
                <p className="text-2xl font-bold">{totalCases}</p>
                <p className="text-xs text-gray-500">Indicações</p>
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
                <Users size={18} className="text-[#16A99B]" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalCases}</p>
                <p className="text-xs text-muted-foreground">Indicações</p>
=======
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
>>>>>>> 955191e115df3f4d6ded61657ce3ee94843eb863
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {engager && (
        <Card>
          <CardHeader><CardTitle className="text-base">Seu link de indicação</CardTitle></CardHeader>
          <CardContent>
<<<<<<< HEAD
            <div className="flex items-center gap-3 bg-muted/50 border border-border rounded-lg px-4 py-3">
              <p className="flex-1 text-sm text-foreground truncate">{referralUrl}</p>
              <CopyButton text={referralUrl} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
=======
            <div className="flex items-center gap-3 bg-gray-50 border rounded-lg px-4 py-3">
              <p className="flex-1 text-sm text-gray-700 truncate">{referralUrl}</p>
              <CopyButton text={referralUrl} />
            </div>
            <p className="text-xs text-gray-400 mt-2">
>>>>>>> 955191e115df3f4d6ded61657ce3ee94843eb863
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
<<<<<<< HEAD
            <p className="text-muted-foreground text-sm text-center py-6">Nenhuma indicação ainda.</p>
          ) : (
            <div className="space-y-3">
              {indicacoes.map(c => {
                const service = Array.isArray(c.service_types) ? c.service_types[0] : c.service_types as any
                return (
                  <div key={c.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/30 transition-colors">
                    <div>
                      <p className="text-sm font-medium">{c.title}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(c.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#16A99B]">
                        +{formatCurrency((service?.price ?? 0) * commission / 100)}
                      </p>
                      <p className="text-xs text-muted-foreground">{c.status}</p>
=======
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
>>>>>>> 955191e115df3f4d6ded61657ce3ee94843eb863
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

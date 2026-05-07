import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Link2, Users } from 'lucide-react'
import { getDictionary, hasLocale, defaultLocale, type Locale } from '@/lib/i18n'
import CopyButton from './CopyButton'

export default async function EngajadorDashboardPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale: Locale = hasLocale(lang) ? lang : defaultLocale
  const dict = await getDictionary(locale)

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
    const service = Array.isArray(c.service_types) ? c.service_types[0] : c.service_types as any
    return sum + ((service?.price ?? 0) * commission / 100)
  }, 0)

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const referralUrl = engager ? `${appUrl}/${lang}/cadastro?ref=${engager.referral_code}` : ''

  const commissionInfo = dict.engager.dashboard.commission_info.replace('{rate}', String(commission))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">{dict.engager.dashboard.title}</h1>

      <div className="rounded-2xl p-6 text-white" style={{ background: 'var(--gradient-hero)' }}>
        <p className="text-sm text-white/70 uppercase tracking-wider font-medium">{dict.engager.dashboard.estimated_commission}</p>
        <p className="text-4xl font-bold mt-2">{formatCurrency(totalCommission, locale)}</p>
        <div className="flex gap-6 mt-4">
          <div>
            <p className="text-2xl font-semibold">{totalCases}</p>
            <p className="text-xs text-white/60">{dict.engager.dashboard.referrals}</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{commission}%</p>
            <p className="text-xs text-white/60">{dict.engager.dashboard.rate}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-primary/10">
                <Link2 size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold">{engager?.referral_code ?? '—'}</p>
                <p className="text-xs text-muted-foreground">{dict.engager.dashboard.referral_code}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-[#16A99B]/10">
                <Users size={18} className="text-[#16A99B]" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalCases}</p>
                <p className="text-xs text-muted-foreground">{dict.engager.dashboard.referrals}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {engager && (
        <Card>
          <CardHeader><CardTitle className="text-base">{dict.engager.dashboard.referral_link}</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 bg-muted/50 border border-border rounded-lg px-4 py-3">
              <p className="flex-1 text-sm text-foreground truncate">{referralUrl}</p>
              <CopyButton text={referralUrl} labels={{ copy: dict.common.copy, copied: dict.common.copied }} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">{commissionInfo}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{dict.engager.dashboard.recent_referrals}</CardTitle>
        </CardHeader>
        <CardContent>
          {(!indicacoes || indicacoes.length === 0) ? (
            <p className="text-muted-foreground text-sm text-center py-6">{dict.engager.dashboard.no_referrals}</p>
          ) : (
            <div className="space-y-3">
              {indicacoes.map(c => {
                const service = Array.isArray(c.service_types) ? c.service_types[0] : c.service_types as any
                return (
                  <div key={c.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/30 transition-colors">
                    <div>
                      <p className="text-sm font-medium">{c.title}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(c.created_at, locale)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#16A99B]">
                        +{formatCurrency((service?.price ?? 0) * commission / 100, locale)}
                      </p>
                      <p className="text-xs text-muted-foreground">{dict.status.case[c.status] ?? c.status}</p>
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

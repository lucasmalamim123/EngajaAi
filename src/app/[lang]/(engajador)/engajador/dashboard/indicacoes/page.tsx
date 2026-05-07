import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate, shortId } from '@/lib/utils'
import { TrendingUp, Users, Percent } from 'lucide-react'
import { getDictionary, hasLocale, defaultLocale, type Locale } from '@/lib/i18n'

const statusColor: Record<string, string> = {
  pending:     'bg-yellow-100 text-yellow-700',
  open:        'bg-[#A6DEF7]/40 text-[#2B2BFF]',
  in_progress: 'bg-primary/10 text-primary',
  completed:   'bg-[#16A99B]/10 text-[#16A99B]',
  cancelled:   'bg-red-100 text-red-600',
}

export default async function IndicacoesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale: Locale = hasLocale(lang) ? lang : defaultLocale
  const dict = await getDictionary(locale)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: engager } = await supabase
    .from('engagers')
    .select('commission_rate, referral_code')
    .eq('profile_id', user!.id)
    .single()

  const { data: cases } = await supabase
    .from('cases')
    .select('*, service_types(name, price, category), profiles!client_id(full_name)')
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
      <h1 className="text-2xl font-bold text-foreground">{dict.engager.referrals.title}</h1>

      <div className="rounded-2xl p-6 text-white" style={{ background: 'var(--gradient-hero)' }}>
        <p className="text-sm text-white/70 uppercase tracking-wider font-medium">{dict.engager.referrals.total_commission}</p>
        <p className="text-4xl font-bold mt-2">{formatCurrency(totalCommission, locale)}</p>
        <div className="flex gap-6 mt-4">
          <div>
            <p className="text-2xl font-semibold">{total}</p>
            <p className="text-xs text-white/60">{dict.engager.referrals.total}</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{converted}</p>
            <p className="text-xs text-white/60">{dict.engager.referrals.converted}</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{commission}%</p>
            <p className="text-xs text-white/60">{dict.engager.referrals.rate}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-primary/10">
                <Users size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{total}</p>
                <p className="text-xs text-muted-foreground">{dict.engager.referrals.total}</p>
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
                <p className="text-xs text-muted-foreground">{dict.engager.referrals.converted}</p>
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
                <p className="text-xs text-muted-foreground">{dict.engager.referrals.rate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{dict.engager.referrals.history}</CardTitle>
        </CardHeader>
        <CardContent>
          {(!cases || cases.length === 0) ? (
            <p className="text-center text-muted-foreground text-sm py-10">
              {dict.engager.referrals.no_referrals}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">{dict.engager.referrals.id}</th>
                    <th className="pb-3 pr-4 font-medium">{dict.engager.referrals.case}</th>
                    <th className="pb-3 pr-4 font-medium">{dict.engager.referrals.client}</th>
                    <th className="pb-3 pr-4 font-medium">{dict.engager.referrals.service}</th>
                    <th className="pb-3 pr-4 font-medium">{dict.common.status}</th>
                    <th className="pb-3 pr-4 font-medium">{dict.engager.referrals.commission}</th>
                    <th className="pb-3 font-medium">{dict.common.date}</th>
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
                        <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">#{shortId(c.id)}</td>
                        <td className="py-3 pr-4 font-medium max-w-[180px] truncate">{c.title}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{client?.full_name ?? '—'}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{service?.name ?? '—'}</td>
                        <td className="py-3 pr-4">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[c.status] ?? 'bg-muted text-muted-foreground'}`}>
                            {dict.status.case[c.status] ?? c.status}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          {earned !== null ? (
                            <span className="font-semibold text-[#16A99B]">+{formatCurrency(earned, locale)}</span>
                          ) : (
                            <span className="text-muted-foreground text-xs">{dict.engager.referrals.pending_commission}</span>
                          )}
                        </td>
                        <td className="py-3 text-muted-foreground text-xs">{formatDate(c.created_at, locale)}</td>
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

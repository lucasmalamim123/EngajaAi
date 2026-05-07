import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate, shortId } from '@/lib/utils'
import { getDictionary, hasLocale, defaultLocale, type Locale } from '@/lib/i18n'

const statusColor: Record<string, string> = {
  pending:  'bg-yellow-100 text-yellow-700',
  paid:     'bg-[#16A99B]/10 text-[#16A99B]',
  failed:   'bg-red-100 text-red-700',
  refunded: 'bg-muted text-muted-foreground',
}

export default async function AdminPagamentosPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale: Locale = hasLocale(lang) ? lang : defaultLocale
  const dict = await getDictionary(locale)

  const supabase = await createClient()
  const { data: payments } = await supabase
    .from('payments')
    .select('*, cases(title, profiles!client_id(full_name))')
    .order('created_at', { ascending: false })

  const totalPaid = (payments ?? []).filter(p => p.status === 'paid').reduce((s, p) => s + (p.amount ?? 0), 0)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">{dict.admin.payments.title}</h1>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground mb-1">{dict.admin.payments.total_received}</p>
            <p className="text-2xl font-bold text-[#16A99B]">{formatCurrency(totalPaid, locale)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground mb-1">{dict.admin.payments.transactions}</p>
            <p className="text-2xl font-bold">{payments?.length ?? 0}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">{dict.admin.payments.all_transactions}</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">{dict.common.id}</th>
                  <th className="pb-3 pr-4 font-medium">{dict.admin.payments.case}</th>
                  <th className="pb-3 pr-4 font-medium">{dict.admin.payments.client}</th>
                  <th className="pb-3 pr-4 font-medium">{dict.admin.payments.amount}</th>
                  <th className="pb-3 pr-4 font-medium">{dict.common.status}</th>
                  <th className="pb-3 font-medium">{dict.common.date}</th>
                </tr>
              </thead>
              <tbody>
                {(payments ?? []).map(p => {
                  const c = Array.isArray(p.cases) ? p.cases[0] : p.cases
                  const client = Array.isArray(c?.profiles) ? c?.profiles[0] : c?.profiles
                  return (
                    <tr key={p.id} className="border-b last:border-0 hover:bg-accent/20 transition-colors">
                      <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">#{shortId(p.id)}</td>
                      <td className="py-3 pr-4 font-medium">{c?.title ?? '—'}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{client?.full_name ?? '—'}</td>
                      <td className="py-3 pr-4 font-semibold">{formatCurrency(p.amount, locale)}</td>
                      <td className="py-3 pr-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[p.status] ?? ''}`}>
                          {dict.status.payment[p.status] ?? p.status}
                        </span>
                      </td>
                      <td className="py-3 text-muted-foreground">{formatDate(p.created_at, locale)}</td>
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

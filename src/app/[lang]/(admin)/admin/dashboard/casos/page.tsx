import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, shortId, formatCurrency } from '@/lib/utils'
import { getDictionary, hasLocale, defaultLocale, type Locale } from '@/lib/i18n'

type CaseRow = {
  id: string; title: string; status: string; created_at: string
  service_types: { name: string; price: number } | null
  profiles: { full_name: string } | null
}

const statusColor: Record<string, string> = {
  pending:     'bg-yellow-100 text-yellow-700',
  open:        'bg-[#A6DEF7]/40 text-[#2B2BFF]',
  in_progress: 'bg-primary/10 text-primary',
  completed:   'bg-[#16A99B]/10 text-[#16A99B]',
  cancelled:   'bg-red-100 text-red-600',
}

export default async function AdminCasosPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale: Locale = hasLocale(lang) ? lang : defaultLocale
  const dict = await getDictionary(locale)

  const supabase = await createClient()
  const { data: cases } = await supabase
    .from('cases')
    .select('*, service_types(name, price), profiles(full_name)')
    .order('created_at', { ascending: false }) as { data: CaseRow[] | null }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">{dict.nav.cases}</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{dict.admin.cases.title} ({cases?.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">{dict.common.id}</th>
                  <th className="pb-3 pr-4 font-medium">{dict.nav.cases}</th>
                  <th className="pb-3 pr-4 font-medium">{dict.admin.cases.client}</th>
                  <th className="pb-3 pr-4 font-medium">{dict.admin.cases.service}</th>
                  <th className="pb-3 pr-4 font-medium">{dict.admin.cases.value}</th>
                  <th className="pb-3 pr-4 font-medium">{dict.common.status}</th>
                  <th className="pb-3 font-medium">{dict.common.date}</th>
                </tr>
              </thead>
              <tbody>
                {(cases ?? []).map(c => {
                  const service = Array.isArray(c.service_types) ? c.service_types[0] : c.service_types
                  const client = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles
                  return (
                    <tr key={c.id} className="border-b last:border-0 hover:bg-accent/20 transition-colors">
                      <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">#{shortId(c.id)}</td>
                      <td className="py-3 pr-4 font-medium max-w-[200px] truncate">{c.title}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{client?.full_name ?? '—'}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{service?.name ?? '—'}</td>
                      <td className="py-3 pr-4 font-semibold">{formatCurrency(service?.price ?? 0, locale)}</td>
                      <td className="py-3 pr-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[c.status] ?? ''}`}>
                          {dict.status.case[c.status] ?? c.status}
                        </span>
                      </td>
                      <td className="py-3 text-muted-foreground">{formatDate(c.created_at, locale)}</td>
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

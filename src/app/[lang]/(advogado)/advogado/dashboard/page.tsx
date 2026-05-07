import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Clock, CheckCircle, MessageSquare } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { getDictionary, hasLocale, defaultLocale, type Locale } from '@/lib/i18n'

const statusColor: Record<string, string> = {
  pending:     'bg-yellow-100 text-yellow-700',
  open:        'bg-[#A6DEF7]/40 text-[#2B2BFF]',
  in_progress: 'bg-primary/10 text-primary',
  completed:   'bg-[#16A99B]/10 text-[#16A99B]',
  cancelled:   'bg-red-100 text-red-600',
}

export default async function AdvogadoDashboardPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale: Locale = hasLocale(lang) ? lang : defaultLocale
  const dict = await getDictionary(locale)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [openCasesRes, myCasesRes, ticketsRes] = await Promise.all([
    supabase.from('cases').select('id').eq('status', 'open'),
    supabase.from('case_assignments').select('cases(id, title, status, service_types(name), created_at)').eq('lawyer_id', user!.id).eq('status', 'accepted').limit(5),
    supabase.from('tickets').select('id, status').eq('created_by', user!.id),
  ])

  const openCount = openCasesRes.data?.length ?? 0
  const myAssignments = myCasesRes.data ?? []
  const openTickets = (ticketsRes.data ?? []).filter(t => t.status !== 'closed').length
  const inProgress = myAssignments.filter(a => {
    const c = Array.isArray(a.cases) ? a.cases[0] : a.cases
    return (c as any)?.status === 'in_progress'
  }).length

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">{dict.lawyer.dashboard.title}</h1>

      <div className="rounded-2xl p-6 text-white" style={{ background: 'var(--gradient-hero)' }}>
        <p className="text-sm text-white/70 uppercase tracking-wider font-medium">{dict.lawyer.dashboard.available_cases}</p>
        <p className="text-5xl font-bold mt-2">{openCount}</p>
        <div className="flex gap-6 mt-4">
          <div>
            <p className="text-2xl font-semibold">{inProgress}</p>
            <p className="text-xs text-white/60">{dict.status.case.in_progress}</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{myAssignments.length}</p>
            <p className="text-xs text-white/60">{dict.nav.my_cases}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-[#2B2BFF]/10"><Clock size={18} className="text-[#2B2BFF]" /></div>
              <div>
                <p className="text-2xl font-bold">{inProgress}</p>
                <p className="text-xs text-muted-foreground">{dict.lawyer.dashboard.in_progress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-[#16A99B]/10"><CheckCircle size={18} className="text-[#16A99B]" /></div>
              <div>
                <p className="text-2xl font-bold">{myAssignments.length}</p>
                <p className="text-xs text-muted-foreground">{dict.nav.my_cases}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-2 sm:col-span-1">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-[#F62088]/10"><MessageSquare size={18} className="text-[#F62088]" /></div>
              <div>
                <p className="text-2xl font-bold">{openTickets}</p>
                <p className="text-xs text-muted-foreground">{dict.lawyer.dashboard.tickets}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-sm">{dict.nav.my_cases}</p>
            <Link href={`/${lang}/advogado/dashboard/meus-casos`} className="text-xs text-primary hover:underline">{dict.common.see_all}</Link>
          </div>
          {myAssignments.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <p className="mb-3">{dict.lawyer.my_cases.no_cases}</p>
              <Link href={`/${lang}/advogado/dashboard/casos-disponiveis`} className="text-primary text-sm hover:underline">
                {dict.lawyer.my_cases.see_available}
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myAssignments.map((a, i) => {
                const c = Array.isArray(a.cases) ? a.cases[0] : a.cases as any
                const service = Array.isArray(c?.service_types) ? c?.service_types[0] : c?.service_types
                return (
                  <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-primary">
                          {c?.title?.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase() ?? '??'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{c?.title}</p>
                        <p className="text-xs text-muted-foreground">{service?.name} · {c ? formatDate(c.created_at, locale) : ''}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[c?.status] ?? 'bg-muted text-muted-foreground'}`}>
                      {dict.status.case[c?.status] ?? c?.status ?? ''}
                    </span>
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

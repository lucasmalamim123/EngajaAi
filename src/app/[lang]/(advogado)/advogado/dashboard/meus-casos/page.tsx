import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { formatCurrency, formatDate, shortId } from '@/lib/utils'
import { getDictionary, hasLocale, defaultLocale, type Locale } from '@/lib/i18n'

const statusColor: Record<string, string> = {
  open:        'bg-[#A6DEF7]/40 text-[#2B2BFF]',
  in_progress: 'bg-primary/10 text-primary',
  completed:   'bg-[#16A99B]/10 text-[#16A99B]',
  cancelled:   'bg-red-100 text-red-600',
}

export default async function MeusCasosPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale: Locale = hasLocale(lang) ? lang : defaultLocale
  const dict = await getDictionary(locale)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: assignments } = await supabase
    .from('case_assignments')
    .select('*, cases(*, service_types(name, price, category), profiles(full_name))')
    .eq('lawyer_id', user!.id)
    .eq('status', 'accepted')
    .order('accepted_at', { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">{dict.lawyer.my_cases.title}</h1>

      {(!assignments || assignments.length === 0) ? (
        <Card>
          <CardContent className="text-center py-16 text-muted-foreground">
            {dict.lawyer.my_cases.no_cases}{' '}
            <Link href={`/${lang}/advogado/dashboard/casos-disponiveis`} className="text-primary hover:underline">
              {dict.lawyer.my_cases.see_available}
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {assignments.map(a => {
            const c = Array.isArray(a.cases) ? a.cases[0] : a.cases
            const service = Array.isArray(c?.service_types) ? c?.service_types[0] : c?.service_types
            const client = Array.isArray(c?.profiles) ? c?.profiles[0] : c?.profiles
            return (
              <Card key={a.id} className="hover:shadow-md transition-shadow">
                <CardContent className="py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-sm">{c?.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {service?.name} · {dict.lawyer.my_cases.client_label}: {client?.full_name} · #{c ? shortId(c.id) : ''}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {dict.lawyer.my_cases.accepted_at} {formatDate(a.accepted_at, locale)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <p className="text-sm font-semibold">{formatCurrency(service?.price ?? 0, locale)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[c?.status ?? ''] ?? 'bg-muted text-muted-foreground'}`}>
                      {dict.status.case[c?.status ?? ''] ?? c?.status ?? ''}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

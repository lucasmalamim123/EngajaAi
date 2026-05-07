import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, formatDate, shortId } from '@/lib/utils'
import { getDictionary, hasLocale, defaultLocale, type Locale } from '@/lib/i18n'
import AceitarCasoButton from './AceitarCasoButton'

export default async function CasosDisponiveisPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale: Locale = hasLocale(lang) ? lang : defaultLocale
  const dict = await getDictionary(locale)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: myAssignments } = await supabase
    .from('case_assignments')
    .select('case_id')
    .eq('lawyer_id', user!.id)

  const acceptedIds = (myAssignments ?? []).map(a => a.case_id)

  const query = supabase
    .from('cases')
    .select('*, service_types(name, price, category)')
    .eq('status', 'open')
    .order('created_at')

  const { data: cases } = acceptedIds.length > 0
    ? await query.not('id', 'in', `(${acceptedIds.join(',')})`)
    : await query

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{dict.lawyer.available_cases.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{dict.lawyer.available_cases.subtitle}</p>
      </div>

      {(!cases || cases.length === 0) ? (
        <Card>
          <CardContent className="text-center py-16 text-muted-foreground">
            {dict.lawyer.available_cases.no_cases}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {cases.map(c => {
            const service = Array.isArray(c.service_types) ? c.service_types[0] : c.service_types
            return (
              <Card key={c.id}>
                <CardContent className="py-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold">{c.title}</p>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{c.description}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                        <span>{service?.category} · {service?.name}</span>
                        <span>#{shortId(c.id)}</span>
                        <span>{formatDate(c.created_at, locale)}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <p className="text-xl font-bold text-primary">{formatCurrency(service?.price ?? 0, locale)}</p>
                      <AceitarCasoButton
                        caseId={c.id}
                        lawyerId={user!.id}
                        lang={lang}
                        labels={{ accept: dict.lawyer.available_cases.accept, accepting: dict.lawyer.available_cases.accepting }}
                      />
                    </div>
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

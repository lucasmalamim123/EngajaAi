import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { formatDate, shortId } from '@/lib/utils'
import { getDictionary, hasLocale, defaultLocale, type Locale } from '@/lib/i18n'

const statusColor: Record<string, string> = {
  open:        'bg-[#A6DEF7]/40 text-[#2B2BFF]',
  in_progress: 'bg-primary/10 text-primary',
  closed:      'bg-muted text-muted-foreground',
}

export default async function AdvogadoTicketsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale: Locale = hasLocale(lang) ? lang : defaultLocale
  const dict = await getDictionary(locale)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: assignments } = await supabase
    .from('case_assignments')
    .select('case_id')
    .eq('lawyer_id', user!.id)
    .eq('status', 'accepted')

  const caseIds = (assignments ?? []).map(a => a.case_id)

  const tickets = caseIds.length > 0
    ? (await supabase
        .from('tickets')
        .select('*, cases(title)')
        .in('case_id', caseIds)
        .order('updated_at', { ascending: false })
      ).data ?? []
    : []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">{dict.lawyer.tickets.title}</h1>

      {tickets.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16 text-muted-foreground">
            {dict.lawyer.tickets.no_tickets}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tickets.map(ticket => {
            const c = Array.isArray(ticket.cases) ? ticket.cases[0] : ticket.cases
            return (
              <Link key={ticket.id} href={`/${lang}/advogado/dashboard/tickets/${ticket.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="py-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-sm">{ticket.subject}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {c?.title ?? shortId(ticket.case_id)} · {formatDate(ticket.updated_at, locale)}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${statusColor[ticket.status] ?? ''}`}>
                      {dict.status.ticket[ticket.status] ?? ticket.status}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

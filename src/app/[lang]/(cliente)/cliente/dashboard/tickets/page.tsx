import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { formatDate, shortId } from '@/lib/utils'
import { getDictionary, hasLocale, defaultLocale, type Locale } from '@/lib/i18n'
import NovoTicketForm from './NovoTicketForm'

const statusColor: Record<string, string> = {
  open:        'bg-[#A6DEF7]/40 text-[#2B2BFF]',
  in_progress: 'bg-primary/10 text-primary',
  closed:      'bg-muted text-muted-foreground',
}

export default async function ClienteTicketsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale: Locale = hasLocale(lang) ? lang : defaultLocale
  const dict = await getDictionary(locale)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: cases } = await supabase
    .from('cases')
    .select('id, title')
    .eq('client_id', user!.id)
    .in('status', ['open', 'in_progress'])

  const { data: tickets } = await supabase
    .from('tickets')
    .select('*, cases(title)')
    .eq('created_by', user!.id)
    .order('updated_at', { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">{dict.client.tickets.title}</h1>

      {cases && cases.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">{dict.client.tickets.new_ticket}</CardTitle></CardHeader>
          <CardContent>
            <NovoTicketForm
              cases={cases}
              lang={lang}
              labels={{
                case_label: dict.client.tickets.case_label,
                subject_label: dict.client.tickets.subject_label,
                subject_placeholder: dict.client.tickets.subject_placeholder,
                open_button: dict.client.tickets.open_button,
                opening: dict.client.tickets.opening,
              }}
            />
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {(!tickets || tickets.length === 0) ? (
          <Card>
            <CardContent className="text-center py-12 text-muted-foreground">
              {dict.client.tickets.no_tickets}
            </CardContent>
          </Card>
        ) : tickets.map(ticket => {
          const c = Array.isArray(ticket.cases) ? ticket.cases[0] : ticket.cases
          return (
            <Link key={ticket.id} href={`/${lang}/cliente/dashboard/tickets/${ticket.id}`}>
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
    </div>
  )
}

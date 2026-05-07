import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate, shortId } from '@/lib/utils'
import { Plus } from 'lucide-react'
import { getDictionary, hasLocale, defaultLocale, type Locale } from '@/lib/i18n'

const statusColor: Record<string, string> = {
  pending:     'bg-yellow-100 text-yellow-700',
  open:        'bg-[#A6DEF7]/40 text-[#2B2BFF]',
  in_progress: 'bg-primary/10 text-primary',
  completed:   'bg-[#16A99B]/10 text-[#16A99B]',
  cancelled:   'bg-red-100 text-red-600',
}

export default async function ClienteCasosPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale: Locale = hasLocale(lang) ? lang : defaultLocale
  const dict = await getDictionary(locale)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: cases } = await supabase
    .from('cases')
    .select('*, service_types(name, price, category), case_assignments(lawyer_id, status)')
    .eq('client_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">{dict.client.cases.title}</h1>
        <Link href={`/${lang}/servicos`}>
          <Button size="sm"><Plus size={16} className="mr-1" /> {dict.client.cases.new_case}</Button>
        </Link>
      </div>

      {(!cases || cases.length === 0) ? (
        <Card>
          <CardContent className="text-center py-16">
            <p className="text-muted-foreground mb-4">{dict.client.cases.no_cases}</p>
            <Link href={`/${lang}/servicos`}><Button>{dict.client.cases.hire_service}</Button></Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {cases.map(c => {
            const service = Array.isArray(c.service_types) ? c.service_types[0] : c.service_types
            const hasLawyer = (c.case_assignments ?? []).some((a: { status: string }) => a.status === 'accepted')
            return (
              <Link key={c.id} href={`/${lang}/cliente/dashboard/casos/${c.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="py-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{c.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {service?.name} · #{shortId(c.id)} · {formatDate(c.created_at, locale)}
                      </p>
                      {!hasLawyer && c.status === 'open' && (
                        <p className="text-xs text-orange-500 mt-1">{dict.client.cases.waiting_lawyer}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <p className="text-sm font-semibold text-foreground">
                        {formatCurrency(service?.price ?? 0, locale)}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${statusColor[c.status] ?? ''}`}>
                        {dict.status.case[c.status] ?? c.status}
                      </span>
                    </div>
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

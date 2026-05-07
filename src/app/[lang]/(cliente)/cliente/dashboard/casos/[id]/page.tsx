import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { formatCurrency, formatDate, shortId } from '@/lib/utils'
import { getDictionary, hasLocale, defaultLocale, type Locale } from '@/lib/i18n'
import { ArrowLeft } from 'lucide-react'

const statusColor: Record<string, string> = {
  pending:     'bg-yellow-100 text-yellow-700',
  open:        'bg-[#A6DEF7]/40 text-[#2B2BFF]',
  in_progress: 'bg-primary/10 text-primary',
  completed:   'bg-[#16A99B]/10 text-[#16A99B]',
  cancelled:   'bg-red-100 text-red-600',
}

interface Props { params: Promise<{ lang: string; id: string }> }

export default async function CasoDetailPage({ params }: Props) {
  const { lang, id } = await params
  const locale: Locale = hasLocale(lang) ? lang : defaultLocale
  const dict = await getDictionary(locale)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: c } = await supabase
    .from('cases')
    .select('*, service_types(name, price, category), case_assignments(lawyer_id, status, accepted_at, profiles(full_name))')
    .eq('id', id)
    .eq('client_id', user!.id)
    .single()

  if (!c) notFound()

  const service = Array.isArray(c.service_types) ? c.service_types[0] : c.service_types
  const assignment = (c.case_assignments ?? []).find((a: any) => a.status === 'accepted')
  const lawyer = Array.isArray(assignment?.profiles) ? assignment?.profiles[0] : assignment?.profiles

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href={`/${lang}/cliente/dashboard/casos`} className="text-primary hover:underline text-sm flex items-center gap-1">
          <ArrowLeft size={14} /> {dict.common.back}
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{c.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">#{shortId(c.id)} · {formatDate(c.created_at, locale)}</p>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor[c.status] ?? ''}`}>
          {dict.status.case[c.status] ?? c.status}
        </span>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">{dict.services.title}</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{dict.services.category}</span>
            <span className="font-medium">{service?.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{dict.nav.cases}</span>
            <span className="font-medium">{service?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{dict.admin.payments.amount}</span>
            <span className="font-semibold text-primary">{formatCurrency(service?.price ?? 0, locale)}</span>
          </div>
        </CardContent>
      </Card>

      {c.description && (
        <Card>
          <CardHeader><CardTitle className="text-base">{dict.hire.description}</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{c.description}</p>
          </CardContent>
        </Card>
      )}

      {lawyer && (
        <Card>
          <CardHeader><CardTitle className="text-base">{dict.lawyer.my_cases.client_label}</CardTitle></CardHeader>
          <CardContent className="text-sm">
            <p className="font-medium">{lawyer.full_name}</p>
            {assignment?.accepted_at && (
              <p className="text-xs text-muted-foreground mt-1">{dict.lawyer.my_cases.accepted_at} {formatDate(assignment.accepted_at, locale)}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

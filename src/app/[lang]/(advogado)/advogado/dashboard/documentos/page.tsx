import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, shortId } from '@/lib/utils'
import { getDictionary, hasLocale, defaultLocale, type Locale } from '@/lib/i18n'

const statusColor: Record<string, string> = {
  pending:  'bg-yellow-100 text-yellow-700',
  approved: 'bg-[#16A99B]/10 text-[#16A99B]',
  rejected: 'bg-red-100 text-red-700',
}

export default async function AdvogadoDocumentosPage({ params }: { params: Promise<{ lang: string }> }) {
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

  const docs = caseIds.length > 0
    ? (await supabase
        .from('documents')
        .select('*, cases(title), profiles(full_name)')
        .in('case_id', caseIds)
        .order('created_at', { ascending: false })
      ).data ?? []
    : []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">{dict.lawyer.documents.title}</h1>
      <Card>
        <CardHeader><CardTitle className="text-base">{dict.lawyer.documents.received}</CardTitle></CardHeader>
        <CardContent>
          {docs.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">{dict.lawyer.documents.no_documents}</p>
          ) : (
            <div className="space-y-3">
              {docs.map(doc => {
                const c = Array.isArray(doc.cases) ? doc.cases[0] : doc.cases
                const uploader = Array.isArray(doc.profiles) ? doc.profiles[0] : doc.profiles
                return (
                  <div key={doc.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/20 transition-colors">
                    <div className="min-w-0">
                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer"
                         className="text-sm font-medium text-primary hover:underline truncate block">
                        {doc.file_name}
                      </a>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {c?.title ?? shortId(doc.case_id)} · {uploader?.full_name ?? '?'} · {formatDate(doc.created_at, locale)}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${statusColor[doc.status] ?? ''}`}>
                      {dict.status.document[doc.status] ?? doc.status}
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

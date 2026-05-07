import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, documentStatusLabel, shortId } from '@/lib/utils'

export default async function AdvogadoDocumentosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Casos deste advogado
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

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Documentos dos casos</h1>
      <Card>
        <CardHeader><CardTitle className="text-base">Documentos recebidos</CardTitle></CardHeader>
        <CardContent>
          {docs.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">Nenhum documento ainda.</p>
          ) : (
            <div className="space-y-3">
              {docs.map(doc => {
                const c = Array.isArray(doc.cases) ? doc.cases[0] : doc.cases
                const uploader = Array.isArray(doc.profiles) ? doc.profiles[0] : doc.profiles
                return (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="min-w-0">
                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer"
                         className="text-sm font-medium text-blue-600 hover:underline truncate block">
                        {doc.file_name}
                      </a>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {c?.title ?? shortId(doc.case_id)} · por {uploader?.full_name ?? '?'} · {formatDate(doc.created_at)}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${statusColor[doc.status] ?? ''}`}>
                      {documentStatusLabel(doc.status)}
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

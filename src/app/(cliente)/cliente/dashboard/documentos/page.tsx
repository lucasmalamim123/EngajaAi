import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, formatDateTime, shortId, documentStatusLabel } from '@/lib/utils'
import DocumentUpload from './DocumentUpload'

export default async function ClienteDocumentosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Buscar casos do cliente para associar uploads
  const { data: cases } = await supabase
    .from('cases')
    .select('id, title')
    .eq('client_id', user!.id)
    .in('status', ['open', 'in_progress'])

  const { data: docs } = await supabase
    .from('documents')
    .select('*, cases(title)')
    .eq('uploaded_by', user!.id)
    .order('created_at', { ascending: false })

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Documentos</h1>
      </div>

      {cases && cases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Enviar documento</CardTitle>
          </CardHeader>
          <CardContent>
            <DocumentUpload cases={cases} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Documentos enviados</CardTitle>
        </CardHeader>
        <CardContent>
          {(!docs || docs.length === 0) ? (
            <p className="text-gray-400 text-sm text-center py-8">Nenhum documento enviado ainda.</p>
          ) : (
            <div className="space-y-3">
              {docs.map(doc => {
                const c = Array.isArray(doc.cases) ? doc.cases[0] : doc.cases
                return (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="min-w-0">
                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer"
                         className="text-sm font-medium text-blue-600 hover:underline truncate block">
                        {doc.file_name}
                      </a>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {c?.title ?? shortId(doc.case_id)} · {formatDate(doc.created_at)}
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

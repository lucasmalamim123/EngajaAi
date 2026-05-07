import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Upload } from 'lucide-react'
import { formatDate, shortId } from '@/lib/utils'
import ContratoUpload from './ContratoUpload'

export default async function ClienteContratosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: contracts } = await supabase
    .from('contracts')
    .select('*, cases!inner(title, client_id, service_types(name))')
    .eq('cases.client_id', user!.id)
    .order('created_at', { ascending: false })

  const statusLabel: Record<string, string> = {
    pending: 'Gerando',
    sent: 'Disponível para assinar',
    signed: 'Assinado',
    cancelled: 'Cancelado',
  }
  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    sent: 'bg-blue-100 text-blue-700',
    signed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Contratos</h1>

      {(!contracts || contracts.length === 0) ? (
        <Card>
          <CardContent className="text-center py-16 text-gray-400">
            Nenhum contrato disponível ainda.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {contracts.map(contract => {
            const c = Array.isArray(contract.cases) ? contract.cases[0] : contract.cases
            const service = Array.isArray(c?.service_types) ? c.service_types[0] : c?.service_types
            return (
              <Card key={contract.id}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-sm">{c?.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {service?.name} · #{shortId(contract.id)} · {formatDate(contract.created_at)}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${statusColor[contract.status] ?? ''}`}>
                      {statusLabel[contract.status] ?? contract.status}
                    </span>
                  </div>
                  <div className="flex gap-3 mt-4">
                    {contract.file_url && (
                      <a href={contract.file_url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline">
                          <Download size={14} className="mr-1" /> Baixar contrato
                        </Button>
                      </a>
                    )}
                    {contract.status === 'sent' && (
                      <ContratoUpload contractId={contract.id} />
                    )}
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

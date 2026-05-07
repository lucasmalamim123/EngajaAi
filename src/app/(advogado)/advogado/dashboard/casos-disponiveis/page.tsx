import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, formatDate, shortId } from '@/lib/utils'
import AceitarCasoButton from './AceitarCasoButton'

export default async function CasosDisponiveisPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Casos abertos que este advogado ainda não aceitou
  const { data: myAssignments } = await supabase
    .from('case_assignments')
    .select('case_id')
    .eq('lawyer_id', user!.id)

  const acceptedIds = (myAssignments ?? []).map(a => a.case_id)

  const query = supabase
    .from('cases')
    .select('*, service_types(name, price, category), profiles(full_name)')
    .eq('status', 'open')
    .order('created_at')

  const { data: cases } = acceptedIds.length > 0
    ? await query.not('id', 'in', `(${acceptedIds.join(',')})`)
    : await query

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Casos disponíveis</h1>
        <p className="text-sm text-gray-500 mt-1">Aceite os casos por ordem de chegada</p>
      </div>

      {(!cases || cases.length === 0) ? (
        <Card>
          <CardContent className="text-center py-16 text-gray-400">
            Nenhum caso disponível no momento.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {cases.map(c => {
            const service = Array.isArray(c.service_types) ? c.service_types[0] : c.service_types
            const client = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles
            return (
              <Card key={c.id}>
                <CardContent className="py-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold">{c.title}</p>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{c.description}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
                        <span>{service?.category} · {service?.name}</span>
                        <span>#{shortId(c.id)}</span>
                        <span>Solicitado em {formatDate(c.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <p className="text-xl font-bold text-blue-700">{formatCurrency(service?.price ?? 0)}</p>
                      <AceitarCasoButton caseId={c.id} lawyerId={user!.id} />
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

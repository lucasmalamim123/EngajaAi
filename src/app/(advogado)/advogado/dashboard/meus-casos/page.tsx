import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { formatCurrency, formatDate, shortId, caseStatusLabel } from '@/lib/utils'

export default async function MeusCasosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: assignments } = await supabase
    .from('case_assignments')
    .select('*, cases(*, service_types(name, price, category), profiles(full_name))')
    .eq('lawyer_id', user!.id)
    .eq('status', 'accepted')
    .order('accepted_at', { ascending: false })

  const statusColor: Record<string, string> = {
<<<<<<< HEAD
    open:        'bg-[#A6DEF7]/40 text-[#2B2BFF]',
    in_progress: 'bg-primary/10 text-primary',
    completed:   'bg-[#16A99B]/10 text-[#16A99B]',
    cancelled:   'bg-red-100 text-red-600',
=======
    open: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-indigo-100 text-indigo-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
>>>>>>> 955191e115df3f4d6ded61657ce3ee94843eb863
  }

  return (
    <div className="space-y-6">
<<<<<<< HEAD
      <h1 className="text-2xl font-bold text-foreground">Meus casos</h1>

      {(!assignments || assignments.length === 0) ? (
        <Card>
          <CardContent className="text-center py-16 text-muted-foreground">
            Você ainda não aceitou nenhum caso.{' '}
            <Link href="/advogado/dashboard/casos-disponiveis" className="text-primary hover:underline">
=======
      <h1 className="text-2xl font-bold text-gray-900">Meus casos</h1>

      {(!assignments || assignments.length === 0) ? (
        <Card>
          <CardContent className="text-center py-16 text-gray-400">
            Você ainda não aceitou nenhum caso.{' '}
            <Link href="/advogado/dashboard/casos-disponiveis" className="text-blue-600 hover:underline">
>>>>>>> 955191e115df3f4d6ded61657ce3ee94843eb863
              Ver disponíveis
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {assignments.map(a => {
            const c = Array.isArray(a.cases) ? a.cases[0] : a.cases
            const service = Array.isArray(c?.service_types) ? c?.service_types[0] : c?.service_types
            const client = Array.isArray(c?.profiles) ? c?.profiles[0] : c?.profiles
            return (
              <Card key={a.id} className="hover:shadow-md transition-shadow">
                <CardContent className="py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-sm">{c?.title}</p>
<<<<<<< HEAD
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {service?.name} · Cliente: {client?.full_name} · #{c ? shortId(c.id) : ''}
                    </p>
                    <p className="text-xs text-muted-foreground">
=======
                    <p className="text-xs text-gray-400 mt-0.5">
                      {service?.name} · Cliente: {client?.full_name} · #{c ? shortId(c.id) : ''}
                    </p>
                    <p className="text-xs text-gray-400">
>>>>>>> 955191e115df3f4d6ded61657ce3ee94843eb863
                      Aceito em {formatDate(a.accepted_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <p className="text-sm font-semibold">{formatCurrency(service?.price ?? 0)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[c?.status ?? ''] ?? 'bg-gray-100 text-gray-500'}`}>
                      {caseStatusLabel(c?.status ?? '')}
                    </span>
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

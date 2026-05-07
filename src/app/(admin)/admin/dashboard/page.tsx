import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Users, FolderOpen, CreditCard, TrendingUp } from 'lucide-react'
import { formatCurrency, caseStatusLabel, formatDate } from '@/lib/utils'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [usersRes, casesRes, paymentsRes] = await Promise.all([
    supabase.from('profiles').select('id, role'),
    supabase.from('cases').select('id, status, created_at, title, service_types(name, price)').order('created_at', { ascending: false }).limit(8),
    supabase.from('payments').select('amount, status'),
  ])

  const users = usersRes.data ?? []
  const cases = casesRes.data ?? []
  const payments = paymentsRes.data ?? []

  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((s, p) => s + (p.amount ?? 0), 0)
  const clientCount = users.filter(u => u.role === 'client').length
  const lawyerCount = users.filter(u => u.role === 'lawyer').length
  const openCases = cases.filter(c => c.status === 'open').length

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    open: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-indigo-100 text-indigo-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Painel administrativo</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="text-blue-600" size={22} />
              <div>
                <p className="text-2xl font-bold">{clientCount}</p>
                <p className="text-xs text-gray-500">Clientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="text-purple-600" size={22} />
              <div>
                <p className="text-2xl font-bold">{lawyerCount}</p>
                <p className="text-xs text-gray-500">Advogados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <FolderOpen className="text-orange-500" size={22} />
              <div>
                <p className="text-2xl font-bold">{openCases}</p>
                <p className="text-xs text-gray-500">Casos abertos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-green-600" size={22} />
              <div>
                <p className="text-lg font-bold">{formatCurrency(totalRevenue)}</p>
                <p className="text-xs text-gray-500">Receita total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Casos recentes</CardTitle>
            <Link href="/admin/dashboard/casos" className="text-xs text-blue-600 hover:underline">Ver todos</Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cases.map(c => {
                const service = Array.isArray(c.service_types) ? c.service_types[0] : c.service_types
                return (
                  <div key={c.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{c.title}</p>
                      <p className="text-xs text-gray-400">{service?.name} · {formatDate(c.created_at)}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[c.status] ?? ''}`}>
                      {caseStatusLabel(c.status)}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Usuários por tipo</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['client', 'lawyer', 'engager', 'admin'].map(role => {
                const count = users.filter(u => u.role === role).length
                const labels: Record<string, string> = { client: 'Clientes', lawyer: 'Advogados', engager: 'Engajadores', admin: 'Admins' }
                return (
                  <div key={role} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{labels[role]}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

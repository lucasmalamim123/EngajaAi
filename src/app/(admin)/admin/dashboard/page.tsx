import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
<<<<<<< HEAD
import { Users, FolderOpen, UserCheck } from 'lucide-react'
import { formatCurrency, caseStatusLabel, formatDate } from '@/lib/utils'

const statusColor: Record<string, string> = {
  pending:     'bg-yellow-100 text-yellow-700',
  open:        'bg-[#A6DEF7]/40 text-[#2B2BFF]',
  in_progress: 'bg-primary/10 text-primary',
  completed:   'bg-[#16A99B]/10 text-[#16A99B]',
  cancelled:   'bg-red-100 text-red-600',
}

const roleLabel: Record<string, string> = {
  client: 'Clientes', lawyer: 'Advogados', engager: 'Engajadores', admin: 'Admins',
}

const roleColor: Record<string, string> = {
  client:  'bg-primary/10 text-primary',
  lawyer:  'bg-[#2B2BFF]/10 text-[#2B2BFF]',
  engager: 'bg-[#16A99B]/10 text-[#16A99B]',
  admin:   'bg-[#F62088]/10 text-[#F62088]',
}

=======
import { Users, FolderOpen, CreditCard, TrendingUp } from 'lucide-react'
import { formatCurrency, caseStatusLabel, formatDate } from '@/lib/utils'

>>>>>>> 955191e115df3f4d6ded61657ce3ee94843eb863
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

<<<<<<< HEAD
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Painel administrativo</h1>

      {/* Hero card */}
      <div className="rounded-2xl p-6 text-white" style={{ background: 'var(--gradient-hero)' }}>
        <p className="text-sm text-white/70 uppercase tracking-wider font-medium">Receita Total</p>
        <p className="text-4xl font-bold mt-2">{formatCurrency(totalRevenue)}</p>
        <div className="flex gap-6 mt-4">
          <div>
            <p className="text-2xl font-semibold">{payments.filter(p => p.status === 'paid').length}</p>
            <p className="text-xs text-white/60">Pagamentos confirmados</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{openCases}</p>
            <p className="text-xs text-white/60">Casos abertos</p>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-primary/10">
                <Users size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{clientCount}</p>
                <p className="text-xs text-muted-foreground">Clientes</p>
=======
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
>>>>>>> 955191e115df3f4d6ded61657ce3ee94843eb863
              </div>
            </div>
          </CardContent>
        </Card>
<<<<<<< HEAD

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-[#2B2BFF]/10">
                <UserCheck size={18} className="text-[#2B2BFF]" />
              </div>
              <div>
                <p className="text-2xl font-bold">{lawyerCount}</p>
                <p className="text-xs text-muted-foreground">Advogados</p>
=======
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="text-purple-600" size={22} />
              <div>
                <p className="text-2xl font-bold">{lawyerCount}</p>
                <p className="text-xs text-gray-500">Advogados</p>
>>>>>>> 955191e115df3f4d6ded61657ce3ee94843eb863
              </div>
            </div>
          </CardContent>
        </Card>
<<<<<<< HEAD

        <Card className="col-span-2 sm:col-span-1">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-[#F62088]/10">
                <FolderOpen size={18} className="text-[#F62088]" />
              </div>
              <div>
                <p className="text-2xl font-bold">{openCases}</p>
                <p className="text-xs text-muted-foreground">Casos abertos</p>
=======
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
>>>>>>> 955191e115df3f4d6ded61657ce3ee94843eb863
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Casos recentes</CardTitle>
<<<<<<< HEAD
            <Link href="/admin/dashboard/casos" className="text-xs text-primary hover:underline">Ver todos</Link>
=======
            <Link href="/admin/dashboard/casos" className="text-xs text-blue-600 hover:underline">Ver todos</Link>
>>>>>>> 955191e115df3f4d6ded61657ce3ee94843eb863
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cases.map(c => {
<<<<<<< HEAD
                const service = Array.isArray(c.service_types) ? c.service_types[0] : c.service_types as any
                return (
                  <div key={c.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-primary">
                          {c.title.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{c.title}</p>
                        <p className="text-xs text-muted-foreground">{service?.name} · {formatDate(c.created_at)}</p>
                      </div>
=======
                const service = Array.isArray(c.service_types) ? c.service_types[0] : c.service_types
                return (
                  <div key={c.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{c.title}</p>
                      <p className="text-xs text-gray-400">{service?.name} · {formatDate(c.created_at)}</p>
>>>>>>> 955191e115df3f4d6ded61657ce3ee94843eb863
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
<<<<<<< HEAD
                return (
                  <div key={role} className="flex justify-between items-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColor[role]}`}>
                      {roleLabel[role]}
                    </span>
                    <span className="font-semibold text-sm">{count}</span>
=======
                const labels: Record<string, string> = { client: 'Clientes', lawyer: 'Advogados', engager: 'Engajadores', admin: 'Admins' }
                return (
                  <div key={role} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{labels[role]}</span>
                    <span className="font-semibold">{count}</span>
>>>>>>> 955191e115df3f4d6ded61657ce3ee94843eb863
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

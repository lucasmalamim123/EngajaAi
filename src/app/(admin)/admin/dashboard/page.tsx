import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
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
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-[#2B2BFF]/10">
                <UserCheck size={18} className="text-[#2B2BFF]" />
              </div>
              <div>
                <p className="text-2xl font-bold">{lawyerCount}</p>
                <p className="text-xs text-muted-foreground">Advogados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 sm:col-span-1">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-[#F62088]/10">
                <FolderOpen size={18} className="text-[#F62088]" />
              </div>
              <div>
                <p className="text-2xl font-bold">{openCases}</p>
                <p className="text-xs text-muted-foreground">Casos abertos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Casos recentes</CardTitle>
            <Link href="/admin/dashboard/casos" className="text-xs text-primary hover:underline">Ver todos</Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cases.map(c => {
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
                return (
                  <div key={role} className="flex justify-between items-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColor[role]}`}>
                      {roleLabel[role]}
                    </span>
                    <span className="font-semibold text-sm">{count}</span>
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

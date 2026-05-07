import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

const roleLabel: Record<string, string> = {
  client: 'Cliente',
  lawyer: 'Advogado',
  engager: 'Engajador',
  admin: 'Admin',
}
const roleColor: Record<string, string> = {
  client:  'bg-primary/10 text-primary',
  lawyer:  'bg-[#2B2BFF]/10 text-[#2B2BFF]',
  engager: 'bg-[#16A99B]/10 text-[#16A99B]',
  admin:   'bg-[#F62088]/10 text-[#F62088]',
}

export default async function AdminUsuariosPage() {
  const supabase = await createClient()
  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Usuários</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Todos os usuários ({users?.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">Nome</th>
                  <th className="pb-3 pr-4 font-medium">E-mail</th>
                  <th className="pb-3 pr-4 font-medium">Tipo</th>
                  <th className="pb-3 font-medium">Cadastro</th>
                </tr>
              </thead>
              <tbody>
                {(users ?? []).map(u => (
                  <tr key={u.id} className="border-b last:border-0 hover:bg-accent/20">
                    <td className="py-3 pr-4 font-medium">{u.full_name}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{u.email}</td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColor[u.role] ?? ''}`}>
                        {roleLabel[u.role] ?? u.role}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground">{formatDate(u.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

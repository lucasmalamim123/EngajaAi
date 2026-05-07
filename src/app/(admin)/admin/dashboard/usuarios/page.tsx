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
<<<<<<< HEAD
  client:  'bg-primary/10 text-primary',
  lawyer:  'bg-[#2B2BFF]/10 text-[#2B2BFF]',
  engager: 'bg-[#16A99B]/10 text-[#16A99B]',
  admin:   'bg-[#F62088]/10 text-[#F62088]',
=======
  client: 'bg-blue-100 text-blue-700',
  lawyer: 'bg-purple-100 text-purple-700',
  engager: 'bg-green-100 text-green-700',
  admin: 'bg-red-100 text-red-700',
>>>>>>> 955191e115df3f4d6ded61657ce3ee94843eb863
}

export default async function AdminUsuariosPage() {
  const supabase = await createClient()
  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
<<<<<<< HEAD
      <h1 className="text-2xl font-bold text-foreground">Usuários</h1>
=======
      <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
>>>>>>> 955191e115df3f4d6ded61657ce3ee94843eb863
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Todos os usuários ({users?.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
<<<<<<< HEAD
                <tr className="border-b text-left text-muted-foreground">
=======
                <tr className="border-b text-left text-gray-500">
>>>>>>> 955191e115df3f4d6ded61657ce3ee94843eb863
                  <th className="pb-3 pr-4 font-medium">Nome</th>
                  <th className="pb-3 pr-4 font-medium">E-mail</th>
                  <th className="pb-3 pr-4 font-medium">Tipo</th>
                  <th className="pb-3 font-medium">Cadastro</th>
                </tr>
              </thead>
              <tbody>
                {(users ?? []).map(u => (
<<<<<<< HEAD
                  <tr key={u.id} className="border-b last:border-0 hover:bg-accent/20">
                    <td className="py-3 pr-4 font-medium">{u.full_name}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{u.email}</td>
=======
                  <tr key={u.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 pr-4 font-medium">{u.full_name}</td>
                    <td className="py-3 pr-4 text-gray-500">{u.email}</td>
>>>>>>> 955191e115df3f4d6ded61657ce3ee94843eb863
                    <td className="py-3 pr-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColor[u.role] ?? ''}`}>
                        {roleLabel[u.role] ?? u.role}
                      </span>
                    </td>
<<<<<<< HEAD
                    <td className="py-3 text-muted-foreground">{formatDate(u.created_at)}</td>
=======
                    <td className="py-3 text-gray-400">{formatDate(u.created_at)}</td>
>>>>>>> 955191e115df3f4d6ded61657ce3ee94843eb863
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

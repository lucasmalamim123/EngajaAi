import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'

export default async function ServicosPage() {
  const supabase = await createClient()
  const { data: services } = await supabase
    .from('service_types')
    .select('*')
    .eq('active', true)
    .order('category')

  const byCategory = (services ?? []).reduce<Record<string, typeof services>>((acc, s) => {
    const cat = s!.category ?? 'Outros'
    if (!acc[cat]) acc[cat] = []
    acc[cat]!.push(s)
    return acc
  }, {})

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Serviços disponíveis</h1>
        <p className="text-gray-500 mt-2">Escolha o serviço jurídico que você precisa e contrate agora mesmo.</p>
      </div>

      {Object.entries(byCategory).map(([category, items]) => (
        <div key={category} className="mb-10">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(items ?? []).map(service => (
              <Card key={service!.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{service!.name}</CardTitle>
                    <Badge variant="secondary">{service!.category}</Badge>
                  </div>
                  <CardDescription className="text-sm mt-1">{service!.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-2xl font-bold text-blue-700">{formatCurrency(service!.price)}</p>
                </CardContent>
                <CardFooter>
                  <Link href={`/contratar/${service!.id}`} className="w-full">
                    <Button className="w-full">Contratar</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {(!services || services.length === 0) && (
        <p className="text-gray-500 text-center py-20">Nenhum serviço disponível no momento.</p>
      )}
    </div>
  )
}

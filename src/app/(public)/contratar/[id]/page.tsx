import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ContratarForm from './ContratarForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ContratarPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: service } = await supabase
    .from('service_types')
    .select('*')
    .eq('id', id)
    .eq('active', true)
    .single()

  if (!service) notFound()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?redirect=/contratar/${id}`)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'client') {
    redirect('/cliente/dashboard')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Contratar serviço</h1>
        <p className="text-gray-500 mt-1">Preencha as informações do seu caso para prosseguir</p>
      </div>
      <ContratarForm service={service} profile={profile} />
    </div>
  )
}

export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCheckoutSession } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'client') {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }

  const body = await req.json()
  const { service_type_id, title, description } = body

  if (!service_type_id || !title || !description) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
  }

  const { data: service } = await supabase
    .from('service_types')
    .select('*')
    .eq('id', service_type_id)
    .eq('active', true)
    .single()

  if (!service) {
    return NextResponse.json({ error: 'Serviço não encontrado' }, { status: 404 })
  }

  // Criar caso em estado pendente
  const { data: newCase, error: caseError } = await supabase
    .from('cases')
    .insert({
      client_id: user.id,
      service_type_id,
      title,
      description,
      status: 'pending',
    })
    .select()
    .single()

  if (caseError || !newCase) {
    return NextResponse.json({ error: 'Erro ao criar caso' }, { status: 500 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!

  const session = await createCheckoutSession({
    caseId: newCase.id,
    serviceTypeId: service_type_id,
    serviceName: service.name,
    amount: service.price,
    clientEmail: profile.email,
    clientName: profile.full_name,
    successUrl: `${appUrl}/cliente/dashboard/casos?pagamento=sucesso`,
    cancelUrl: `${appUrl}/contratar/${service_type_id}?cancelado=true`,
  })

  // Registrar sessão de pagamento pendente
  await supabase.from('payments').insert({
    case_id: newCase.id,
    amount: service.price,
    status: 'pending',
    stripe_session_id: session.id,
  })

  return NextResponse.json({ url: session.url })
}

export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { sendConfirmacaoPagamento, sendNovoCasoAdvogado } from '@/lib/resend'

let _supabaseAdmin: ReturnType<typeof createClient> | null = null
function getSupabaseAdmin() {
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }
  return _supabaseAdmin
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Webhook inválido' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const caseId = session.metadata?.case_id

    if (!caseId) {
      return NextResponse.json({ error: 'case_id ausente' }, { status: 400 })
    }

    // Atualizar pagamento
    await getSupabaseAdmin()
      .from('payments')
      .update({
        status: 'paid',
        stripe_payment_id: session.payment_intent as string,
        method: session.payment_method_types?.[0] ?? 'card',
        paid_at: new Date().toISOString(),
      })
      .eq('stripe_session_id', session.id)

    // Abrir caso
    await getSupabaseAdmin()
      .from('cases')
      .update({ status: 'open' })
      .eq('id', caseId)

    // Buscar dados do caso para gerar contrato e enviar e-mails
    const { data: caseData } = await getSupabaseAdmin()
      .from('cases')
      .select('*, profiles(*), service_types(*)')
      .eq('id', caseId)
      .single()

    if (caseData) {
      // Criar registro de contrato (geração assíncrona pelo client após)
      await getSupabaseAdmin().from('contracts').insert({
        case_id: caseId,
        status: 'pending',
      })

      // Disparar geração de PDF via internal call
      const appUrl = process.env.NEXT_PUBLIC_APP_URL
      await fetch(`${appUrl}/api/contratos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ case_id: caseId }),
      })

      // E-mail de confirmação para o cliente
      const clientProfile = Array.isArray(caseData.profiles)
        ? caseData.profiles[0]
        : caseData.profiles
      const serviceType = Array.isArray(caseData.service_types)
        ? caseData.service_types[0]
        : caseData.service_types

      if (clientProfile) {
        await sendConfirmacaoPagamento({
          to: clientProfile.email,
          clientName: clientProfile.full_name,
          serviceName: serviceType?.name ?? 'Serviço jurídico',
          caseId,
          amount: serviceType?.price ?? 0,
        })
      }

      // Notificar todos advogados ativos sobre novo caso
      const { data: lawyers } = await getSupabaseAdmin()
        .from('lawyers')
        .select('profile_id, profiles(email, full_name)')
        .eq('status', 'active')

      if (lawyers) {
        await Promise.allSettled(
          lawyers.map(async (l) => {
            const lProfile = Array.isArray(l.profiles) ? l.profiles[0] : l.profiles
            if (lProfile) {
              await sendNovoCasoAdvogado({
                to: lProfile.email,
                lawyerName: lProfile.full_name,
                serviceName: serviceType?.name ?? 'Serviço jurídico',
                caseId,
              })
            }
          })
        )
      }
    }
  }

  return NextResponse.json({ received: true })
}

import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-04-22.dahlia',
      typescript: true,
    })
  }
  return _stripe
}

export const stripe = {
  webhooks: { constructEvent: (...args: Parameters<Stripe['webhooks']['constructEvent']>) => getStripe().webhooks.constructEvent(...args) },
  checkout: { sessions: { create: (...args: Parameters<Stripe['checkout']['sessions']['create']>) => getStripe().checkout.sessions.create(...args) } },
}

export async function createCheckoutSession({
  caseId,
  serviceTypeId,
  serviceName,
  amount,
  clientEmail,
  clientName,
  successUrl,
  cancelUrl,
}: {
  caseId: string
  serviceTypeId: string
  serviceName: string
  amount: number
  clientEmail: string
  clientName: string
  successUrl: string
  cancelUrl: string
}) {
  return stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: clientEmail,
    line_items: [
      {
        price_data: {
          currency: 'brl',
          unit_amount: Math.round(amount * 100),
          product_data: {
            name: serviceName,
            description: `Serviço jurídico — ${serviceName}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      case_id: caseId,
      service_type_id: serviceTypeId,
      client_name: clientName,
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  })
}

import { Resend } from 'resend'

let _resend: Resend | null = null
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY!)
  return _resend
}

const FROM = 'Plataforma Jurídica <noreply@plataformajuridica.com.br>'

export async function sendConfirmacaoPagamento({
  to,
  clientName,
  serviceName,
  caseId,
  amount,
}: {
  to: string
  clientName: string
  serviceName: string
  caseId: string
  amount: number
}) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: 'Pagamento confirmado — seu caso foi aberto',
    html: `
      <h2>Olá, ${clientName}!</h2>
      <p>Seu pagamento foi confirmado e seu caso foi aberto com sucesso.</p>
      <ul>
        <li><strong>Serviço:</strong> ${serviceName}</li>
        <li><strong>Valor:</strong> R$ ${amount.toFixed(2).replace('.', ',')}</li>
        <li><strong>Número do caso:</strong> ${caseId.slice(0, 8).toUpperCase()}</li>
      </ul>
      <p>Um advogado irá analisar seu caso em breve. Você pode acompanhar o andamento pelo seu painel.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/cliente/dashboard">Acessar meu painel</a>
    `,
  })
}

export async function sendNovoCasoAdvogado({
  to,
  lawyerName,
  serviceName,
  caseId,
}: {
  to: string
  lawyerName: string
  serviceName: string
  caseId: string
}) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: 'Novo caso disponível para aceite',
    html: `
      <h2>Olá, ${lawyerName}!</h2>
      <p>Um novo caso está disponível para aceite na plataforma.</p>
      <ul>
        <li><strong>Serviço:</strong> ${serviceName}</li>
        <li><strong>ID do caso:</strong> ${caseId.slice(0, 8).toUpperCase()}</li>
      </ul>
      <p>Acesse a plataforma para visualizar os detalhes e aceitar o caso.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/advogado/dashboard/casos-disponiveis">Ver casos disponíveis</a>
    `,
  })
}

export async function sendAceiteCaso({
  to,
  clientName,
  lawyerName,
  serviceName,
}: {
  to: string
  clientName: string
  lawyerName: string
  serviceName: string
}) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: 'Seu caso foi aceito por um advogado',
    html: `
      <h2>Boas notícias, ${clientName}!</h2>
      <p>O advogado <strong>${lawyerName}</strong> aceitou seu caso de <strong>${serviceName}</strong>.</p>
      <p>Você já pode se comunicar com ele através dos tickets no seu painel.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/cliente/dashboard">Acessar meu painel</a>
    `,
  })
}

export async function sendBoasVindas({
  to,
  name,
  role,
}: {
  to: string
  name: string
  role: string
}) {
  const roleLabel: Record<string, string> = {
    client: 'cliente',
    lawyer: 'advogado',
    engager: 'engajador',
    admin: 'administrador',
  }

  return getResend().emails.send({
    from: FROM,
    to,
    subject: 'Bem-vindo à Plataforma Jurídica',
    html: `
      <h2>Bem-vindo(a), ${name}!</h2>
      <p>Sua conta como <strong>${roleLabel[role] ?? role}</strong> foi criada com sucesso.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/login">Acessar a plataforma</a>
    `,
  })
}

export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { renderToBuffer, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

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

const styles = StyleSheet.create({
  page: { padding: 48, fontFamily: 'Helvetica', fontSize: 11, color: '#111' },
  title: { fontSize: 16, fontFamily: 'Helvetica-Bold', marginBottom: 24, textAlign: 'center' },
  section: { marginBottom: 16 },
  heading: { fontSize: 12, fontFamily: 'Helvetica-Bold', marginBottom: 6 },
  text: { lineHeight: 1.6, marginBottom: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  label: { fontFamily: 'Helvetica-Bold' },
  divider: { borderBottom: '1 solid #ccc', marginVertical: 12 },
  footer: { marginTop: 48, textAlign: 'center', fontSize: 9, color: '#666' },
  signatureArea: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 48 },
  signatureBox: { width: '45%', borderTop: '1 solid #111', paddingTop: 8, textAlign: 'center', fontSize: 10 },
})

function ContratoDocument({ data }: {
  data: {
    caseId: string
    clientName: string
    clientCpf: string | null
    serviceName: string
    description: string
    price: number
    date: string
  }
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>CONTRATO DE PRESTAÇÃO DE SERVIÇOS JURÍDICOS</Text>

        <View style={styles.section}>
          <Text style={styles.heading}>1. DAS PARTES</Text>
          <View style={styles.row}>
            <Text style={styles.label}>CONTRATANTE:</Text>
            <Text>{data.clientName}</Text>
          </View>
          {data.clientCpf && (
            <View style={styles.row}>
              <Text style={styles.label}>CPF:</Text>
              <Text>{data.clientCpf}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>CONTRATADA:</Text>
            <Text>Plataforma Jurídica Ltda.</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.heading}>2. DO OBJETO</Text>
          <Text style={styles.text}>
            O presente contrato tem por objeto a prestação do serviço jurídico denominado{' '}
            <Text style={styles.label}>"{data.serviceName}"</Text>.
          </Text>
          <Text style={styles.text}>Descrição do caso: {data.description}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.heading}>3. DO VALOR E PAGAMENTO</Text>
          <Text style={styles.text}>
            O valor total do serviço é de{' '}
            <Text style={styles.label}>
              R$ {data.price.toFixed(2).replace('.', ',')}
            </Text>
            {', '}já quitado pelo CONTRATANTE por meio de pagamento eletrônico via plataforma.
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.heading}>4. DO PRAZO</Text>
          <Text style={styles.text}>
            O serviço será executado no prazo acordado conforme a complexidade do caso, a contar da data de aceite por um advogado cadastrado na plataforma.
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.heading}>5. DAS DISPOSIÇÕES GERAIS</Text>
          <Text style={styles.text}>
            Este contrato é regido pelas leis brasileiras. As partes elegem o foro da comarca do CONTRATANTE para dirimir quaisquer dúvidas.
          </Text>
          <Text style={styles.text}>
            Número do caso: {data.caseId.slice(0, 8).toUpperCase()}
          </Text>
          <Text style={styles.text}>Data: {data.date}</Text>
        </View>

        <View style={styles.signatureArea}>
          <View style={styles.signatureBox}>
            <Text>{data.clientName}</Text>
            <Text>CONTRATANTE</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text>Plataforma Jurídica Ltda.</Text>
            <Text>CONTRATADA</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Documento gerado eletronicamente pela Plataforma Jurídica em {data.date}
        </Text>
      </Page>
    </Document>
  )
}

export async function POST(req: NextRequest) {
  const { case_id } = await req.json()
  if (!case_id) return NextResponse.json({ error: 'case_id obrigatório' }, { status: 400 })

  const { data: caseData } = await getSupabaseAdmin()
    .from('cases')
    .select('*, profiles(*), service_types(*)')
    .eq('id', case_id)
    .single()

  if (!caseData) return NextResponse.json({ error: 'Caso não encontrado' }, { status: 404 })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cd = caseData as any
  const clientProfile = Array.isArray(cd.profiles) ? cd.profiles[0] : cd.profiles
  const serviceType = Array.isArray(cd.service_types) ? cd.service_types[0] : cd.service_types

  const date = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric',
  }).format(new Date())

  const buffer = await renderToBuffer(
    <ContratoDocument
      data={{
        caseId: case_id,
        clientName: clientProfile?.full_name ?? '',
        clientCpf: clientProfile?.cpf ?? null,
        serviceName: serviceType?.name ?? '',
        description: cd.description ?? '',
        price: serviceType?.price ?? 0,
        date,
      }}
    />
  )

  const fileName = `contratos/${case_id}.pdf`
  const { error: uploadError } = await getSupabaseAdmin().storage
    .from('documents')
    .upload(fileName, buffer, { contentType: 'application/pdf', upsert: true })

  if (uploadError) {
    return NextResponse.json({ error: 'Erro ao salvar PDF' }, { status: 500 })
  }

  const { data: { publicUrl } } = getSupabaseAdmin().storage
    .from('documents')
    .getPublicUrl(fileName)

  await getSupabaseAdmin()
    .from('contracts')
    .update({ file_url: publicUrl, status: 'sent' })
    .eq('case_id', case_id)

  return NextResponse.json({ url: publicUrl })
}

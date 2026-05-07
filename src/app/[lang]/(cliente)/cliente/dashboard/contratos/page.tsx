import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { formatDate, shortId } from '@/lib/utils'
import { getDictionary, hasLocale, defaultLocale, type Locale } from '@/lib/i18n'
import ContratoUpload from './ContratoUpload'

export default async function ClienteContratosPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale: Locale = hasLocale(lang) ? lang : defaultLocale
  const dict = await getDictionary(locale)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: contracts } = await supabase
    .from('contracts')
    .select('*, cases!inner(title, client_id, service_types(name))')
    .eq('cases.client_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">{dict.client.contracts.title}</h1>

      {(!contracts || contracts.length === 0) ? (
        <Card>
          <CardContent className="text-center py-16 text-muted-foreground">
            {dict.client.contracts.no_contracts}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {contracts.map(contract => {
            const c = Array.isArray(contract.cases) ? contract.cases[0] : contract.cases
            const service = Array.isArray(c?.service_types) ? c.service_types[0] : c?.service_types
            return (
              <Card key={contract.id}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-sm">{c?.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {service?.name} · #{shortId(contract.id)} · {formatDate(contract.created_at, locale)}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${
                      contract.status === 'signed' ? 'bg-[#16A99B]/10 text-[#16A99B]' :
                      contract.status === 'sent' ? 'bg-[#A6DEF7]/40 text-[#2B2BFF]' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {dict.client.contracts.status[contract.status] ?? contract.status}
                    </span>
                  </div>
                  <div className="flex gap-3 mt-4">
                    {contract.file_url && (
                      <a href={contract.file_url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline">
                          <Download size={14} className="mr-1" /> {dict.client.contracts.download}
                        </Button>
                      </a>
                    )}
                    {contract.status === 'sent' && (
                      <ContratoUpload
                        contractId={contract.id}
                        labels={{ upload: dict.client.contracts.upload_signed, uploading: dict.client.contracts.uploading }}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

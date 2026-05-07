import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getDictionary, hasLocale, defaultLocale, type Locale } from '@/lib/i18n'
import ContratarForm from './ContratarForm'

export default async function ContratarPage({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params
  const locale: Locale = hasLocale(lang) ? lang : defaultLocale
  const dict = await getDictionary(locale)

  const supabase = await createClient()
  const { data: service } = await supabase
    .from('service_types')
    .select('*')
    .eq('id', id)
    .eq('active', true)
    .single()

  if (!service) notFound()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login?redirect=/${locale}/contratar/${id}`)

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'client') redirect(`/${locale}/cliente/dashboard`)

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">{dict.hire.title}</h1>
        <p className="text-muted-foreground mt-1">{service.name} · {service.category}</p>
      </div>
      <ContratarForm service={service} profile={profile} locale={locale} dict={dict.hire} />
    </div>
  )
}

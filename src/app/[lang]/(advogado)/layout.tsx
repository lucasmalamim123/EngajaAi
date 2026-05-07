import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { getDictionary, hasLocale, defaultLocale, type Locale } from '@/lib/i18n'
import type { ReactNode } from 'react'

export default async function AdvogadoLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale: Locale = hasLocale(lang) ? lang : defaultLocale
  const dict = await getDictionary(locale)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${lang}/login`)

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'lawyer') redirect(`/${lang}/login`)

  return (
    <DashboardLayout
      profile={profile}
      lang={lang}
      navLabels={{
        platform_name:   dict.common.platform_name,
        overview:        dict.nav.overview,
        my_cases:        dict.nav.my_cases,
        available_cases: dict.nav.available_cases,
        contracts:       dict.nav.contracts,
        documents:       dict.nav.documents,
        tickets:         dict.nav.tickets,
        users:           dict.nav.users,
        cases:           dict.nav.cases,
        payments:        dict.nav.payments,
        referrals:       dict.nav.referrals,
        logout:          dict.nav.logout,
      }}
    >
      {children}
    </DashboardLayout>
  )
}

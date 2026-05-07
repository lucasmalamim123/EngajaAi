import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { hasLocale } from '@/lib/i18n'

export async function generateStaticParams() {
  return [
    { lang: 'pt-PT' },
    { lang: 'pt-BR' },
    { lang: 'en' },
    { lang: 'es' },
  ]
}

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  return <>{children}</>
}

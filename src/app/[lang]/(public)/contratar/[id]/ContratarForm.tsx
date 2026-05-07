'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/utils'
import type { ServiceType, Profile } from '@/types/database'
import type { Dictionary } from '@/lib/i18n'

const schema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
})

type FormData = z.infer<typeof schema>

export default function ContratarForm({
  service,
  profile,
  locale,
  dict,
}: {
  service: ServiceType
  profile: Profile
  locale: string
  dict: Dictionary['hire']
}) {
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: service.name },
  })

  async function onSubmit(data: FormData) {
    setError(null)
    const res = await fetch('/api/pagamentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_type_id: service.id,
        title: data.title,
        description: data.description,
      }),
    })

    if (!res.ok) {
      const body = await res.json()
      setError(body.error ?? 'Erro ao iniciar pagamento.')
      return
    }

    const { url } = await res.json()
    window.location.href = url
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-base">Resumo do pedido</CardTitle></CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{service.name}</p>
              <p className="text-sm text-muted-foreground">{service.category}</p>
            </div>
            <p className="text-xl font-bold text-primary">{formatCurrency(service.price, locale)}</p>
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Cliente</span>
            <span>{profile.full_name}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Detalhes do seu caso</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="title">{dict.case_title}</Label>
              <Input id="title" {...register('title')} />
              {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="description">{dict.description}</Label>
              <Textarea id="description" rows={5} {...register('description')} />
              {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? dict.submitting : `${dict.submit} · ${formatCurrency(service.price, locale)}`}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Você será redirecionado para o checkout seguro do Stripe
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

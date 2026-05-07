'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const schema = z.object({ email: z.string().email() })
type FormData = z.infer<typeof schema>

export default function RecuperarSenhaPage() {
  const params = useParams()
  const lang = (params.lang as string) ?? 'pt-PT'
  const [sent, setSent] = useState(false)

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    const supabase = createClient()
    await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/${lang}/nova-senha`,
    })
    setSent(true)
  }

  if (sent) {
    return (
      <Card>
        <CardHeader><CardTitle>E-mail enviado</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Se esse e-mail estiver cadastrado, você receberá um link para redefinir sua senha em breve.
          </p>
          <Link href={`/${lang}/login`} className="mt-4 block text-center text-sm text-primary hover:underline">
            Voltar para o login
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recuperar senha</CardTitle>
        <CardDescription>Enviaremos um link para redefinir sua senha</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="seu@email.com" {...register('email')} />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar link'}
          </Button>
        </form>
        <Link href={`/${lang}/login`} className="mt-4 block text-center text-sm text-muted-foreground hover:underline">
          Voltar para o login
        </Link>
      </CardContent>
    </Card>
  )
}

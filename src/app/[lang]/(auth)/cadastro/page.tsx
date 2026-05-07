'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const schema = z.object({
  full_name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(10).optional().or(z.literal('')),
  cpf: z.string().min(9).optional().or(z.literal('')),
  role: z.enum(['client', 'lawyer', 'engager']),
  oab_number: z.string().optional(),
  oab_state: z.string().optional(),
  password: z.string().min(6),
  confirm_password: z.string(),
}).refine(d => d.password === d.confirm_password, {
  message: 'As senhas não coincidem',
  path: ['confirm_password'],
}).refine(d => d.role !== 'lawyer' || (d.oab_number && d.oab_number.length > 0), {
  message: 'Número da OAB obrigatório',
  path: ['oab_number'],
})

type FormData = z.infer<typeof schema>

function CadastroForm() {
  const router = useRouter()
  const params = useParams()
  const lang = (params.lang as string) ?? 'pt-PT'
  const searchParams = useSearchParams()
  const referralCode = searchParams.get('ref')
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'client' },
  })

  const role = watch('role')

  async function onSubmit(data: FormData) {
    setError(null)
    const supabase = createClient()

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { full_name: data.full_name, role: data.role } },
    })

    if (signUpError) { setError(signUpError.message); return }

    const userId = authData.user?.id
    if (!userId) return

    await supabase.from('profiles').update({
      phone: data.phone || null,
      cpf: data.cpf || null,
    }).eq('id', userId)

    if (data.role === 'lawyer' && data.oab_number) {
      await supabase.from('lawyers').insert({
        profile_id: userId,
        oab_number: data.oab_number,
        oab_state: data.oab_state || 'SP',
      })
    }

    if (data.role === 'engager') {
      await supabase.from('engagers').insert({ profile_id: userId })
    }

    if (referralCode && data.role === 'client') {
      localStorage.setItem('referral_code', referralCode)
    }

    const dashboards: Record<string, string> = {
      client:  `/${lang}/cliente/dashboard`,
      lawyer:  `/${lang}/advogado/dashboard`,
      engager: `/${lang}/engajador/dashboard`,
    }
    router.push(dashboards[data.role])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar conta</CardTitle>
        <CardDescription>Cadastre-se para acessar a plataforma</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label>Tipo de conta</Label>
            <Select defaultValue="client" onValueChange={(v) => setValue('role', v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Cliente</SelectItem>
                <SelectItem value="lawyer">Advogado</SelectItem>
                <SelectItem value="engager">Engajador</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="full_name">Nome completo</Label>
            <Input id="full_name" placeholder="João da Silva" {...register('full_name')} />
            {errors.full_name && <p className="text-xs text-red-500">{errors.full_name.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="seu@email.com" {...register('email')} />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" placeholder="+351 912 345 678" {...register('phone')} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="cpf">NIF</Label>
              <Input id="cpf" placeholder="123456789" {...register('cpf')} />
            </div>
          </div>
          {role === 'lawyer' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="oab_number">Número OAB</Label>
                <Input id="oab_number" placeholder="123456" {...register('oab_number')} />
                {errors.oab_number && <p className="text-xs text-red-500">{errors.oab_number.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="oab_state">Estado OAB</Label>
                <Input id="oab_state" placeholder="SP" maxLength={2} {...register('oab_state')} />
              </div>
            </div>
          )}
          <div className="space-y-1">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" placeholder="••••••" {...register('password')} />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="confirm_password">Confirmar senha</Label>
            <Input id="confirm_password" type="password" placeholder="••••••" {...register('confirm_password')} />
            {errors.confirm_password && <p className="text-xs text-red-500">{errors.confirm_password.message}</p>}
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Criando conta...' : 'Criar conta'}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Já tem conta?{' '}
          <Link href={`/${lang}/login`} className="text-primary hover:underline">Entrar</Link>
        </p>
      </CardContent>
    </Card>
  )
}

export default function CadastroPage() {
  return <Suspense><CadastroForm /></Suspense>
}

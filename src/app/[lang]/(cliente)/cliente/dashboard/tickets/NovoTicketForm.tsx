'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'

interface Case { id: string; title: string }

const schema = z.object({
  case_id: z.string().min(1),
  subject: z.string().min(5),
})

type FormData = z.infer<typeof schema>

export default function NovoTicketForm({
  cases,
  lang,
  labels,
}: {
  cases: Case[]
  lang: string
  labels: { case_label: string; subject_label: string; subject_placeholder: string; open_button: string; opening: string }
}) {
  const router = useRouter()
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { case_id: cases[0]?.id ?? '' },
  })

  async function onSubmit(data: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: ticket } = await supabase.from('tickets').insert({
      case_id: data.case_id,
      subject: data.subject,
      created_by: user.id,
    }).select().single()

    if (ticket) {
      router.push(`/${lang}/cliente/dashboard/tickets/${ticket.id}`)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3 flex-wrap items-end">
      <div className="flex-1 min-w-[180px]">
        <Label className="mb-1 block text-sm">{labels.case_label}</Label>
        <Select defaultValue={cases[0]?.id} onValueChange={v => setValue('case_id', v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {cases.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-[2] min-w-[200px]">
        <Label className="mb-1 block text-sm">{labels.subject_label}</Label>
        <Input placeholder={labels.subject_placeholder} {...register('subject')} />
        {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? labels.opening : labels.open_button}
      </Button>
    </form>
  )
}

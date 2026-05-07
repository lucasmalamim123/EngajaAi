'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function AceitarCasoButton({
  caseId,
  lawyerId,
  lang,
  labels,
}: {
  caseId: string
  lawyerId: string
  lang: string
  labels: { accept: string; accepting: string }
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function aceitar() {
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('case_assignments').insert({
      case_id: caseId,
      lawyer_id: lawyerId,
      status: 'accepted',
    })
    if (!error) {
      await supabase.from('cases').update({ status: 'in_progress' }).eq('id', caseId)
      router.push(`/${lang}/advogado/dashboard/meus-casos`)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <Button onClick={aceitar} disabled={loading}>
      {loading ? labels.accepting : labels.accept}
    </Button>
  )
}

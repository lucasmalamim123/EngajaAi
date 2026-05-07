'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function AceitarCasoButton({ caseId, lawyerId }: { caseId: string; lawyerId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function aceitar() {
    setLoading(true)
    const supabase = createClient()

    // Aceitar o caso
    const { error } = await supabase.from('case_assignments').insert({
      case_id: caseId,
      lawyer_id: lawyerId,
      status: 'accepted',
    })

    if (!error) {
      // Atualizar status do caso
      await supabase.from('cases').update({ status: 'in_progress' }).eq('id', caseId)
      router.push('/advogado/dashboard/meus-casos')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <Button onClick={aceitar} disabled={loading}>
      {loading ? 'Aceitando...' : 'Aceitar caso'}
    </Button>
  )
}

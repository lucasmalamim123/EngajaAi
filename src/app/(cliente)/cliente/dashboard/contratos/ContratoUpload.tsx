'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ContratoUpload({ contractId }: { contractId: string }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const supabase = createClient()

    const path = `contratos-assinados/${contractId}-signed.pdf`
    const { error } = await supabase.storage.from('documents').upload(path, file, { upsert: true })

    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(path)
      await supabase.from('contracts').update({
        file_url: publicUrl,
        status: 'signed',
        signed_at: new Date().toISOString(),
      }).eq('id', contractId)
      router.refresh()
    }

    setUploading(false)
  }

  return (
    <>
      <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFile} />
      <Button size="sm" variant="outline" onClick={() => inputRef.current?.click()} disabled={uploading}>
        <Upload size={14} className="mr-1" />
        {uploading ? 'Enviando...' : 'Enviar contrato assinado'}
      </Button>
    </>
  )
}

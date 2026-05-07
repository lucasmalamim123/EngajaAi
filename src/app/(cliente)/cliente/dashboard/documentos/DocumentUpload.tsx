'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Case { id: string; title: string }

export default function DocumentUpload({ cases }: { cases: Case[] }) {
  const [selectedCase, setSelectedCase] = useState(cases[0]?.id ?? '')
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !selectedCase) return

    setUploading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const path = `casos/${selectedCase}/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('documents').upload(path, file)

    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(path)
      await supabase.from('documents').insert({
        case_id: selectedCase,
        uploaded_by: user.id,
        file_url: publicUrl,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
      })
      router.refresh()
    }

    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="flex gap-3 items-end flex-wrap">
      <div className="flex-1 min-w-[200px]">
        <p className="text-sm text-gray-600 mb-1">Caso</p>
        <Select value={selectedCase} onValueChange={setSelectedCase}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o caso" />
          </SelectTrigger>
          <SelectContent>
            {cases.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <input ref={inputRef} type="file" className="hidden" onChange={handleFile} />
      <Button onClick={() => inputRef.current?.click()} disabled={uploading || !selectedCase}>
        <Upload size={14} className="mr-1" />
        {uploading ? 'Enviando...' : 'Selecionar arquivo'}
      </Button>
    </div>
  )
}

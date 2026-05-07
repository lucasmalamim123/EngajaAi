'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { formatDateTime } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface Message {
  id: string
  sender_id: string
  message: string
  created_at: string
  profiles?: { full_name: string; role: string } | { full_name: string; role: string }[] | null
}

export default function TicketChat({
  ticketId,
  messages: initial,
  currentUserId,
  ticketStatus,
}: {
  ticketId: string
  messages: Message[]
  currentUserId: string
  ticketStatus: string
}) {
  const [messages, setMessages] = useState<Message[]>(initial)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`ticket:${ticketId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'ticket_messages', filter: `ticket_id=eq.${ticketId}` },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message])
        }
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [ticketId])

  async function send() {
    if (!text.trim()) return
    setSending(true)
    const supabase = createClient()
    await supabase.from('ticket_messages').insert({
      ticket_id: ticketId,
      sender_id: currentUserId,
      message: text.trim(),
    })
    await supabase.from('tickets').update({ status: 'in_progress', updated_at: new Date().toISOString() }).eq('id', ticketId)
    setText('')
    setSending(false)
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="border rounded-xl bg-gray-50 p-4 min-h-[300px] max-h-[500px] overflow-y-auto flex flex-col gap-3">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm my-auto">Nenhuma mensagem ainda. Inicie a conversa.</p>
        )}
        {messages.map(msg => {
          const profile = Array.isArray(msg.profiles) ? msg.profiles[0] : msg.profiles
          const isMe = msg.sender_id === currentUserId
          return (
            <div key={msg.id} className={cn('flex flex-col max-w-[75%]', isMe ? 'self-end items-end' : 'self-start items-start')}>
              <span className="text-xs text-gray-400 mb-1">{profile?.full_name ?? 'Usuário'}</span>
              <div className={cn('px-4 py-2.5 rounded-2xl text-sm', isMe ? 'bg-blue-600 text-white' : 'bg-white border')}>
                {msg.message}
              </div>
              <span className="text-xs text-gray-300 mt-1">{formatDateTime(msg.created_at)}</span>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {ticketStatus !== 'closed' && (
        <div className="flex gap-2">
          <Textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Digite sua mensagem..."
            rows={2}
            className="flex-1 resize-none"
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          />
          <Button onClick={send} disabled={sending || !text.trim()} className="self-end">
            {sending ? '...' : 'Enviar'}
          </Button>
        </div>
      )}
      {ticketStatus === 'closed' && (
        <p className="text-sm text-center text-gray-400">Este ticket está encerrado.</p>
      )}
    </div>
  )
}

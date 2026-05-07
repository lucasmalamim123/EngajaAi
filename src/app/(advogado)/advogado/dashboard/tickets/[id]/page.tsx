import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { shortId } from '@/lib/utils'
import TicketChat from '@/components/shared/TicketChat'

interface Props { params: Promise<{ id: string }> }

export default async function TicketPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: ticket } = await supabase
    .from('tickets')
    .select('*, cases(title)')
    .eq('id', id)
    .single()

  if (!ticket) notFound()

  const { data: messages } = await supabase
    .from('ticket_messages')
    .select('*, profiles(full_name, role)')
    .eq('ticket_id', id)
    .order('created_at')

  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{(ticket as any).subject}</h1>
        <p className="text-sm text-gray-400">#{shortId(ticket.id)}</p>
      </div>
      <TicketChat
        ticketId={id}
        messages={messages ?? []}
        currentUserId={user!.id}
        ticketStatus={(ticket as any).status}
      />
    </div>
  )
}

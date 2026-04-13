import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendMessageNotification } from '@/lib/email'

// POST /api/notify
// Body: { conversation_id: string, content: string }
// Called after a message is successfully inserted. Fire-and-forget from the client.
export async function POST(request: Request) {
  // Skip silently if Resend is not configured (dev without keys)
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ ok: true, note: 'email skipped — RESEND_API_KEY not set' })
  }

  const { conversation_id, content } = await request.json() as {
    conversation_id?: string
    content?: string
  }

  if (!conversation_id || !content) {
    return NextResponse.json({ error: 'conversation_id and content are required' }, { status: 400 })
  }

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  // Fetch conversation with buyer + store owner info
  const { data: conv, error } = await supabase
    .from('conversations')
    .select(`
      id,
      buyer_id,
      buyer:profiles!buyer_id(full_name, email),
      store:stores!store_id(
        name,
        owner:profiles!owner_id(full_name, email)
      )
    `)
    .eq('id', conversation_id)
    .single()

  if (error || !conv) {
    console.error('Notify: conversation not found', error?.message)
    return NextResponse.json({ error: 'Conversación no encontrada' }, { status: 404 })
  }

  const buyer = conv.buyer as { full_name: string | null; email: string | null } | null
  const store = conv.store as {
    name: string
    owner: { full_name: string | null; email: string | null } | null
  } | null

  const isSenderBuyer = user.id === conv.buyer_id

  const recipientEmail = isSenderBuyer ? store?.owner?.email : buyer?.email
  const recipientName  = isSenderBuyer ? (store?.owner?.full_name ?? 'Vendedor') : (buyer?.full_name ?? 'Cliente')
  const senderName     = isSenderBuyer ? (buyer?.full_name ?? 'Cliente') : (store?.name ?? 'Vendedor')

  if (!recipientEmail) {
    // Recipient has no email stored (created before Phase 5 migration without backfill)
    return NextResponse.json({ ok: true, note: 'email skipped — recipient email not found' })
  }

  try {
    await sendMessageNotification({
      to: recipientEmail,
      recipientName,
      senderName,
      preview: content,
      conversationId: conversation_id,
      isSeller: !isSenderBuyer,
    })
  } catch (err) {
    // Non-blocking: log but don't fail the request
    console.error('Notify: failed to send email', err)
  }

  return NextResponse.json({ ok: true })
}

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendSubscriptionConfirmation, sendSubscriptionRejection } from '@/lib/email'

export async function POST(request: Request) {
  try {
    // Verify the caller is an admin
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json() as {
      action: 'approve' | 'reject'
      sellerEmail: string
      storeName: string
      plan: string
      notes?: string | null
      endsAt?: string | null
    }

    const { action, sellerEmail, storeName, plan, notes, endsAt } = body

    if (action === 'approve' && endsAt) {
      await sendSubscriptionConfirmation({ to: sellerEmail, storeName, plan, endsAt })
    } else if (action === 'reject') {
      await sendSubscriptionRejection({ to: sellerEmail, storeName, plan, notes })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('send-subscription-email error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

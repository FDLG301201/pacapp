import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/conversations
// Body: { store_id: string }
// Returns: { id: string } — existing or newly created conversation id
export async function POST(request: Request) {
  try {
    // Parse body
    let store_id: string | undefined
    try {
      const body = await request.json()
      store_id = body?.store_id
    } catch {
      return NextResponse.json({ error: 'Cuerpo de solicitud inválido' }, { status: 400 })
    }

    if (!store_id) {
      return NextResponse.json({ error: 'store_id es requerido' }, { status: 400 })
    }

    const supabase = await createClient()

    // Verify authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Check buyer role — sellers cannot start conversations
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError) {
      console.error('Profile fetch error:', profileError.message)
      return NextResponse.json({ error: 'Error al verificar perfil' }, { status: 500 })
    }

    if (!profile) {
      return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 })
    }

    if (profile.role === 'seller' || profile.role === 'admin') {
      return NextResponse.json(
        { error: 'Los vendedores no pueden iniciar conversaciones' },
        { status: 403 }
      )
    }

    // Return existing conversation if one exists
    const { data: existing, error: existingError } = await supabase
      .from('conversations')
      .select('id')
      .eq('buyer_id', user.id)
      .eq('store_id', store_id)
      .maybeSingle()

    if (existingError) {
      console.error('Existing conversation lookup error:', existingError.message)
    }

    if (existing) {
      return NextResponse.json({ id: existing.id })
    }

    // Create new conversation
    const { data: created, error: insertError } = await supabase
      .from('conversations')
      .insert({ buyer_id: user.id, store_id })
      .select('id')
      .single()

    if (insertError || !created) {
      console.error('Insert conversation error:', insertError?.message, insertError?.code)
      return NextResponse.json(
        { error: 'No se pudo crear la conversación', detail: insertError?.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ id: created.id }, { status: 201 })

  } catch (err) {
    console.error('Conversations route unhandled error:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

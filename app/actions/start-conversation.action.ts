'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Called from a product detail page when a buyer clicks "Chatear con la tienda".
 * Creates the conversation if it doesn't exist yet, then redirects to /chats.
 *
 * Usage (from a Server Action button in the product page):
 *   <form action={startConversationAction}>
 *     <input type="hidden" name="store_id" value={store.id} />
 *     <input type="hidden" name="product_id" value={product.id} />
 *     <Button type="submit">Chatear con la tienda</Button>
 *   </form>
 */
export async function startConversationAction(formData: FormData) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) redirect('/login?redirectTo=/chats')

  const store_id = formData.get('store_id') as string
  const product_id = formData.get('product_id') as string | null

  if (!store_id) throw new Error('store_id is required')

  // Verify the user is a buyer
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'buyer') redirect('/login')

  // Upsert: get existing or create new conversation
  const { data: conversation, error } = await supabase
    .from('conversations')
    .upsert(
      {
        buyer_id: user.id,
        store_id,
        product_id: product_id || null,
      },
      {
        onConflict: 'buyer_id,store_id,product_id',
        ignoreDuplicates: false,
      }
    )
    .select('id')
    .single()

  if (error) {
    console.error('Error creating conversation:', error.message)
    throw new Error('No se pudo iniciar la conversación. Intenta de nuevo.')
  }

  // Redirect to the chats page (the client will auto-select the conv by ID if needed)
  redirect(`/chats?conv=${conversation.id}`)
}

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EditStoreForm } from './EditStoreForm'
import type { StoreInput } from '@/lib/validations/store'

export default async function EditStorePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: store, error } = await supabase
    .from('stores')
    .select('id, name, description, address, province, phone, whatsapp, instagram, facebook, categories, banner_url')
    .eq('owner_id', user.id)
    .maybeSingle()

  if (error || !store) redirect('/seller/onboarding')

  const initialValues: StoreInput = {
    name:        store.name,
    description: store.description ?? '',
    address:     store.address ?? '',
    province:    (store.province as StoreInput['province']) ?? 'Distrito Nacional',
    phone:       store.phone ?? '',
    whatsapp:    store.whatsapp ?? '',
    instagram:   store.instagram ?? '',
    facebook:    store.facebook ?? '',
    categories:  store.categories ?? [],
  }

  return (
    <EditStoreForm
      storeId={store.id}
      sellerId={user.id}
      initialValues={initialValues}
      existingBannerUrl={store.banner_url ?? null}
    />
  )
}

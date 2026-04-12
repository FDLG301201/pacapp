import { createClient } from '@/lib/supabase/server'
import { SellerLayout } from '@/components/seller-layout'

// Seller route group layout — proxy.ts already enforces seller-only access.
// Fetches the store name server-side so SellerLayout can display it in the sidebar.
// Individual pages handle the no-store check (e.g. dashboard → /seller/onboarding).
export default async function SellerGroupLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let storeName = ''
  if (user) {
    const { data: store } = await supabase
      .from('stores')
      .select('name')
      .eq('owner_id', user.id)
      .maybeSingle()
    storeName = store?.name ?? ''
  }

  return <SellerLayout storeName={storeName}>{children}</SellerLayout>
}

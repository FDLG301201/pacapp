import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OnboardingForm } from './OnboardingForm'

// Server component: if the seller already has a store, send them to the dashboard.
// This prevents creating duplicate stores and avoids redirect loops in the layout.
export default async function OnboardingPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: store } = await supabase
    .from('stores')
    .select('id')
    .eq('owner_id', user.id)
    .maybeSingle()

  if (store) redirect('/seller/dashboard')

  return <OnboardingForm />
}

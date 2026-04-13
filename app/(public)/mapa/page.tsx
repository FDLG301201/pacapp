import { createClient } from '@/lib/supabase/server'
import { MapPageClient } from './MapPageClient'
import type { StoreMarker } from '@/components/map/StoreMap'

export const revalidate = 60 // Revalidate every minute

export default async function MapPage() {
  const supabase = await createClient()

  // Fetch all active stores with coordinates
  const { data: stores } = await supabase
    .from('stores')
    .select('id, name, latitude, longitude, is_verified, banner_url, categories')
    .eq('status', 'active')
    .not('latitude', 'is', null)
    .not('longitude', 'is', null)

  const geolocatedStores: StoreMarker[] = (stores ?? []).map(store => ({
    id: store.id,
    name: store.name,
    lat: Number(store.latitude),
    lng: Number(store.longitude),
    isVerified: store.is_verified,
    coverImageUrl: store.banner_url,
  }))

  return (
    <MapPageClient initialStores={geolocatedStores} />
  )
}

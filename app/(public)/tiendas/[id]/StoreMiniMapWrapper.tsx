'use client'

import dynamic from 'next/dynamic'

// Lazy load map component (client-side only, maps API not available on server)
const StoreMiniMap = dynamic(() =>
  import('@/components/map/StoreMiniMap').then(mod => ({ default: mod.StoreMiniMap })),
  { ssr: false, loading: () => <div className="h-64 bg-muted rounded-lg animate-pulse" /> }
)

interface StoreMiniMapWrapperProps {
  lat: number
  lng: number
  storeName: string
  isVerified: boolean
}

export function StoreMiniMapWrapper({
  lat,
  lng,
  storeName,
  isVerified,
}: StoreMiniMapWrapperProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg">Ubicación</h3>
      <StoreMiniMap
        lat={lat}
        lng={lng}
        storeName={storeName}
        isVerified={isVerified}
      />
    </div>
  )
}

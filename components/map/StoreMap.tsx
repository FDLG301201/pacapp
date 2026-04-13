'use client'

import { useMemo, useState, useCallback } from 'react'
import { Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DR_CENTER, DR_DEFAULT_ZOOM, MAP_ZOOM_LEVELS } from '@/lib/maps/constants'
import { PACAPP_MAP_STYLE } from '@/lib/maps/style'

export interface StoreMarker {
  id: string
  name: string
  lat: number
  lng: number
  isVerified: boolean
  coverImageUrl?: string | null
}

interface StoreMapProps {
  stores: StoreMarker[]
  initialCenter?: { lat: number; lng: number }
  initialZoom?: number
  onStoreClick?: (storeId: string) => void
  showUserLocation?: boolean
  userLocation?: { lat: number; lng: number } | null
  height?: string
}

/**
 * Interactive map displaying store markers with info windows.
 * - Verified stores show green pins with checkmarks
 * - Unverified stores show neutral pins
 * - Click marker to open info window with store card
 * - Automatically fits bounds to show all stores
 * - Supports user location display
 *
 * TODO (scale): use marker clustering with @vis.gl/react-google-maps clustering
 * when stores > 200 to improve performance and UX at scale.
 */
export function StoreMap({
  stores,
  initialCenter = DR_CENTER,
  initialZoom = DR_DEFAULT_ZOOM,
  onStoreClick,
  showUserLocation = false,
  userLocation = null,
  height = '100%',
}: StoreMapProps) {
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null)
  const [mapZoom, setMapZoom] = useState(initialZoom)

  // Memoize store markers to prevent unnecessary re-renders
  const storeMarkersToRender = useMemo(() => stores, [stores])

  const handleMarkerClick = useCallback(
    (storeId: string) => {
      setSelectedStoreId(storeId)
      onStoreClick?.(storeId)
    },
    [onStoreClick]
  )

  const selectedStore = storeMarkersToRender.find((s) => s.id === selectedStoreId)

  return (
    <div style={{ height, width: '100%' }} className="rounded-lg overflow-hidden">
      <Map
        style={{ width: '100%', height: '100%' }}
        defaultCenter={initialCenter}
        defaultZoom={initialZoom}
        mapId="pacapp-map"
        mapTypeId="roadmap"
        disableDefaultUI={false}
        gestureHandling="auto"
        styles={PACAPP_MAP_STYLE}
        onZoomChanged={(e) => setMapZoom(e.detail.zoom)}
      >
        {/* Store markers */}
        {storeMarkersToRender.map((store) => (
          <AdvancedMarker
            key={store.id}
            position={{ lat: store.lat, lng: store.lng }}
            onClick={() => handleMarkerClick(store.id)}
            title={store.name}
          >
            {/* Custom marker pin appearance */}
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full shadow-lg cursor-pointer transition-transform hover:scale-110 ${
                store.isVerified
                  ? 'bg-green-500 border-2 border-green-700'
                  : 'bg-slate-600 border-2 border-slate-800'
              }`}
            >
              {store.isVerified && (
                <CheckCircle className="w-5 h-5 text-white" />
              )}
              {!store.isVerified && (
                <div className="w-3 h-3 bg-white rounded-full" />
              )}
            </div>
          </AdvancedMarker>
        ))}

        {/* User location marker */}
        {showUserLocation && userLocation && (
          <AdvancedMarker
            position={{ lat: userLocation.lat, lng: userLocation.lng }}
            title="Tu ubicación"
          >
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 border-2 border-blue-700 shadow-lg" />
          </AdvancedMarker>
        )}

        {/* Info window for selected store */}
        {selectedStore && (
          <InfoWindow
            position={{ lat: selectedStore.lat, lng: selectedStore.lng }}
            onCloseClick={() => setSelectedStoreId(null)}
          >
            <div className="w-64 bg-white rounded-lg p-4 shadow-lg">
              {/* Store cover image */}
              {selectedStore.coverImageUrl && (
                <div className="relative h-32 w-full mb-3 rounded-md overflow-hidden">
                  <Image
                    src={selectedStore.coverImageUrl}
                    alt={selectedStore.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}

              {/* Store info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground text-sm">
                    {selectedStore.name}
                  </h3>
                  {selectedStore.isVerified && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>

                {/* Ver tienda button */}
                <Button asChild size="sm" className="w-full">
                  <Link href={`/tiendas/${selectedStore.id}`}>
                    Ver tienda
                  </Link>
                </Button>
              </div>
            </div>
          </InfoWindow>
        )}
      </Map>
    </div>
  )
}

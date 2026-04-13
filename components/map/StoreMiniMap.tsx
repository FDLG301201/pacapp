'use client'

import { Map, AdvancedMarker } from '@vis.gl/react-google-maps'
import { CheckCircle, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MAP_ZOOM_LEVELS } from '@/lib/maps/constants'
import { PACAPP_MAP_STYLE } from '@/lib/maps/style'

interface StoreMiniMapProps {
  lat: number
  lng: number
  storeName: string
  isVerified?: boolean
}

/**
 * Non-interactive, read-only map preview showing a single store location.
 * Used on store detail pages.
 * - Non-draggable
 * - No zoom controls
 * - Overlay button to open full directions in Google Maps
 */
export function StoreMiniMap({
  lat,
  lng,
  storeName,
  isVerified = false,
}: StoreMiniMapProps) {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`

  return (
    <div className="space-y-3">
      <div style={{ height: '200px', width: '100%' }} className="rounded-lg overflow-hidden border border-border">
        <Map
          style={{ width: '100%', height: '100%' }}
          defaultCenter={{ lat, lng }}
          defaultZoom={MAP_ZOOM_LEVELS.STREET}
          mapId="pacapp-store-mini-map"
          mapTypeId="roadmap"
          disableDefaultUI={true}
          gestureHandling="none"
          draggable={false}
          scrollwheel={false}
          styles={PACAPP_MAP_STYLE}
        >
          {/* Store marker */}
          <AdvancedMarker
            position={{ lat, lng }}
            title={storeName}
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full shadow-lg ${
                isVerified
                  ? 'bg-green-500 border-2 border-green-700'
                  : 'bg-slate-600 border-2 border-slate-800'
              }`}
            >
              {isVerified && (
                <CheckCircle className="w-5 h-5 text-white" />
              )}
              {!isVerified && (
                <div className="w-3 h-3 bg-white rounded-full" />
              )}
            </div>
          </AdvancedMarker>
        </Map>
      </div>

      {/* Open in Google Maps button */}
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        asChild
      >
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Navigation className="mr-2 h-4 w-4" />
          Cómo llegar
        </a>
      </Button>
    </div>
  )
}

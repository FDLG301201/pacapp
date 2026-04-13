'use client'

import { APIProvider } from '@vis.gl/react-google-maps'

interface MapProviderProps {
  children: React.ReactNode
}

/**
 * Wraps map-using components with the Google Maps API provider.
 * Loads the API once per app section.
 */
export function MapProvider({ children }: MapProviderProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    console.error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set')
    return <div className="text-center text-red-600 p-4">Error: Google Maps API key not configured</div>
  }

  return (
    <APIProvider apiKey={apiKey} onLoad={() => console.log('Maps API loaded')}>
      {children}
    </APIProvider>
  )
}

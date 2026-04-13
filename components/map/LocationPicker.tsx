'use client'

import { useEffect, useState, useCallback } from 'react'
import { Map, AdvancedMarker } from '@vis.gl/react-google-maps'
import usePlacesAutocomplete from 'use-places-autocomplete'
import { MapPin, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DR_CENTER, DR_DEFAULT_ZOOM, MAP_ZOOM_LEVELS, DR_BOUNDS } from '@/lib/maps/constants'
import { PACAPP_MAP_STYLE } from '@/lib/maps/style'

interface LocationPickerProps {
  initialLat?: number
  initialLng?: number
  initialAddress?: string
  onChange: (data: { lat: number; lng: number; formattedAddress: string }) => void
}

/**
 * Interactive map with Places Autocomplete and draggable pin.
 * - Top: Places Autocomplete input biased to Dominican Republic
 * - Map: Shows selected location with draggable pin
 * - Bottom: Displays current selected address (reverse-geocoded)
 * - Cannot confirm without having placed a pin
 */
export function LocationPicker({
  initialLat,
  initialLng,
  initialAddress = '',
  onChange,
}: LocationPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number
    lng: number
  } | null>(
    initialLat && initialLng
      ? { lat: initialLat, lng: initialLng }
      : null
  )
  const [selectedAddress, setSelectedAddress] = useState(initialAddress)
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null)
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(
    selectedLocation || DR_CENTER
  )

  // Initialize Geocoder after Google Maps loads
  useEffect(() => {
    if (typeof window !== 'undefined' && !geocoder) {
      setGeocoder(new window.google.maps.Geocoder())
    }
  }, [geocoder])

  // Reverse geocode location to get address
  const reverseGeocode = useCallback(
    async (lat: number, lng: number) => {
      if (!geocoder) return

      try {
        const results = await new Promise<google.maps.GeocoderResult[]>(
          (resolve, reject) => {
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
              if (status === 'OK' && results) {
                resolve(results)
              } else {
                reject(new Error(`Geocode error: ${status}`))
              }
            })
          }
        )

        if (results.length > 0) {
          setSelectedAddress(results[0].formatted_address)
          onChange({
            lat,
            lng,
            formattedAddress: results[0].formatted_address,
          })
        }
      } catch (error) {
        console.error('Reverse geocoding error:', error)
      }
    },
    [geocoder, onChange]
  )

  // Handle autocomplete selection
  const handleAutocompleteSelect = useCallback(
    async (placeId: string) => {
      if (!geocoder) return

      try {
        const results = await new Promise<google.maps.GeocoderResult[]>(
          (resolve, reject) => {
            geocoder.geocode({ placeId }, (results, status) => {
              if (status === 'OK' && results) {
                resolve(results)
              } else {
                reject(new Error(`Geocode error: ${status}`))
              }
            })
          }
        )

        if (results.length > 0) {
          const result = results[0]
          if (result.geometry?.location) {
            const lat = result.geometry.location.lat()
            const lng = result.geometry.location.lng()

            setSelectedLocation({ lat, lng })
            setMapCenter({ lat, lng })
            setSelectedAddress(result.formatted_address)

            onChange({
              lat,
              lng,
              formattedAddress: result.formatted_address,
            })
          }
        }
      } catch (error) {
        console.error('Autocomplete selection error:', error)
      }
    },
    [geocoder, onChange]
  )

  // Handle map click to place pin
  const handleMapClick = useCallback(
    (e: any) => {
      if (e.latLng) {
        const lat = e.latLng.lat()
        const lng = e.latLng.lng()
        setSelectedLocation({ lat, lng })
        reverseGeocode(lat, lng)
      }
    },
    [reverseGeocode]
  )

  // Handle marker drag
  const handleMarkerDragEnd = useCallback(
    (e: any) => {
      if (e.latLng) {
        const lat = e.latLng.lat()
        const lng = e.latLng.lng()
        setSelectedLocation({ lat, lng })
        reverseGeocode(lat, lng)
      }
    },
    [reverseGeocode]
  )

  return (
    <div className="space-y-4">
      {/* Autocomplete Input */}
      <AutocompleteInput
        onSelectPlace={handleAutocompleteSelect}
        initialValue={initialAddress}
      />

      {/* Map */}
      <div
        style={{ height: '300px', width: '100%' }}
        className="rounded-lg overflow-hidden border border-border"
      >
        <Map
          style={{ width: '100%', height: '100%' }}
          center={mapCenter}
          zoom={selectedLocation ? MAP_ZOOM_LEVELS.STREET : DR_DEFAULT_ZOOM}
          mapId="pacapp-location-picker"
          mapTypeId="roadmap"
          onClick={handleMapClick}
          styles={PACAPP_MAP_STYLE}
        >
          {/* Draggable pin */}
          {selectedLocation && (
            <AdvancedMarker
              position={selectedLocation}
              draggable={true}
              onDragEnd={handleMarkerDragEnd}
              title="Arrastra para ajustar"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-full shadow-lg border-2 border-primary-darker cursor-grab active:cursor-grabbing">
                <MapPin className="w-5 h-5 text-white" />
              </div>
            </AdvancedMarker>
          )}
        </Map>
      </div>

      {/* Selected Address Display */}
      {selectedLocation && selectedAddress && (
        <div className="rounded-lg bg-muted p-3 text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-foreground">{selectedAddress}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedLocation(null)
                setSelectedAddress('')
              }}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Helper text */}
      {!selectedLocation && (
        <p className="text-sm text-muted-foreground">
          Busca tu dirección arriba o haz clic en el mapa para ubicar tu tienda.
        </p>
      )}
    </div>
  )
}

/**
 * Autocomplete input component
 */
function AutocompleteInput({
  onSelectPlace,
  initialValue = '',
}: {
  onSelectPlace: (placeId: string) => void
  initialValue?: string
}) {
  const {
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: 'do' },
      types: ['address'],
    },
  })

  // Initialize with initial value
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue, setValue])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const handleSelectSuggestion = (placeId: string) => {
    clearSuggestions()
    onSelectPlace(placeId)
  }

  const handleClear = () => {
    setValue('')
    clearSuggestions()
  }

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Busca tu dirección o pon el pin en el mapa"
          value={value}
          onChange={handleInputChange}
          className="pl-10 pr-8"
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Autocomplete suggestions dropdown */}
      {status === 'OK' && data.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-50">
          <ul className="max-h-64 overflow-y-auto">
            {data.map(({ place_id, description }) => (
              <li key={place_id}>
                <button
                  onClick={() => handleSelectSuggestion(place_id)}
                  className="w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b border-border last:border-b-0 text-sm"
                >
                  <div className="font-medium text-foreground">{description}</div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

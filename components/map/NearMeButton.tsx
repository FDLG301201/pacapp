'use client'

import { useState, useCallback } from 'react'
import { Navigation, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface NearMeButtonProps {
  onLocationGranted?: (coords: { lat: number; lng: number }) => void
  className?: string
}

const GEOLOCATION_PERMISSION_KEY = 'pacapp_geolocation_permission'

/**
 * Floating button that requests user geolocation and centers the map.
 * - Requests navigator.geolocation.getCurrentPosition
 * - Remembers permission in localStorage to avoid re-prompting
 * - Shows loading state while requesting
 * - Calls onLocationGranted callback with user coords when successful
 */
export function NearMeButton({
  onLocationGranted,
  className = '',
}: NearMeButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleClick = useCallback(() => {
    setLoading(true)

    if (!navigator.geolocation) {
      toast.error('Tu navegador no soporta geolocalización')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        localStorage.setItem(GEOLOCATION_PERMISSION_KEY, 'granted')
        onLocationGranted?.({ lat: latitude, lng: longitude })
        setLoading(false)
        toast.success('Ubicación obtenida')
      },
      (error) => {
        setLoading(false)

        if (error.code === error.PERMISSION_DENIED) {
          localStorage.setItem(GEOLOCATION_PERMISSION_KEY, 'denied')
          toast.error('Habilita tu ubicación en el navegador para usar esta función')
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          toast.error('Tu ubicación no está disponible')
        } else if (error.code === error.TIMEOUT) {
          toast.error('La solicitud de ubicación tardó demasiado')
        } else {
          toast.error('Error al obtener tu ubicación')
        }
        console.error('Geolocation error:', error)
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // 5 min cache
      }
    )
  }, [onLocationGranted])

  return (
    <Button
      variant="default"
      size="icon"
      onClick={handleClick}
      disabled={loading}
      className={`rounded-full shadow-lg ${className}`}
      title="Centrar mapa en mi ubicación"
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Navigation className="h-5 w-5" />
      )}
    </Button>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const LOCATION_BANNER_DISMISSED_KEY = 'pacapp_location_banner_dismissed'
const BANNER_DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

interface LocationBannerProps {
  hasLocation: boolean
}

/**
 * Dismissible banner reminding sellers to add store location.
 * Remembers dismissal for 7 days in localStorage.
 */
export function LocationBanner({ hasLocation }: LocationBannerProps) {
  const [isDismissed, setIsDismissed] = useState(true)

  useEffect(() => {
    // Check if banner is dismissed and not expired
    const dismissedAt = localStorage.getItem(LOCATION_BANNER_DISMISSED_KEY)
    if (dismissedAt) {
      const dismissedTime = parseInt(dismissedAt, 10)
      const now = Date.now()
      if (now - dismissedTime < BANNER_DISMISS_DURATION) {
        setIsDismissed(true)
      } else {
        // Dismissal expired, show banner again
        localStorage.removeItem(LOCATION_BANNER_DISMISSED_KEY)
        setIsDismissed(false)
      }
    } else {
      setIsDismissed(false)
    }
  }, [])

  const handleDismiss = () => {
    localStorage.setItem(LOCATION_BANNER_DISMISSED_KEY, Date.now().toString())
    setIsDismissed(true)
  }

  // Don't show if already has location or if dismissed
  if (hasLocation || isDismissed) {
    return null
  }

  return (
    <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
      <MapPin className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
      <div className="flex-1">
        <h3 className="font-semibold text-amber-900">Tu tienda aún no está en el mapa</h3>
        <p className="text-sm text-amber-800 mt-1">
          Ubícala para que los compradores te encuentren más fácil y puedan ordenar resultados por cercanía.
        </p>
        <div className="flex items-center gap-2 mt-3">
          <Button
            asChild
            size="sm"
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Link href="/seller/tienda#ubicacion">Ubicar ahora</Link>
          </Button>
          <button
            onClick={handleDismiss}
            className="text-sm text-amber-700 hover:text-amber-900 underline"
          >
            Recordar después
          </button>
        </div>
      </div>
      <button
        onClick={handleDismiss}
        className="text-amber-600 hover:text-amber-800 transition-colors"
        aria-label="Cerrar banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

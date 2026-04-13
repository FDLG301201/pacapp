"use client"

import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowUpDown } from "lucide-react"
import { toast } from "sonner"

interface SortDropdownProps {
  currentSort?: string
  userLat?: number
  userLng?: number
}

const GEOLOCATION_SESSION_KEY = 'pacapp_catalog_geolocation'

export function SortDropdown({
  currentSort = "recent",
  userLat,
  userLng,
}: SortDropdownProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [requestingGeolocation, setRequestingGeolocation] = useState(false)

  const handleSortChange = (value: string) => {
    // If user selects "nearest", request geolocation first
    if (value === "nearest") {
      if (userLat && userLng) {
        // Already have geolocation, proceed
        applySortWithGeolocation(value, userLat, userLng)
      } else {
        // Request geolocation
        requestGeolocationAndSort()
      }
      return
    }

    // For other sorts, apply normally
    const params = new URLSearchParams(searchParams)
    if (value === "recent") {
      params.delete("sort")
      params.delete("user_lat")
      params.delete("user_lng")
    } else {
      params.set("sort", value)
      params.delete("user_lat")
      params.delete("user_lng")
    }
    params.set("page", "1")
    router.push(`/productos?${params.toString()}`)
  }

  const requestGeolocationAndSort = () => {
    if (!navigator.geolocation) {
      toast.error("Tu navegador no soporta geolocalización")
      return
    }

    setRequestingGeolocation(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        // Store in sessionStorage for future requests
        sessionStorage.setItem(
          GEOLOCATION_SESSION_KEY,
          JSON.stringify({ lat: latitude, lng: longitude })
        )
        setRequestingGeolocation(false)
        applySortWithGeolocation("nearest", latitude, longitude)
      },
      (error) => {
        setRequestingGeolocation(false)
        if (error.code === error.PERMISSION_DENIED) {
          toast.error("Habilita tu ubicación en el navegador")
        } else {
          toast.error("Error al obtener tu ubicación")
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    )
  }

  const applySortWithGeolocation = (sortValue: string, lat: number, lng: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("sort", sortValue)
    params.set("user_lat", lat.toString())
    params.set("user_lng", lng.toString())
    params.set("page", "1")
    router.push(`/productos?${params.toString()}`)
  }

  const hasGeolocation = userLat && userLng
  const nearestTooltip = hasGeolocation
    ? "Ordenar por cercanía"
    : "Activa tu ubicación para usar esta función"

  return (
    <Select value={currentSort} onValueChange={handleSortChange} disabled={requestingGeolocation}>
      <SelectTrigger className="w-full sm:w-48 gap-2">
        <ArrowUpDown className="w-4 h-4" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="recent">Más reciente</SelectItem>
        <SelectItem value="price_asc">Precio: menor a mayor</SelectItem>
        <SelectItem value="price_desc">Precio: mayor a menor</SelectItem>
        <SelectItem value="popular">Más vistos</SelectItem>
        <SelectItem value="nearest" disabled={!hasGeolocation} title={nearestTooltip}>
          {hasGeolocation ? "Más cercano" : "Más cercano (sin ubicación)"}
        </SelectItem>
      </SelectContent>
    </Select>
  )
}

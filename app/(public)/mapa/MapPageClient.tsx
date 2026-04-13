'use client'

import { useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { MapPin, CheckCircle, ChevronUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { MapProvider } from '@/components/map/MapProvider'
import { NearMeButton } from '@/components/map/NearMeButton'
import type { StoreMarker } from '@/components/map/StoreMap'

// Lazy load map component (reduces initial bundle size)
const StoreMap = dynamic(() =>
  import('@/components/map/StoreMap').then(mod => ({ default: mod.StoreMap })),
  { ssr: false, loading: () => <div className="h-full bg-muted animate-pulse" /> }
)

interface MapPageClientProps {
  initialStores: StoreMarker[]
}

export function MapPageClient({ initialStores }: MapPageClientProps) {
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [mobileListOpen, setMobileListOpen] = useState(false)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Extract unique categories from stores
  const categories = useMemo(() => {
    const cats = new Set<string>()
    initialStores.forEach(store => {
      // Note: categories field might be an array; adjust if needed
    })
    return Array.from(cats)
  }, [initialStores])

  // Filter stores based on criteria
  const filteredStores = useMemo(() => {
    return initialStores.filter(store => {
      if (verifiedOnly && !store.isVerified) return false
      return true
    })
  }, [initialStores, verifiedOnly, selectedCategory])

  // Handle marker click - scroll list item into view
  const handleStoreClick = useCallback((storeId: string) => {
    setSelectedStoreId(storeId)
    // Scroll the selected store into view in the sidebar
    setTimeout(() => {
      const element = document.getElementById(`store-${storeId}`)
      element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 100)
  }, [])

  // Handle geolocation
  const handleLocationGranted = useCallback((coords: { lat: number; lng: number }) => {
    setUserLocation(coords)
  }, [])

  // Empty state
  if (filteredStores.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <MapPin className="h-16 w-16 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">
            Aún no hay tiendas con ubicación en el mapa
          </h2>
          <p className="text-muted-foreground max-w-md">
            Sé la primera tienda ubicada en el mapa. Los vendedores que ubiquen sus tiendas aparecerán aquí.
          </p>
          <Button asChild>
            <Link href="/registro">Registrarse como vendedor</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <MapProvider>
      <div className="flex flex-1 flex-col lg:flex-row h-[calc(100vh-64px)]">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-96 border-r bg-card">
          {/* Filters */}
          <div className="p-4 border-b space-y-3">
            <h2 className="font-semibold">Filtros</h2>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={verifiedOnly ? 'default' : 'secondary'}
                className="cursor-pointer"
                onClick={() => setVerifiedOnly(!verifiedOnly)}
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Verificadas
              </Badge>
            </div>
          </div>

          {/* Store List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-3">
              <p className="text-sm text-muted-foreground">
                {filteredStores.length} tienda{filteredStores.length === 1 ? '' : 's'} encontrada{filteredStores.length === 1 ? '' : 's'}
              </p>
              {filteredStores.map((store) => (
                <button
                  key={store.id}
                  id={`store-${store.id}`}
                  onClick={() => handleStoreClick(store.id)}
                  className="w-full text-left transition-all"
                >
                  <Card
                    className={`hover:shadow-md transition-all ${
                      selectedStoreId === store.id ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <CardContent className="p-3">
                      <div className="flex gap-3">
                        {/* Store thumbnail */}
                        {store.coverImageUrl && (
                          <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={store.coverImageUrl}
                              alt={store.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        )}
                        {/* Store info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <h3 className="font-medium truncate text-foreground">
                              {store.name}
                            </h3>
                            {store.isVerified && (
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {store.lat.toFixed(4)}, {store.lng.toFixed(4)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Map Area */}
        <div className="flex-1 relative">
          <StoreMap
            stores={filteredStores}
            onStoreClick={handleStoreClick}
            showUserLocation={userLocation !== null}
            userLocation={userLocation}
            height="100%"
          />

          {/* "Cerca de mí" button */}
          <div className="absolute bottom-6 right-6 z-40">
            <NearMeButton onLocationGranted={handleLocationGranted} />
          </div>

          {/* Mobile Bottom Sheet Trigger */}
          <div className="lg:hidden absolute bottom-0 left-0 right-0">
            <Sheet open={mobileListOpen} onOpenChange={setMobileListOpen}>
              <SheetTrigger asChild>
                <button className="w-full bg-card border-t p-4 flex items-center justify-center gap-2 hover:bg-muted/50 transition-colors">
                  <ChevronUp className="h-5 w-5" />
                  <span className="font-medium">
                    Ver {filteredStores.length} tienda{filteredStores.length === 1 ? '' : 's'}
                  </span>
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh] rounded-t-xl">
                <SheetHeader className="pb-4">
                  <SheetTitle>Tiendas en el mapa</SheetTitle>
                </SheetHeader>

                {/* Mobile Filters */}
                <div className="pb-4 border-b">
                  <Badge
                    variant={verifiedOnly ? 'default' : 'secondary'}
                    className="cursor-pointer"
                    onClick={() => setVerifiedOnly(!verifiedOnly)}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verificadas
                  </Badge>
                </div>

                {/* Mobile Store List */}
                <div className="flex-1 overflow-y-auto py-4 space-y-3">
                  {filteredStores.map((store) => (
                    <Link
                      key={store.id}
                      href={`/tiendas/${store.id}`}
                      onClick={() => setMobileListOpen(false)}
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-3">
                          <div className="flex gap-3">
                            {store.coverImageUrl && (
                              <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                  src={store.coverImageUrl}
                                  alt={store.name}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1">
                                <h3 className="font-medium truncate text-foreground">
                                  {store.name}
                                </h3>
                                {store.isVerified && (
                                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {store.lat.toFixed(4)}, {store.lng.toFixed(4)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </MapProvider>
  )
}

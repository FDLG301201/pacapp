'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Star, BadgeCheck, Filter, X, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { stores } from '@/lib/mock-data'

const distances = ['0.5 km', '1.2 km', '2.3 km', '3.1 km', '4.5 km', '5.8 km']

export default function MapPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [mobileListOpen, setMobileListOpen] = useState(false)

  const categories = ['Ropa de Mujer', 'Ropa de Hombre', 'Niños', 'Zapatos', 'Accesorios']

  const filteredStores = stores.filter(store => {
    if (verifiedOnly && !store.verified) return false
    return true
  })

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-[400px] border-r bg-card">
          {/* Filters */}
          <div className="p-4 border-b">
            <h2 className="font-semibold mb-3">Filtros</h2>
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant={verifiedOnly ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => setVerifiedOnly(!verifiedOnly)}
              >
                <BadgeCheck className="h-3 w-3 mr-1" />
                Verificadas
              </Badge>
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Store List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <p className="text-sm text-muted-foreground mb-4">
                {filteredStores.length} tiendas encontradas
              </p>
              <div className="space-y-3">
                {filteredStores.map((store, index) => (
                  <Link key={store.id} href={`/tiendas/${store.id}`}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-3">
                        <div className="flex gap-3">
                          <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={store.coverImage}
                              alt={store.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <h3 className="font-medium truncate">{store.name}</h3>
                              {store.verified && (
                                <BadgeCheck className="h-4 w-4 text-primary flex-shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-0.5">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                {store.rating}
                              </span>
                              <span>({store.reviewCount})</span>
                            </div>
                            <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{store.location}</span>
                            </div>
                          </div>
                          <Badge variant="secondary" className="self-start">
                            {distances[index % distances.length]}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Map Area */}
        <div className="flex-1 relative">
          {/* TODO: integrate Google Maps */}
          <div 
            className="absolute inset-0 bg-muted"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          >
            {/* Map Markers */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full max-w-3xl max-h-[600px]">
                {filteredStores.map((store, index) => {
                  const positions = [
                    { top: '20%', left: '30%' },
                    { top: '35%', left: '60%' },
                    { top: '50%', left: '25%' },
                    { top: '40%', left: '75%' },
                    { top: '65%', left: '45%' },
                    { top: '55%', left: '70%' },
                  ]
                  const pos = positions[index % positions.length]
                  
                  return (
                    <Link 
                      key={store.id} 
                      href={`/tiendas/${store.id}`}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                      style={{ top: pos.top, left: pos.left }}
                    >
                      <div className="relative">
                        <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <MapPin className="h-5 w-5" />
                        </div>
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <Card className="shadow-lg">
                            <CardContent className="p-2 whitespace-nowrap">
                              <div className="flex items-center gap-1">
                                <span className="font-medium text-sm">{store.name}</span>
                                {store.verified && (
                                  <BadgeCheck className="h-3 w-3 text-primary" />
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                {store.rating}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Map Placeholder Text */}
            <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 text-sm text-muted-foreground">
              <p>Mapa interactivo</p>
              <p className="text-xs">Google Maps próximamente</p>
            </div>
          </div>

          {/* Mobile Bottom Sheet Trigger */}
          <div className="lg:hidden absolute bottom-0 left-0 right-0">
            <Sheet open={mobileListOpen} onOpenChange={setMobileListOpen}>
              <SheetTrigger asChild>
                <button className="w-full bg-card border-t p-4 flex items-center justify-center gap-2">
                  <ChevronUp className="h-5 w-5" />
                  <span className="font-medium">Ver {filteredStores.length} tiendas</span>
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh] rounded-t-xl">
                <SheetHeader className="pb-4">
                  <SheetTitle>Tiendas cerca de ti</SheetTitle>
                </SheetHeader>
                
                {/* Mobile Filters */}
                <div className="pb-4 border-b">
                  <div className="flex flex-wrap gap-2">
                    <Badge 
                      variant={verifiedOnly ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => setVerifiedOnly(!verifiedOnly)}
                    >
                      <BadgeCheck className="h-3 w-3 mr-1" />
                      Verificadas
                    </Badge>
                    {selectedCategory && (
                      <Badge variant="default" className="cursor-pointer" onClick={() => setSelectedCategory(null)}>
                        {selectedCategory}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    )}
                    <Sheet>
                      <SheetTrigger asChild>
                        <Badge variant="secondary" className="cursor-pointer">
                          <Filter className="h-3 w-3 mr-1" />
                          Más filtros
                        </Badge>
                      </SheetTrigger>
                      <SheetContent side="bottom" className="h-auto rounded-t-xl">
                        <SheetHeader>
                          <SheetTitle>Filtrar por categoría</SheetTitle>
                        </SheetHeader>
                        <div className="py-4 space-y-2">
                          {categories.map((category) => (
                            <Button
                              key={category}
                              variant={selectedCategory === category ? "default" : "outline"}
                              className="w-full justify-start"
                              onClick={() => {
                                setSelectedCategory(selectedCategory === category ? null : category)
                              }}
                            >
                              {category}
                            </Button>
                          ))}
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>

                {/* Mobile Store List */}
                <div className="flex-1 overflow-y-auto py-4">
                  <div className="space-y-3">
                    {filteredStores.map((store, index) => (
                      <Link key={store.id} href={`/tiendas/${store.id}`} onClick={() => setMobileListOpen(false)}>
                        <Card>
                          <CardContent className="p-3">
                            <div className="flex gap-3">
                              <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                  src={store.coverImage}
                                  alt={store.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1">
                                  <h3 className="font-medium truncate">{store.name}</h3>
                                  {store.verified && (
                                    <BadgeCheck className="h-4 w-4 text-primary flex-shrink-0" />
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-0.5">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    {store.rating}
                                  </span>
                                  <span>({store.reviewCount})</span>
                                </div>
                                <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  <span className="truncate">{store.location}</span>
                                </div>
                              </div>
                              <Badge variant="secondary" className="self-start">
                                {distances[index % distances.length]}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
    </div>
  )
}

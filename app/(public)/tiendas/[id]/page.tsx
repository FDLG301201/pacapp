'use client'

import { use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Star, BadgeCheck, Phone, Clock, Share2, Navigation, Instagram, Facebook, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { ReviewItem } from '@/components/review-item'
import { getStore, getProductsByStore, getReviewsByStore } from '@/lib/mock-data'

interface StorePageProps {
  params: Promise<{ id: string }>
}

export default function StorePage({ params }: StorePageProps) {
  const { id } = use(params)
  const store = getStore(id)
  const products = store ? getProductsByStore(store.id) : []
  const reviews = store ? getReviewsByStore(store.id) : []

  if (!store) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Tienda no encontrada</h1>
            <p className="mt-2 text-muted-foreground">La tienda que buscas no existe o fue eliminada.</p>
            <Link href="/">
              <Button className="mt-4">Volver al inicio</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Cover Image */}
        <div className="relative h-48 md:h-64 lg:h-80 bg-muted">
          <Image
            src={store.coverImage}
            alt={store.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="container mx-auto px-4">
          {/* Store Header */}
          <div className="relative -mt-16 md:-mt-20 mb-8">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-xl border-4 border-card overflow-hidden bg-card shadow-lg">
                <Image
                  src={store.logo}
                  alt={store.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 md:pb-2">
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-2xl md:text-3xl font-bold">{store.name}</h1>
                  {store.verified && (
                    <Badge className="gap-1">
                      <BadgeCheck className="h-3 w-3" />
                      Verificada
                    </Badge>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-foreground">{store.rating}</span>
                    <span>({store.reviewCount} reseñas)</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {store.location}, {store.province}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Contactar
                </Button>
                <Button variant="outline" className="gap-2">
                  <Navigation className="h-4 w-4" />
                  Cómo llegar
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="productos" className="pb-12">
            <TabsList className="w-full md:w-auto grid grid-cols-3 md:inline-flex">
              <TabsTrigger value="productos">
                Productos ({products.length})
              </TabsTrigger>
              <TabsTrigger value="info">Información</TabsTrigger>
              <TabsTrigger value="resenas">
                Reseñas ({reviews.length})
              </TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="productos" className="mt-6">
              {products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} showStore={false} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Esta tienda aún no tiene productos publicados.</p>
                </div>
              )}
            </TabsContent>

            {/* Info Tab */}
            <TabsContent value="info" className="mt-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4">Sobre la tienda</h3>
                      <p className="text-muted-foreground">{store.description}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-semibold">Información de contacto</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Dirección</p>
                            <p className="text-sm text-muted-foreground">{store.address}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Horario</p>
                            <p className="text-sm text-muted-foreground">{store.hours}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Teléfono</p>
                            <p className="text-sm text-muted-foreground">{store.phone}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {(store.socialMedia.instagram || store.socialMedia.facebook) && (
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-4">Redes sociales</h3>
                        <div className="flex gap-3">
                          {store.socialMedia.instagram && (
                            <a
                              href={`https://instagram.com/${store.socialMedia.instagram.replace('@', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                            >
                              <Instagram className="h-5 w-5" />
                              {store.socialMedia.instagram}
                            </a>
                          )}
                          {store.socialMedia.facebook && (
                            <a
                              href={`https://facebook.com/${store.socialMedia.facebook}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                            >
                              <Facebook className="h-5 w-5" />
                              {store.socialMedia.facebook}
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Map Placeholder */}
                <Card className="h-[400px]">
                  <CardContent className="p-0 h-full">
                    {/* TODO: integrate Google Maps */}
                    <div className="h-full bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center p-6">
                        <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Mapa de ubicación</p>
                        <p className="text-sm text-muted-foreground mt-1">{store.address}</p>
                        <Button variant="outline" className="mt-4 gap-2">
                          <Navigation className="h-4 w-4" />
                          Abrir en Google Maps
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="resenas" className="mt-6">
              <div className="max-w-2xl">
                {/* Rating Summary */}
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-4xl font-bold">{store.rating}</p>
                        <div className="flex items-center gap-0.5 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.round(store.rating) 
                                  ? 'fill-yellow-400 text-yellow-400' 
                                  : 'fill-muted text-muted'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{store.reviewCount} reseñas</p>
                      </div>
                      <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => {
                          const count = reviews.filter(r => r.rating === rating).length
                          const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                          return (
                            <div key={rating} className="flex items-center gap-2">
                              <span className="text-sm w-3">{rating}</span>
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-yellow-400 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-muted-foreground w-8">{count}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Reviews List */}
                {reviews.length > 0 ? (
                  <div>
                    {reviews.map((review) => (
                      <ReviewItem key={review.id} review={review} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Esta tienda aún no tiene reseñas.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Mobile Sticky CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-card border-t">
        <Button className="w-full gap-2">
          <MessageCircle className="h-5 w-5" />
          Contactar vendedor
        </Button>
      </div>

      <Footer />
    </div>
  )
}

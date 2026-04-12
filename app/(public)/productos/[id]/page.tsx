'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { use } from 'react'
import { Heart, Share2, MapPin, Star, BadgeCheck, ShieldCheck, MessageSquare, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { getProduct, getStore, getProductsByStore, formatPrice } from '@/lib/mock-data'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params)
  const product = getProduct(id)
  const store = product ? getStore(product.storeId) : null
  const storeProducts = product ? getProductsByStore(product.storeId).filter(p => p.id !== product.id).slice(0, 4) : []
  
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  if (!product || !store) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Producto no encontrado</h1>
            <p className="mt-2 text-muted-foreground">El producto que buscas no existe o fue eliminado.</p>
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
      
      <main className="flex-1 py-6">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Inicio</Link>
            <span className="mx-2">/</span>
            <Link href={`/?categoria=${product.category.toLowerCase()}`} className="hover:text-foreground">{product.category}</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="grid grid-cols-5 gap-2">
                {product.images.slice(0, 5).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-md overflow-hidden bg-muted ${
                      selectedImage === index ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - imagen ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <h1 className="font-serif text-2xl md:text-3xl font-bold">{product.name}</h1>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsFavorite(!isFavorite)}
                      aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                    >
                      <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Button variant="outline" size="icon" aria-label="Compartir">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <p className="mt-3 text-3xl font-bold text-primary">{formatPrice(product.price)}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="secondary">{product.size}</Badge>
                  <Badge variant="secondary">{product.condition}</Badge>
                  <Badge variant="secondary">{product.gender}</Badge>
                </div>
              </div>

              {/* Store Card */}
              <Card>
                <CardContent className="p-4">
                  <Link href={`/tiendas/${store.id}`} className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden">
                      <Image
                        src={store.logo}
                        alt={store.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-medium truncate">{store.name}</span>
                        {store.verified && (
                          <BadgeCheck className="h-4 w-4 text-primary flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {store.rating} ({store.reviewCount})
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {store.location}
                        </span>
                      </div>
                    </div>
                  </Link>
                  <Link href={`/tiendas/${store.id}`}>
                    <Button variant="ghost" size="sm" className="w-full mt-3">
                      Ver tienda
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button size="lg" className="w-full gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Contactar vendedor
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full gap-2"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  {isFavorite ? 'Guardado en favoritos' : 'Guardar en favoritos'}
                </Button>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="descripcion" className="w-full">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="descripcion">Descripción</TabsTrigger>
                  <TabsTrigger value="detalles">Detalles</TabsTrigger>
                  <TabsTrigger value="tienda">Tienda</TabsTrigger>
                </TabsList>
                <TabsContent value="descripcion" className="mt-4">
                  <p className="text-muted-foreground">{product.description}</p>
                </TabsContent>
                <TabsContent value="detalles" className="mt-4">
                  <dl className="space-y-3">
                    <div className="flex justify-between py-2 border-b">
                      <dt className="text-muted-foreground">Talla</dt>
                      <dd className="font-medium">{product.size}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <dt className="text-muted-foreground">Categoría</dt>
                      <dd className="font-medium">{product.category}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <dt className="text-muted-foreground">Estado</dt>
                      <dd className="font-medium">{product.condition}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <dt className="text-muted-foreground">Género</dt>
                      <dd className="font-medium">{product.gender}</dd>
                    </div>
                    {product.brand && (
                      <div className="flex justify-between py-2 border-b">
                        <dt className="text-muted-foreground">Marca</dt>
                        <dd className="font-medium">{product.brand}</dd>
                      </div>
                    )}
                    {product.color && (
                      <div className="flex justify-between py-2 border-b">
                        <dt className="text-muted-foreground">Color</dt>
                        <dd className="font-medium">{product.color}</dd>
                      </div>
                    )}
                    {product.material && (
                      <div className="flex justify-between py-2">
                        <dt className="text-muted-foreground">Material</dt>
                        <dd className="font-medium">{product.material}</dd>
                      </div>
                    )}
                  </dl>
                </TabsContent>
                <TabsContent value="tienda" className="mt-4">
                  <p className="text-muted-foreground">{store.description}</p>
                  <div className="mt-4 space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {store.address}
                    </p>
                    <p className="text-muted-foreground">{store.hours}</p>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span>Tienda verificada</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 text-primary" />
                  <span>Reseñas reales</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4 text-primary" />
                  <span>Coordina directo con el vendedor</span>
                </div>
              </div>
            </div>
          </div>

          {/* More from this store */}
          {storeProducts.length > 0 && (
            <section className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl font-bold">Más de {store.name}</h2>
                <Link href={`/tiendas/${store.id}`}>
                  <Button variant="ghost">Ver todo</Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {storeProducts.map((p) => (
                  <ProductCard key={p.id} product={p} showStore={false} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-card border-t">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xl font-bold text-primary">{formatPrice(product.price)}</p>
          </div>
          <Button className="flex-1 gap-2">
            <MessageSquare className="h-5 w-5" />
            Contactar vendedor
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}

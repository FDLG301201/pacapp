'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Heart, Share2, MapPin, Star, BadgeCheck, ShieldCheck, MessageSquare, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProductCard } from '@/components/product-card'
import { getProduct, getStore, getProductsByStore, formatPrice } from '@/lib/mock-data'

// ─── Types ───────────────────────────────────────────────────

interface DisplayProduct {
  id: string
  name: string
  price: number
  images: string[]
  category: string
  size: string
  condition: string
  gender: string
  brand: string | null
  color: string | null
  material: string | null
  description: string
  source: 'mock' | 'real'
}

interface DisplayStore {
  supabaseId: string | null  // null = mock store (needs ilike lookup)
  name: string
  logo: string | null
  slug: string
  verified: boolean
  description: string | null
  address: string | null
  rating?: number
  reviewCount?: number
  location?: string
  hours?: string
}

interface RealRelatedProduct {
  id: string
  title: string | null
  price: number
  size: string
  condition: string
  coverUrl: string | null
}

// ─── Helpers ─────────────────────────────────────────────────

function isUUID(str: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)
}

interface ProductPageProps {
  params: Promise<{ id: string }>
}

// ─── Component ───────────────────────────────────────────────

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(isUUID(id))
  const [product, setProduct] = useState<DisplayProduct | null>(null)
  const [store, setStore] = useState<DisplayStore | null>(null)
  const [mockRelated, setMockRelated] = useState<ReturnType<typeof getProductsByStore>>([])
  const [realRelated, setRealRelated] = useState<RealRelatedProduct[]>([])
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [contacting, setContacting] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (isUUID(id)) {
      fetchRealProduct(id)
    } else {
      loadMockProduct(id)
    }
  }, [id])

  // ── Fetch real product from Supabase ──
  const fetchRealProduct = async (productId: string) => {
    const { data: prod, error } = await supabase
      .from('products')
      .select(`
        *,
        store:stores!store_id(id, name, slug, logo_url, description, address, province, is_verified),
        images:product_images(url, position)
      `)
      .eq('id', productId)
      .eq('status', 'active')
      .single()

    if (error || !prod) {
      setNotFound(true)
      setLoading(false)
      return
    }

    const sortedImages = ((prod.images ?? []) as { url: string; position: number }[])
      .sort((a, b) => a.position - b.position)
      .map((img) => img.url)

    setProduct({
      id: prod.id,
      name: prod.title ?? 'Sin título',
      price: Number(prod.price),
      images: sortedImages,
      category: prod.category,
      size: prod.size,
      condition: prod.condition,
      gender: prod.gender,
      brand: prod.brand,
      color: prod.color,
      material: prod.material,
      description: prod.description ?? '',
      source: 'real',
    })

    const s = prod.store as {
      id: string; name: string; slug: string
      logo_url: string | null; description: string | null
      address: string | null; province: string | null; is_verified: boolean
    }

    setStore({
      supabaseId: s.id,
      name: s.name,
      logo: s.logo_url,
      slug: s.slug,
      verified: s.is_verified,
      description: s.description,
      address: s.address ? `${s.address}${s.province ? `, ${s.province}` : ''}` : null,
    })

    // Fetch related products from the same real store
    const { data: related } = await supabase
      .from('products')
      .select('id, title, price, size, condition, images:product_images(url, position)')
      .eq('store_id', prod.store_id)
      .eq('status', 'active')
      .neq('id', productId)
      .limit(4)

    if (related) {
      setRealRelated(
        related.map((r) => {
          const imgs = ((r.images ?? []) as { url: string; position: number }[])
            .sort((a, b) => a.position - b.position)
          return {
            id: r.id,
            title: r.title,
            price: Number(r.price),
            size: r.size,
            condition: r.condition,
            coverUrl: imgs[0]?.url ?? null,
          }
        })
      )
    }

    setLoading(false)
  }

  // ── Load mock product ──
  const loadMockProduct = (productId: string) => {
    const mockProduct = getProduct(productId)
    if (!mockProduct) { setNotFound(true); return }
    const mockStore = getStore(mockProduct.storeId)
    if (!mockStore) { setNotFound(true); return }

    setProduct({
      id: mockProduct.id,
      name: mockProduct.name,
      price: mockProduct.price,
      images: mockProduct.images,
      category: mockProduct.category,
      size: mockProduct.size,
      condition: mockProduct.condition,
      gender: mockProduct.gender,
      brand: mockProduct.brand ?? null,
      color: mockProduct.color ?? null,
      material: mockProduct.material ?? null,
      description: mockProduct.description,
      source: 'mock',
    })

    setStore({
      supabaseId: null,
      name: mockStore.name,
      logo: mockStore.logo,
      slug: mockStore.id,
      verified: mockStore.verified,
      description: mockStore.description,
      address: mockStore.address,
      rating: mockStore.rating,
      reviewCount: mockStore.reviewCount,
      location: mockStore.location,
      hours: mockStore.hours,
    })

    setMockRelated(
      getProductsByStore(mockProduct.storeId)
        .filter((p) => p.id !== productId)
        .slice(0, 4)
    )
  }

  // ── Contact seller ──
  const handleContact = async () => {
    if (contacting || !product || !store) return
    setContacting(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push(`/login?redirectTo=/productos/${id}`)
        return
      }

      let realStoreId: string | null = null

      if (store.supabaseId) {
        // Real product — store ID is already known
        realStoreId = store.supabaseId
      } else {
        // Mock product — lookup by store name
        const { data: stores } = await supabase
          .from('stores')
          .select('id')
          .ilike('name', store.name)
          .eq('status', 'active')
          .limit(1)
        realStoreId = stores?.[0]?.id ?? null
      }

      if (!realStoreId) {
        console.warn('Store not found in Supabase for:', store.name)
        router.push('/chats')
        return
      }

      // Find or create conversation
      let convId: string

      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .eq('buyer_id', user.id)
        .eq('store_id', realStoreId)
        .maybeSingle()

      if (existing) {
        convId = existing.id
      } else {
        const { data: conv, error: convError } = await supabase
          .from('conversations')
          .insert({ buyer_id: user.id, store_id: realStoreId })
          .select('id')
          .single()

        if (convError || !conv) {
          console.error('Conversation insert error:', convError?.message)
          router.push('/chats')
          return
        }
        convId = conv.id
      }

      // Always send product interest message with link
      const productUrl = `${window.location.origin}/productos/${id}`
      await supabase.from('messages').insert({
        conversation_id: convId,
        sender_id: user.id,
        content: `¡Hola! Me interesa este producto: ${product.name}\n${productUrl}`,
      })

      router.push(`/chats?conv=${convId}`)
    } catch (err) {
      console.error('handleContact error:', err)
      router.push('/chats')
    } finally {
      setContacting(false)
    }
  }

  // ─── Loading skeleton ────────────────────────────────────────

  if (loading) {
    return (
      <main className="flex-1 py-6">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton className="aspect-[3/4] w-full rounded-lg" />
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="aspect-square rounded-md" />)}
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-9 w-3/4" />
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  // ─── Not found ───────────────────────────────────────────────

  if (notFound || !product || !store) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Producto no encontrado</h1>
          <p className="mt-2 text-muted-foreground">El producto que buscas no existe o fue eliminado.</p>
          <Link href="/"><Button className="mt-4">Volver al inicio</Button></Link>
        </div>
      </main>
    )
  }

  const hasImages = product.images.length > 0

  // ─── Render ──────────────────────────────────────────────────

  return (
    <>
      <main className="flex-1 py-6">
        <div className="container mx-auto px-4">

          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Inicio</Link>
            <span className="mx-2">/</span>
            <span className="hover:text-foreground">{product.category}</span>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8">

            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                {hasImages ? (
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                    Sin imagen
                  </div>
                )}
              </div>
              {hasImages && product.images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {product.images.slice(0, 5).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square rounded-md overflow-hidden bg-muted ${
                        selectedImage === index ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <Image src={image} alt={`${product.name} - imagen ${index + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
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
                  <Link href={`/tiendas/${store.slug}`} className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                      {store.logo ? (
                        <Image src={store.logo} alt={store.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg font-bold text-muted-foreground">
                          {store.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-medium truncate">{store.name}</span>
                        {store.verified && <BadgeCheck className="h-4 w-4 text-primary flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        {store.rating !== undefined && (
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {store.rating} ({store.reviewCount})
                          </span>
                        )}
                        {(store.location ?? store.address) && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {store.location ?? store.address}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                  <Link href={`/tiendas/${store.slug}`}>
                    <Button variant="ghost" size="sm" className="w-full mt-3">Ver tienda</Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button size="lg" className="w-full gap-2" onClick={handleContact} disabled={contacting}>
                  <MessageSquare className="h-5 w-5" />
                  {contacting ? 'Abriendo chat...' : 'Contactar vendedor'}
                </Button>
                <Button size="lg" variant="outline" className="w-full gap-2" onClick={() => setIsFavorite(!isFavorite)}>
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
                  <p className="text-muted-foreground">{product.description || 'Sin descripción.'}</p>
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
                  <p className="text-muted-foreground">{store.description ?? ''}</p>
                  {store.address && (
                    <div className="mt-4 space-y-2 text-sm">
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {store.address}
                      </p>
                      {store.hours && <p className="text-muted-foreground">{store.hours}</p>}
                    </div>
                  )}
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
          {product.source === 'mock' && mockRelated.length > 0 && (
            <section className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl font-bold">Más de {store.name}</h2>
                <Link href={`/tiendas/${store.slug}`}>
                  <Button variant="ghost">Ver todo</Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mockRelated.map((p) => <ProductCard key={p.id} product={p} showStore={false} />)}
              </div>
            </section>
          )}

          {product.source === 'real' && realRelated.length > 0 && (
            <section className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl font-bold">Más de {store.name}</h2>
                <Link href={`/tiendas/${store.slug}`}>
                  <Button variant="ghost">Ver todo</Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {realRelated.map((p) => (
                  <Link key={p.id} href={`/productos/${p.id}`}>
                    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                        {p.coverUrl ? (
                          <Image
                            src={p.coverUrl}
                            alt={p.title ?? 'Producto'}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                            Sin imagen
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2 flex gap-1">
                          <Badge variant="secondary" className="text-xs">{p.size}</Badge>
                          <Badge variant="secondary" className="text-xs">{p.condition}</Badge>
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
                          {p.title ?? 'Sin título'}
                        </h3>
                        <p className="mt-1 font-semibold text-primary">{formatPrice(p.price)}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      </main>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-card border-t">
        <div className="flex items-center gap-3">
          <p className="text-xl font-bold text-primary">{formatPrice(product.price)}</p>
          <Button className="flex-1 gap-2" onClick={handleContact} disabled={contacting}>
            <MessageSquare className="h-5 w-5" />
            {contacting ? 'Abriendo chat...' : 'Contactar vendedor'}
          </Button>
        </div>
      </div>
    </>
  )
}

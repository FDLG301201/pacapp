'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  MapPin, Star, BadgeCheck, Phone, Clock, Share2, Navigation,
  Instagram, Facebook, MessageCircle, Package,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { ReviewItem } from '@/components/review-item'
import { ProductCard } from '@/components/product-card'
import { createClient } from '@/lib/supabase/client'
import { getStore, getProductsByStore, getReviewsByStore, formatPrice } from '@/lib/mock-data'

// ─── Types ───────────────────────────────────────────────────

interface DisplayStore {
  supabaseId: string | null
  name: string
  slug: string
  logo: string | null
  banner: string | null
  description: string | null
  address: string | null
  province: string | null
  phone: string | null
  whatsapp: string | null
  instagram: string | null
  facebook: string | null
  hours: string | null
  verified: boolean
  ratingAvg: number
  reviewCount: number
  source: 'real' | 'mock'
}

interface DisplayReview {
  id: string
  rating: number
  comment: string | null
  buyerName: string
  buyerAvatar: string | null
  date: string
}

interface RealProduct {
  id: string
  title: string | null
  price: number
  size: string
  condition: string
  coverUrl: string | null
}

// ─── Star Rating Input ────────────────────────────────────────

function StarRatingInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`${star} estrella${star > 1 ? 's' : ''}`}
        >
          <Star
            className={`h-8 w-8 transition-colors ${
              star <= (hovered || value)
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-muted text-muted-foreground'
            }`}
          />
        </button>
      ))}
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────

function isNumeric(str: string) {
  return /^\d+$/.test(str)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })
}

// ─── Component ───────────────────────────────────────────────

interface StorePageProps {
  params: Promise<{ id: string }>
}

export default function StorePage({ params }: StorePageProps) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [store, setStore] = useState<DisplayStore | null>(null)
  const [reviews, setReviews] = useState<DisplayReview[]>([])
  const [realProducts, setRealProducts] = useState<RealProduct[]>([])
  const [mockProducts, setMockProducts] = useState<ReturnType<typeof getProductsByStore>>([])
  const [notFound, setNotFound] = useState(false)

  // Review form state
  const [userId, setUserId] = useState<string | null>(null)
  const [canReview, setCanReview] = useState(false)
  const [existingReview, setExistingReview] = useState<DisplayReview | null>(null)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [reviewError, setReviewError] = useState<string | null>(null)
  const [contacting, setContacting] = useState(false)

  useEffect(() => {
    loadStore()
  }, [id])

  // ── Load store ──
  const loadStore = async () => {
    setLoading(true)
    setStore(null)
    setReviews([])
    setRealProducts([])
    setMockProducts([])
    setCanReview(false)
    setExistingReview(null)
    setRating(0)
    setComment('')
    setReviewError(null)
    setNotFound(false)

    // Try Supabase first (by slug)
    if (!isNumeric(id)) {
      const { data: realStore } = await supabase
        .from('stores')
        .select('id, name, slug, logo_url, banner_url, description, address, province, phone, whatsapp, instagram, facebook, is_verified, rating_avg, review_count, status')
        .eq('slug', id)
        .eq('status', 'active')
        .single()

      if (realStore) {
        setStore({
          supabaseId: realStore.id,
          name: realStore.name,
          slug: realStore.slug,
          logo: realStore.logo_url,
          banner: realStore.banner_url,
          description: realStore.description,
          address: realStore.address,
          province: realStore.province,
          phone: realStore.phone,
          whatsapp: realStore.whatsapp,
          instagram: realStore.instagram,
          facebook: realStore.facebook,
          hours: null,
          verified: realStore.is_verified,
          ratingAvg: Number(realStore.rating_avg ?? 0),
          reviewCount: realStore.review_count ?? 0,
          source: 'real',
        })
        await Promise.all([
          loadRealProducts(realStore.id),
          loadRealReviews(realStore.id),
          loadAuthState(realStore.id),
        ])
        setLoading(false)
        return
      }
    }

    // Fall back to mock data
    const mockStore = getStore(id)
    if (!mockStore) {
      setNotFound(true)
      setLoading(false)
      return
    }

    setStore({
      supabaseId: null,
      name: mockStore.name,
      slug: mockStore.id,
      logo: mockStore.logo,
      banner: mockStore.coverImage,
      description: mockStore.description,
      address: mockStore.address,
      province: mockStore.province,
      phone: mockStore.phone,
      whatsapp: mockStore.socialMedia?.whatsapp ?? null,
      instagram: mockStore.socialMedia?.instagram ?? null,
      facebook: mockStore.socialMedia?.facebook ?? null,
      hours: mockStore.hours,
      verified: mockStore.verified,
      ratingAvg: mockStore.rating,
      reviewCount: mockStore.reviewCount,
      source: 'mock',
    })
    setMockProducts(getProductsByStore(mockStore.id))

    const mockReviews = getReviewsByStore(mockStore.id)
    setReviews(
      mockReviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        buyerName: r.userName,
        buyerAvatar: r.userAvatar,
        date: r.date,
      }))
    )
    setLoading(false)
  }

  const loadRealProducts = async (storeId: string) => {
    const { data } = await supabase
      .from('products')
      .select('id, title, price, size, condition, images:product_images(url, position)')
      .eq('store_id', storeId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (data) {
      setRealProducts(
        data.map((p) => {
          const imgs = ((p.images ?? []) as { url: string; position: number }[])
            .sort((a, b) => a.position - b.position)
          return {
            id: p.id,
            title: p.title,
            price: Number(p.price),
            size: p.size,
            condition: p.condition,
            coverUrl: imgs[0]?.url ?? null,
          }
        })
      )
    }
  }

  const loadRealReviews = async (storeId: string) => {
    const { data } = await supabase
      .from('reviews')
      .select('*, buyer:profiles!reviews_buyer_id_fkey(full_name, avatar_url)')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false })

    if (data) {
      setReviews(
        data.map((r) => {
          const buyer = r.buyer as { full_name: string | null; avatar_url: string | null }
          return {
            id: r.id,
            rating: r.rating,
            comment: r.comment,
            buyerName: buyer?.full_name ?? 'Comprador',
            buyerAvatar: buyer?.avatar_url ?? null,
            date: formatDate(r.created_at),
          }
        })
      )
    }
  }

  const loadAuthState = async (storeId: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setUserId(user.id)

    // Check if buyer has chatted
    const { data: conv } = await supabase
      .from('conversations')
      .select('id')
      .eq('buyer_id', user.id)
      .eq('store_id', storeId)
      .limit(1)
      .maybeSingle()

    if (conv) setCanReview(true)

    // Check if buyer already has a review
    const { data: existing } = await supabase
      .from('reviews')
      .select('*, buyer:profiles!reviews_buyer_id_fkey(full_name, avatar_url)')
      .eq('store_id', storeId)
      .eq('buyer_id', user.id)
      .maybeSingle()

    if (existing) {
      const buyer = existing.buyer as { full_name: string | null; avatar_url: string | null }
      setExistingReview({
        id: existing.id,
        rating: existing.rating,
        comment: existing.comment,
        buyerName: buyer?.full_name ?? 'Comprador',
        buyerAvatar: buyer?.avatar_url ?? null,
        date: formatDate(existing.created_at),
      })
      setRating(existing.rating)
      setComment(existing.comment ?? '')
    }
  }

  // ── Contact ──
  const handleContact = async () => {
    if (contacting || !store) return
    setContacting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push(`/login?redirectTo=/tiendas/${id}`); return }

      let realStoreId: string | null = store.supabaseId

      if (!realStoreId) {
        const { data: stores } = await supabase
          .from('stores').select('id')
          .ilike('name', store.name).eq('status', 'active').limit(1)
        realStoreId = stores?.[0]?.id ?? null
      }

      if (!realStoreId) { router.push('/chats'); return }

      const { data: existing } = await supabase
        .from('conversations').select('id')
        .eq('buyer_id', user.id).eq('store_id', realStoreId).maybeSingle()

      if (existing) { router.push(`/chats?conv=${existing.id}`); return }

      const { data: conv } = await supabase
        .from('conversations').insert({ buyer_id: user.id, store_id: realStoreId })
        .select('id').single()

      if (conv) router.push(`/chats?conv=${conv.id}`)
      else router.push('/chats')
    } finally {
      setContacting(false)
    }
  }

  // ── Submit review ──
  const handleSubmitReview = async () => {
    if (!rating || !store?.supabaseId || !userId) return
    setSubmitting(true)
    setReviewError(null)

    try {
      if (existingReview) {
        const { error } = await supabase
          .from('reviews')
          .update({ rating, comment: comment.trim() || null })
          .eq('id', existingReview.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('reviews')
          .insert({ store_id: store.supabaseId, buyer_id: userId, rating, comment: comment.trim() || null })

        if (error) throw error
      }

      await Promise.all([
        loadRealReviews(store.supabaseId),
        (async () => {
          const { data } = await supabase
            .from('stores').select('rating_avg, review_count').eq('id', store.supabaseId!).single()
          if (data) setStore((prev) => prev ? {
            ...prev,
            ratingAvg: Number(data.rating_avg),
            reviewCount: data.review_count,
          } : prev)
        })(),
        loadAuthState(store.supabaseId),
      ])
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setReviewError('No se pudo guardar la reseña. Intenta de nuevo.')
      console.error('Review error:', msg)
    } finally {
      setSubmitting(false)
    }
  }

  // ─── Loading ──────────────────────────────────────────────────

  if (loading) {
    return (
      <main className="flex-1">
        <Skeleton className="h-48 md:h-64 w-full" />
        <div className="container mx-auto px-4 mt-4 space-y-4">
          <Skeleton className="h-24 w-24 rounded-xl" />
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </main>
    )
  }

  if (notFound || !store) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Tienda no encontrada</h1>
          <p className="mt-2 text-muted-foreground">La tienda que buscas no existe o fue eliminada.</p>
          <Link href="/"><Button className="mt-4">Volver al inicio</Button></Link>
        </div>
      </main>
    )
  }

  const productCount = store.source === 'real' ? realProducts.length : mockProducts.length

  // ─── Render ───────────────────────────────────────────────────

  return (
    <>
      <main className="flex-1">

        {/* Banner */}
        <div className="relative h-48 md:h-64 lg:h-80 bg-muted">
          {store.banner ? (
            <Image src={store.banner} alt={store.name} fill className="object-cover" priority />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="container mx-auto px-4">

          {/* Store header */}
          <div className="relative -mt-16 md:-mt-20 mb-8">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-xl border-4 border-card overflow-hidden bg-card shadow-lg flex-shrink-0">
                {store.logo ? (
                  <Image src={store.logo} alt={store.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10 text-3xl font-bold text-primary">
                    {store.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 md:pb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-serif text-2xl md:text-3xl font-bold">{store.name}</h1>
                  {store.verified && (
                    <Badge className="gap-1">
                      <BadgeCheck className="h-3 w-3" />
                      Verificada
                    </Badge>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {store.reviewCount > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-foreground">{store.ratingAvg.toFixed(1)}</span>
                      <span>({store.reviewCount} reseñas)</span>
                    </span>
                  )}
                  {(store.province ?? store.address) && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {store.province ?? store.address}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button className="gap-2" onClick={handleContact} disabled={contacting}>
                  <MessageCircle className="h-4 w-4" />
                  {contacting ? 'Abriendo...' : 'Contactar'}
                </Button>
                <Button variant="outline" size="icon" aria-label="Compartir">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="productos" className="pb-16">
            <TabsList className="w-full md:w-auto grid grid-cols-3 md:inline-flex">
              <TabsTrigger value="productos">Productos ({productCount})</TabsTrigger>
              <TabsTrigger value="info">Información</TabsTrigger>
              <TabsTrigger value="resenas">Reseñas ({store.reviewCount})</TabsTrigger>
            </TabsList>

            {/* Products tab */}
            <TabsContent value="productos" className="mt-6">
              {store.source === 'mock' && mockProducts.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {mockProducts.map((p) => <ProductCard key={p.id} product={p} showStore={false} />)}
                </div>
              )}

              {store.source === 'real' && realProducts.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {realProducts.map((p) => (
                    <Link key={p.id} href={`/productos/${p.id}`}>
                      <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                          {p.coverUrl ? (
                            <Image src={p.coverUrl} alt={p.title ?? 'Producto'} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                          <div className="absolute bottom-2 left-2 flex gap-1">
                            <Badge variant="secondary" className="text-xs">{p.size}</Badge>
                            <Badge variant="secondary" className="text-xs">{p.condition}</Badge>
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <h3 className="font-medium text-sm line-clamp-2">{p.title ?? 'Sin título'}</h3>
                          <p className="mt-1 font-semibold text-primary">{formatPrice(p.price)}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}

              {productCount === 0 && (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Esta tienda aún no tiene productos publicados.</p>
                </div>
              )}
            </TabsContent>

            {/* Info tab */}
            <TabsContent value="info" className="mt-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {store.description && (
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-3">Sobre la tienda</h3>
                        <p className="text-muted-foreground">{store.description}</p>
                      </CardContent>
                    </Card>
                  )}
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-semibold">Contacto</h3>
                      <div className="space-y-3 text-sm">
                        {store.address && (
                          <div className="flex items-center gap-3">
                            <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            <span>{store.address}{store.province ? `, ${store.province}` : ''}</span>
                          </div>
                        )}
                        {store.hours && (
                          <div className="flex items-center gap-3">
                            <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            <span>{store.hours}</span>
                          </div>
                        )}
                        {store.phone && (
                          <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            <span>{store.phone}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {(store.instagram || store.facebook) && (
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-4">Redes sociales</h3>
                        <div className="flex gap-4">
                          {store.instagram && (
                            <a href={`https://instagram.com/${store.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                              <Instagram className="h-5 w-5" />
                              {store.instagram}
                            </a>
                          )}
                          {store.facebook && (
                            <a href={`https://facebook.com/${store.facebook}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                              <Facebook className="h-5 w-5" />
                              {store.facebook}
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Map placeholder */}
                <Card className="h-[300px]">
                  <CardContent className="p-0 h-full">
                    <div className="h-full bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center p-6">
                        <MapPin className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">{store.address ?? 'Ubicación no disponible'}</p>
                        {store.address && (
                          <a href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="mt-3 gap-2" size="sm">
                              <Navigation className="h-4 w-4" />
                              Abrir en Google Maps
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Reviews tab */}
            <TabsContent value="resenas" className="mt-6">
              <div className="max-w-2xl space-y-6">

                {/* Rating summary */}
                {store.reviewCount > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-4xl font-bold">{store.ratingAvg.toFixed(1)}</p>
                          <div className="flex items-center gap-0.5 mt-1 justify-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < Math.round(store.ratingAvg) ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted'}`} />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{store.reviewCount} reseñas</p>
                        </div>
                        <div className="flex-1 space-y-2">
                          {[5, 4, 3, 2, 1].map((star) => {
                            const count = reviews.filter((r) => r.rating === star).length
                            const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                            return (
                              <div key={star} className="flex items-center gap-2">
                                <span className="text-sm w-3">{star}</span>
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                                </div>
                                <span className="text-xs text-muted-foreground w-6 text-right">{count}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Review form — only for real stores + eligible buyers */}
                {store.source === 'real' && canReview && (
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-semibold">
                        {existingReview ? 'Tu reseña' : 'Deja tu reseña'}
                      </h3>
                      <StarRatingInput value={rating} onChange={setRating} />
                      <Textarea
                        placeholder="Cuéntanos tu experiencia (opcional)..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        maxLength={1000}
                        rows={3}
                      />
                      {reviewError && <p className="text-sm text-destructive">{reviewError}</p>}
                      <Button
                        onClick={handleSubmitReview}
                        disabled={!rating || submitting}
                        className="w-full"
                      >
                        {submitting ? 'Guardando...' : existingReview ? 'Actualizar reseña' : 'Publicar reseña'}
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {store.source === 'real' && !canReview && userId && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    Solo puedes reseñar tiendas con las que hayas chateado.{' '}
                    <button onClick={handleContact} className="text-primary underline">
                      Contáctalos
                    </button>
                  </p>
                )}

                {/* Reviews list */}
                {reviews.length > 0 ? (
                  <div className="divide-y">
                    {reviews.map((r) => (
                      <ReviewItem
                        key={r.id}
                        rating={r.rating}
                        comment={r.comment}
                        buyerName={r.buyerName}
                        buyerAvatar={r.buyerAvatar}
                        date={r.date}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Star className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">Esta tienda aún no tiene reseñas.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Mobile sticky CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-card border-t">
        <Button className="w-full gap-2" onClick={handleContact} disabled={contacting}>
          <MessageCircle className="h-5 w-5" />
          {contacting ? 'Abriendo chat...' : 'Contactar vendedor'}
        </Button>
      </div>
    </>
  )
}

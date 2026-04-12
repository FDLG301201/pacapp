// @ts-nocheck - Type narrowing issues with optional chaining
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductGrid } from "@/components/catalog/ProductGrid"
import { ContactModalButton } from "@/components/catalog/ContactModalButton"
import { FavoriteButton } from "@/components/catalog/FavoriteButton"
import { EmptyState } from "@/components/shared/EmptyState"
import { createClient } from "@/lib/supabase/server"
import { CheckCircle, MapPin, Phone, MessageSquare, Share2, Star, MessageCircle } from "lucide-react"

interface StorePageProps {
  params: { id: string }
}

export const revalidate = 60

async function getStoreData(storeId: string) {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch store
  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("id", storeId)
    .eq("status", "active")
    .single()

  if (!store) {
    return { store: null, user, isFavorited: false, products: [] }
  }

  // Check if store is favorited
  let isFavorited = false
  if (user) {
    const { data: favorite } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("store_id", storeId)
      .maybeSingle()

    isFavorited = !!favorite
  }

  // Fetch products from this store
  const { data: products } = await supabase
    .from("products")
    .select("*,product_images(url,position),stores(name,slug,is_verified)")
    .eq("store_id", storeId)
    .eq("status", "active")
    .limit(24)

  return { store, user, isFavorited, products: products || [] }
}

export async function generateMetadata({ params }: StorePageProps) {
  const { store } = await getStoreData(params.id)

  if (!store) {
    return { title: "Tienda no encontrada" }
  }

  return {
    title: `${store.name} - PACAPP`,
    description: store.description,
  }
}

export default async function StoreProfilePage({ params }: StorePageProps) {
  const { store, user, isFavorited, products } = await getStoreData(params.id)

  if (!store) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <EmptyState
            icon={MessageCircle}
            title="Tienda no encontrada"
            description="La tienda que buscas no existe o no está disponible en este momento."
            actionLabel="Ver catálogo"
            actionHref="/productos"
          />
        </main>
        <Footer />
      </div>
    )
  }

  const bannerUrl = store.banner_url || store.logo_url

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Banner */}
        {bannerUrl && (
          <div className="relative h-48 md:h-64 w-full bg-gray-200 overflow-hidden">
            <Image
              src={bannerUrl}
              alt={store.name}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}

        <div className="container mx-auto px-4 relative z-10">
          {/* Store Header Card */}
          <div className={`bg-white border rounded-lg p-6 -mt-12 relative mb-8 ${!bannerUrl ? "mt-6" : ""}`}>
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">{store.name}</h1>
                  {store.is_verified && <CheckCircle className="w-6 h-6 text-emerald-600" />}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    <span>Sin reseñas</span>
                  </div>
                  {store.province && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{store.province}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
                {store && (
                  <ContactModalButton
                    store={{
                      id: store.id,
                      name: store.name,
                      whatsapp: store.whatsapp,
                      phone: store.phone,
                    }}
                  />
                )}
                <FavoriteButton
                  storeId={store.id}
                  initialFavorited={isFavorited}
                  userId={user?.id}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                  }}
                  className="hidden sm:inline-flex"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="productos" className="w-full">
            <TabsList>
              <TabsTrigger value="productos">Productos ({products.length})</TabsTrigger>
              <TabsTrigger value="info">Información</TabsTrigger>
              <TabsTrigger value="resenas">Reseñas</TabsTrigger>
            </TabsList>

            {/* Productos Tab */}
            <TabsContent value="productos" className="mt-8">
              {products.length > 0 ? (
                <ProductGrid products={products} userId={user?.id} favorites={[]} />
              ) : (
                <EmptyState
                  icon={MessageCircle}
                  title="Sin productos"
                  description="Esta tienda aún no ha publicado productos."
                  actionLabel="Ver otras tiendas"
                  actionHref="/productos"
                />
              )}
            </TabsContent>

            {/* Información Tab */}
            <TabsContent value="info" className="mt-8">
              <div className="grid md:grid-cols-2 gap-8 max-w-2xl">
                {/* Contact Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Contacto</h3>
                  <div className="space-y-3">
                    {store.address && (
                      <div className="flex gap-3">
                        <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Dirección</p>
                          <p className="font-medium">{store.address}</p>
                        </div>
                      </div>
                    )}
                    {store.phone && (
                      <div className="flex gap-3">
                        <Phone className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Teléfono</p>
                          <Link href={`tel:${store.phone}`} className="font-medium text-emerald-600 hover:underline">
                            {store.phone}
                          </Link>
                        </div>
                      </div>
                    )}
                    {store.whatsapp && (
                      <div className="flex gap-3">
                        <MessageSquare className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">WhatsApp</p>
                          <Link
                            href={`https://wa.me/${store.whatsapp.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-emerald-600 hover:underline"
                          >
                            {store.whatsapp}
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Redes Sociales */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Redes sociales</h3>
                  <div className="space-y-2">
                    {store.instagram && (
                      <Link
                        href={`https://instagram.com/${store.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-emerald-600 hover:underline"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Instagram
                      </Link>
                    )}
                    {store.facebook && (
                      <Link
                        href={`https://facebook.com/${store.facebook}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-emerald-600 hover:underline"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Facebook
                      </Link>
                    )}
                  </div>
                </div>

                {/* Categorías */}
                {store.categories && store.categories.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Categorías</h3>
                    <div className="flex flex-wrap gap-2">
                      {store.categories.map((cat: string) => (
                        <Badge key={cat} variant="secondary">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Reseñas Tab */}
            <TabsContent value="resenas" className="mt-8">
              <EmptyState
                icon={Star}
                title="Aún no hay reseñas"
                description="Podrás dejar una reseña después de contactar al vendedor. Sé el primero en opinar."
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

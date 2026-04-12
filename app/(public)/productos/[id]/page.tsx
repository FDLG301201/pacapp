// @ts-nocheck - Type narrowing issues with optional chaining
import { notFound } from "next/navigation"
import Link from "next/link"
import { cookies } from "next/headers"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { ProductGallery } from "@/components/catalog/ProductGallery"
import { FavoriteButton } from "@/components/catalog/FavoriteButton"
import { ProductGrid } from "@/components/catalog/ProductGrid"
import { StoreCard } from "@/components/catalog/StoreCard"
import { ContactModalButton } from "@/components/catalog/ContactModalButton"
import { createClient } from "@/lib/supabase/server"
import { PRODUCT_CATEGORY_LABELS, PRODUCT_CONDITION_LABELS, PRODUCT_GENDER_LABELS, getSizeLabel } from "@/lib/validations/product"
import { CheckCircle, MapPin, Package } from "lucide-react"

interface ProductDetailPageProps {
  params: { id: string }
}

export const revalidate = 60

async function getProductData(productId: string) {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch product with images and store
  const { data: product } = await supabase
    .from("products")
    .select("*,product_images(url,position),stores(*)")
    .eq("id", productId)
    .eq("status", "active")
    .single()

  if (!product) {
    return { product: null, user, isFavorited: false, relatedProducts: [] }
  }

  // Check if product is favorited
  let isFavorited = false
  if (user) {
    const { data: favorite } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .maybeSingle()

    isFavorited = !!favorite
  }

  // Fetch related products from the same store (4 products excluding this one)
  const { data: relatedProducts } = await supabase
    .from("products")
    .select("*,product_images(url,position),stores(name,slug,is_verified)")
    .eq("store_id", product.store_id)
    .eq("status", "active")
    .neq("id", productId)
    .limit(4)

  return { product, user, isFavorited, relatedProducts: relatedProducts || [] }
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { product } = await getProductData(params.id)

  if (!product) {
    return { title: "Producto no encontrado" }
  }

  return {
    title: `${product.title || "Producto"} - PACAPP`,
    description: product.description,
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { product, user, isFavorited, relatedProducts } = await getProductData(params.id)

  if (!product) {
    notFound()
  }

  const store = product.stores
  const categoryLabel = PRODUCT_CATEGORY_LABELS[product.category]

  // Increment view count with cookie throttling
  const cookieStore = await cookies()
  const viewCookieName = `pacapp_viewed_${product.id}`
  const hasViewedBefore = cookieStore.has(viewCookieName)

  if (!hasViewedBefore && user) {
    // Call the RPC to increment views
    const supabase = await createClient()
    await supabase.rpc("increment_product_views", { p_product_id: product.id })
    // Set cookie for 24 hours
    cookieStore.set(viewCookieName, "true", { maxAge: 86400, httpOnly: true })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-8">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Inicio</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/productos?category=${product.category}`}>
                  {categoryLabel}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>{product.title || "Producto"}</BreadcrumbItem>
          </Breadcrumb>

          <div className="grid lg:grid-cols-[1fr_400px] gap-12">
            {/* Left Column: Gallery & Details */}
            <div className="space-y-8">
              {/* Gallery */}
              <ProductGallery images={product.product_images} title={product.title || "Producto"} />

              {/* Tabs */}
              <Tabs defaultValue="description" className="w-full">
                <TabsList>
                  <TabsTrigger value="description">Descripción</TabsTrigger>
                  <TabsTrigger value="details">Detalles</TabsTrigger>
                  <TabsTrigger value="store">Sobre la tienda</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="space-y-4 mt-6">
                  <div className="prose prose-sm max-w-none">
                    {product.description ? (
                      <p className="whitespace-pre-wrap">{product.description}</p>
                    ) : (
                      <p className="text-gray-500 italic">El vendedor no agregó descripción</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="details" className="mt-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {product.brand && (
                        <div>
                          <p className="text-sm text-gray-600">Marca</p>
                          <p className="font-medium">{product.brand}</p>
                        </div>
                      )}
                      {product.color && (
                        <div>
                          <p className="text-sm text-gray-600">Color</p>
                          <p className="font-medium">{product.color}</p>
                        </div>
                      )}
                      {product.material && (
                        <div>
                          <p className="text-sm text-gray-600">Material</p>
                          <p className="font-medium">{product.material}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-600">Talla</p>
                        <p className="font-medium">{getSizeLabel(product.size)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Condición</p>
                        <p className="font-medium">{PRODUCT_CONDITION_LABELS[product.condition]}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Género</p>
                        <p className="font-medium">{PRODUCT_GENDER_LABELS[product.gender]}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="store" className="mt-6 space-y-4">
                  {store ? (
                    <>
                      <div>
                        <h4 className="font-semibold mb-2">{store.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                          {store.is_verified && (
                            <>
                              <CheckCircle className="w-4 h-4 text-emerald-600" />
                              <span>Tienda verificada</span>
                            </>
                          )}
                        </div>
                        {store.province && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{store.province}</span>
                          </div>
                        )}
                      </div>
                      {store.address && (
                        <div>
                          <p className="text-sm text-gray-600">Dirección</p>
                          <p className="font-medium text-sm">{store.address}</p>
                        </div>
                      )}
                      {store.categories && store.categories.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Categorías</p>
                          <div className="flex flex-wrap gap-2">
                            {store.categories.map((cat: string) => (
                              <Badge key={cat} variant="secondary">
                                {cat}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : null}
                </TabsContent>
              </Tabs>

              {/* Related Products */}
              {relatedProducts.length > 0 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Más de {store?.name}</h3>
                    <p className="text-gray-600">Otros productos del vendedor</p>
                  </div>
                  <ProductGrid products={relatedProducts} userId={user?.id} favorites={[]} />
                </div>
              )}

              {/* Trust Badges */}
              <div className="border-t pt-8">
                <div className="space-y-3">
                  {store?.is_verified && (
                    <div className="flex items-center gap-2 text-sm text-emerald-700">
                      <CheckCircle className="w-4 h-4" />
                      <span>Tienda verificada</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Package className="w-4 h-4" />
                    <span>Coordina directo con el vendedor</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Package className="w-4 h-4" />
                    <span>Sin comisiones para compradores</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Product Info & CTAs */}
            <div className="space-y-6 h-fit sticky top-20">
              {/* Info Card */}
              <div className="bg-white border rounded-lg p-6 space-y-6">
                {/* Title & Price */}
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold">{product.title || "Producto"}</h1>
                  <div className="text-3xl font-bold text-emerald-600">
                    RD${product.price.toLocaleString("es-DO")}
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge>{getSizeLabel(product.size)}</Badge>
                  <Badge variant="secondary">{PRODUCT_CONDITION_LABELS[product.condition]}</Badge>
                  <Badge variant="secondary">{PRODUCT_GENDER_LABELS[product.gender]}</Badge>
                </div>

                {/* Favorite & Contact Buttons */}
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <FavoriteButton
                      productId={product.id}
                      initialFavorited={isFavorited}
                      userId={user?.id}
                    />
                    {store && (
                      <ContactModalButton
                        store={{
                          id: store.id,
                          name: store.name,
                          whatsapp: store.whatsapp,
                          phone: store.phone,
                        }}
                        className="flex-1"
                      />
                    )}
                  </div>
                  {store && (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full"
                    >
                      <Link href={`/tiendas/${store.id}`}>
                        Ver tienda completa
                      </Link>
                    </Button>
                  )}
                </div>

                {/* Store Card (Mobile) */}
                {store && (
                  <div className="border-t pt-6 lg:hidden">
                    <StoreCard store={store} userId={user?.id} />
                  </div>
                )}
              </div>

              {/* Store Card (Desktop) */}
              {store && (
                <div className="hidden lg:block">
                  <StoreCard store={store} userId={user?.id} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

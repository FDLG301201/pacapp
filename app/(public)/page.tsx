import Link from "next/link"
import { ArrowRight, Store, MessageCircle, Package, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSearch } from "@/components/shared/HeroSearch"
import { StoreCard } from "@/components/catalog/StoreCard"
import { ProductCard } from "@/components/catalog/ProductCard"
import { CategoryChip } from "@/components/catalog/CategoryChip"
import { createClient } from "@/lib/supabase/server"
import { PRODUCT_CATEGORY_LABELS, PRODUCT_CATEGORIES } from "@/lib/validations/product"
import { PROVINCES_RD } from "@/lib/constants/provinces"

export const revalidate = 60 // ISR: revalidate every 60 seconds

export default async function HomePage() {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if user has any favorites
  let userFavorites: string[] = []
  if (user) {
    const { data: favorites } = await supabase
      .from("favorites")
      .select("product_id")
      .eq("user_id", user.id)
      .not("product_id", "is", null)

    userFavorites = favorites?.map((f) => f.product_id).filter(Boolean) as string[]
  }

  // Fetch data in parallel
  const [verifiedStoresRes, recentProductsRes, provincesRes] = await Promise.all([
    // Verified stores (6 random)
    supabase
      .from("stores")
      .select("*")
      .eq("status", "active")
      .eq("is_verified", true)
      .limit(6),

    // Recent products (12 most recent)
    supabase
      .from("products")
      .select("*,product_images(url,position),stores(name,is_verified,slug)")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(12),

    // Get all stores to find provinces with stores
    supabase
      .from("stores")
      .select("province")
      .eq("status", "active"),
  ])

  const verifiedStores = verifiedStoresRes.data || []
  const recentProducts = recentProductsRes.data || []

  // Get unique provinces that have stores
  const provincesWithStores = [
    ...new Set(
      (provincesRes.data || [])
        .map((s) => s.province)
        .filter(Boolean)
    ),
  ] as string[]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-emerald-50/50 to-background py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900">
                Pacas de toda RD en un solo lugar
              </h1>
              <p className="text-lg text-gray-600 max-w-xl mx-auto">
                Encuentra prendas únicas, apoya negocios locales
              </p>

              {/* Search Bar */}
              <div className="mt-8 max-w-xl mx-auto">
                <HeroSearch />
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  <Link href="/productos" className="gap-2">
                    Explorar catálogo
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="gap-2">
                  <Link href="/registro?role=seller">
                    <Store className="h-4 w-4" />
                    Soy vendedor
                  </Link>
                </Button>
              </div>

              <p className="text-xs text-gray-500 pt-2">
                Sin comisiones para compradores · Compra directo del local
              </p>
            </div>
          </div>
        </section>

        {/* Category Chips */}
        <section className="py-6 border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {PRODUCT_CATEGORIES.map((category) => (
                <CategoryChip
                  key={category}
                  category={category}
                  label={PRODUCT_CATEGORY_LABELS[category]}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Verified Stores */}
        {verifiedStores.length > 0 && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Tiendas verificadas</h2>
                  <p className="text-gray-600 text-sm">Las mejores pacas en RD</p>
                </div>
                <Link href="/tiendas" className="hidden sm:block">
                  <Button variant="ghost" className="gap-2">
                    Ver todas
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {verifiedStores.map((store) => (
                  <StoreCard
                    key={store.id}
                    store={store}
                    userId={user?.id}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Recently Published Products */}
        {recentProducts.length > 0 && (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Recién publicado</h2>
                  <p className="text-gray-600 text-sm">Las últimas prendas disponibles</p>
                </div>
                <Link href="/productos" className="hidden sm:block">
                  <Button variant="ghost" className="gap-2">
                    Ver todo
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {recentProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isFavorited={userFavorites.includes(product.id)}
                    userId={user?.id}
                  />
                ))}
              </div>
              <Link href="/productos" className="sm:hidden mt-6 block">
                <Button variant="outline" className="w-full gap-2">
                  Ver más productos
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </section>
        )}

        {/* How It Works */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Cómo funciona</h2>
              <p className="mt-2 text-gray-600">Comprar en PACAPP es fácil y seguro</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center space-y-3">
                <div className="mx-auto h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Package className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-lg">1. Explora</h3>
                <p className="text-sm text-gray-600">
                  Busca entre miles de prendas de tiendas verificadas en todo el país.
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="mx-auto h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center">
                  <MessageCircle className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-lg">2. Conversa</h3>
                <p className="text-sm text-gray-600">
                  Contacta directamente al vendedor para preguntar detalles y coordinar.
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="mx-auto h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Store className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-lg">3. Recoge tu prenda</h3>
                <p className="text-sm text-gray-600">
                  Visita la tienda, revisa la prenda en persona y llévala a casa.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Explore by Province */}
        {provincesWithStores.length > 0 && (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="mb-8">
                <h2 className="text-2xl font-bold">Explora por provincia</h2>
                <p className="text-gray-600 text-sm">Encuentra tiendas en tu zona</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {provincesWithStores
                  .sort()
                  .slice(0, 12)
                  .map((province) => (
                    <Button
                      key={province}
                      asChild
                      variant="outline"
                      className="gap-1"
                    >
                      <Link href={`/productos?province=${encodeURIComponent(province)}`}>
                        <MapPin className="w-4 h-4" />
                        {province}
                      </Link>
                    </Button>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* Seller CTA */}
        <section className="py-16 bg-emerald-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Únete como vendedor
              </h2>
              <p className="text-emerald-50 text-lg">
                Publica tu primera prenda en menos de 1 minuto. Cero comisiones, solo ganancias.
              </p>
              <Button asChild size="lg" variant="secondary">
                <Link href="/registro?role=seller" className="gap-2">
                  Empezar ahora
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

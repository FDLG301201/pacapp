import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductGrid } from "@/components/catalog/ProductGrid"
import { StoreCard } from "@/components/catalog/StoreCard"
import { EmptyState } from "@/components/shared/EmptyState"
import { createClient } from "@/lib/supabase/server"
import { ShoppingBag, Store, ArrowRight } from "lucide-react"

async function getFavorites() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { productFavorites: [], storeFavorites: [], user: null }
  }

  // Fetch product favorites
  const { data: productFavs } = await supabase
    .from("favorites")
    .select("id,product_id,products(*,product_images(url,position),stores(name,slug,is_verified))")
    .eq("user_id", user.id)
    .not("product_id", "is", null)

  // Fetch store favorites
  const { data: storeFavs } = await supabase
    .from("favorites")
    .select("id,store_id,stores(*)")
    .eq("user_id", user.id)
    .not("store_id", "is", null)

  const productFavorites = productFavs
    ?.map((fav: any) => fav.products)
    .filter(Boolean) || []

  const storeFavorites = storeFavs
    ?.map((fav: any) => fav.stores)
    .filter(Boolean) || []

  return { productFavorites, storeFavorites, user }
}

export const metadata = {
  title: "Mis Favoritos - PACAPP",
  description: "Mis productos y tiendas guardadas",
}

export default async function FavoritesPage() {
  const { productFavorites, storeFavorites, user } = await getFavorites()

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <EmptyState
            icon={ShoppingBag}
            title="Inicia sesión para ver tus favoritos"
            description="Guarda tus productos y tiendas favoritas para encontrarlos fácilmente más tarde."
            actionLabel="Iniciar sesión"
            actionHref="/login?redirectTo=/favoritos"
          />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Mis Favoritos</h1>
            <p className="text-gray-600 mt-2">Productos y tiendas que guardaste</p>
          </div>

          <Tabs defaultValue="productos" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="productos" className="gap-2">
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Productos Guardados</span>
                <span className="sm:hidden">Productos</span>
                {productFavorites.length > 0 && (
                  <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                    {productFavorites.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="tiendas" className="gap-2">
                <Store className="w-4 h-4" />
                <span className="hidden sm:inline">Tiendas Guardadas</span>
                <span className="sm:hidden">Tiendas</span>
                {storeFavorites.length > 0 && (
                  <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                    {storeFavorites.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Productos Tab */}
            <TabsContent value="productos" className="mt-8">
              {productFavorites.length > 0 ? (
                <ProductGrid
                  products={productFavorites}
                  userId={user.id}
                  favorites={productFavorites.map((p: any) => p.id)}
                />
              ) : (
                <EmptyState
                  icon={ShoppingBag}
                  title="Sin productos guardados"
                  description="Aún no has guardado ningún producto. Explora nuestro catálogo y guarda tus favoritos."
                  actionLabel="Explorar catálogo"
                  actionHref="/productos"
                />
              )}
            </TabsContent>

            {/* Tiendas Tab */}
            <TabsContent value="tiendas" className="mt-8">
              {storeFavorites.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {storeFavorites.map((store: any) => (
                    <StoreCard
                      key={store.id}
                      store={store}
                      isFavorited={true}
                      userId={user.id}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Store}
                  title="Sin tiendas guardadas"
                  description="Aún no has guardado ninguna tienda. Descubre tiendas verificadas en el catálogo."
                  actionLabel="Explorar tiendas"
                  actionHref="/productos"
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}

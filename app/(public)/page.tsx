import Link from 'next/link'
import { Search, ArrowRight, Store, MessageCircle, Package, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ProductCard } from '@/components/product-card'
import { StoreCard } from '@/components/store-card'
import { products, stores, categories } from '@/lib/mock-data'

export default function HomePage() {
  return (
    <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-secondary/50 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance">
                Pacas de toda RD en un solo lugar
              </h1>
              <p className="mt-4 text-lg text-muted-foreground text-pretty">
                Tu próxima prenda favorita está más cerca de lo que crees. Conectamos compradores 
                con tiendas de pacas verificadas en todo el país.
              </p>
              
              {/* Search Bar */}
              <div className="mt-8 relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  type="search"
                  placeholder="Busca blusas, jeans, zapatos..."
                  className="h-14 pl-12 pr-32 text-lg rounded-full border-2 border-primary/20 focus:border-primary"
                />
                <Button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full">
                  Buscar
                </Button>
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/#productos">
                  <Button size="lg" className="gap-2">
                    Explorar catálogo
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/registro?tipo=vendedor">
                  <Button size="lg" variant="outline" className="gap-2">
                    <Store className="h-4 w-4" />
                    Soy vendedor
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-6 border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.slice(0, 8).map((category) => (
                <Link key={category} href={`/?categoria=${category.toLowerCase()}`}>
                  <Badge 
                    variant="secondary" 
                    className="px-4 py-2 text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap"
                  >
                    {category}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Verified Stores */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-2xl font-bold">Tiendas verificadas cerca de ti</h2>
                <p className="text-muted-foreground">Encuentra las mejores pacas en tu zona</p>
              </div>
              <Link href="/mapa" className="hidden sm:block">
                <Button variant="ghost" className="gap-2">
                  Ver mapa
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {stores.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
            <Link href="/mapa" className="sm:hidden mt-4 block">
              <Button variant="outline" className="w-full gap-2">
                Ver todas las tiendas
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Recently Published Products */}
        <section id="productos" className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-2xl font-bold">Recién publicado</h2>
                <p className="text-muted-foreground">Las últimas prendas disponibles</p>
              </div>
              <Link href="/buscar" className="hidden sm:block">
                <Button variant="ghost" className="gap-2">
                  Ver todo
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <Link href="/buscar" className="sm:hidden mt-6 block">
              <Button variant="outline" className="w-full gap-2">
                Ver más productos
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl font-bold">Cómo funciona</h2>
              <p className="mt-2 text-muted-foreground">Comprar en PACAPP es fácil y seguro</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">1. Explora</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Busca entre miles de prendas de tiendas verificadas en todo el país.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MessageCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">2. Conversa</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Contacta directamente al vendedor para preguntar detalles y coordinar.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">3. Recoge tu prenda</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Visita la tienda, revisa la prenda en persona y llévala a casa.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Seller CTA */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-serif text-3xl md:text-4xl font-bold">
                ¿Tienes una tienda de pacas?
              </h2>
              <p className="mt-4 text-primary-foreground/80 text-lg">
                Únete a la comunidad de vendedores de PACAPP y llega a miles de compradores 
                en todo el país. Digitaliza tu negocio de manera fácil y gratuita.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/registro?tipo=vendedor">
                  <Button size="lg" variant="secondary" className="gap-2">
                    Registra tu tienda gratis
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/planes">
                  <Button size="lg" variant="ghost" className="text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/10">
                    Ver planes
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Sin costos de inicio</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Publica hasta 20 productos gratis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Chat directo con compradores</span>
                </div>
              </div>
            </div>
          </div>
        </section>
    </main>
  )
}

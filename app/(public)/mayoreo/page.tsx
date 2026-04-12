import Link from 'next/link'
import Image from 'next/image'
import { Package, Filter, ArrowRight, BadgeCheck, Shirt } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { fardos, formatPrice, getStore } from '@/lib/mock-data'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function MayoreoPage() {
  const fardoTypes = ['Ropa de Mujer', 'Ropa de Hombre', 'Ropa de Niños', 'Zapatos', 'Premium', 'Accesorios']
  const weightRanges = ['20-30 kg', '30-40 kg', '40-50 kg', '50+ kg']
  const priceRanges = ['RD$3,000 - RD$5,000', 'RD$5,000 - RD$10,000', 'RD$10,000 - RD$15,000', 'RD$15,000+']

  return (
    <div className="min-h-screen flex flex-col">
      {/* Custom Header for Mayoreo */}
      <header className="sticky top-0 z-50 w-full bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Shirt className="h-7 w-7" />
              <div>
                <span className="font-serif text-xl font-bold">PACAPP</span>
                <Badge variant="secondary" className="ml-2 bg-primary text-primary-foreground">
                  Mayoreo
                </Badge>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/" className="text-sm text-background/70 hover:text-background">
                Catálogo retail
              </Link>
              <Link href="/registro?tipo=vendedor">
                <Button variant="secondary" size="sm">
                  Vender fardos
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-foreground text-background py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <Badge className="mb-4 bg-primary">Para revendedores</Badge>
              <h1 className="font-serif text-4xl md:text-5xl font-bold">
                Compra fardos al por mayor directo de los importadores
              </h1>
              <p className="mt-4 text-lg text-background/70">
                Accede a fardos de ropa americana y europea de primera calidad. 
                Conecta directamente con importadores verificados en todo el país.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button size="lg" variant="secondary" className="gap-2">
                  <Package className="h-5 w-5" />
                  Ver fardos disponibles
                </Button>
                <Link href="/registro?tipo=vendedor">
                  <Button size="lg" variant="outline" className="text-background border-background/30 hover:bg-background/10">
                    Registrar como mayorista
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <aside className="lg:w-64 space-y-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filtros
                      </h3>
                      <Button variant="ghost" size="sm" className="text-xs">
                        Limpiar
                      </Button>
                    </div>

                    {/* Type Filter */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-3">Tipo de ropa</h4>
                        <div className="space-y-2">
                          {fardoTypes.map((type) => (
                            <div key={type} className="flex items-center space-x-2">
                              <Checkbox id={`type-${type}`} />
                              <Label htmlFor={`type-${type}`} className="text-sm font-normal">
                                {type}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Weight Filter */}
                      <div className="pt-4 border-t">
                        <h4 className="text-sm font-medium mb-3">Peso</h4>
                        <div className="space-y-2">
                          {weightRanges.map((range) => (
                            <div key={range} className="flex items-center space-x-2">
                              <Checkbox id={`weight-${range}`} />
                              <Label htmlFor={`weight-${range}`} className="text-sm font-normal">
                                {range}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Price Filter */}
                      <div className="pt-4 border-t">
                        <h4 className="text-sm font-medium mb-3">Precio</h4>
                        <div className="space-y-2">
                          {priceRanges.map((range) => (
                            <div key={range} className="flex items-center space-x-2">
                              <Checkbox id={`price-${range}`} />
                              <Label htmlFor={`price-${range}`} className="text-sm font-normal">
                                {range}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </aside>

              {/* Fardos Grid */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-muted-foreground">
                    {fardos.length} fardos disponibles
                  </p>
                  <Button variant="outline" size="sm" className="lg:hidden gap-2">
                    <Filter className="h-4 w-4" />
                    Filtros
                  </Button>
                </div>

                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {fardos.map((fardo) => {
                    const store = getStore(fardo.storeId)
                    return (
                      <Card key={fardo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative aspect-[4/3] bg-muted">
                          <Image
                            src={fardo.image}
                            alt={fardo.type}
                            fill
                            className="object-cover"
                          />
                          <Badge className="absolute top-3 left-3">
                            {fardo.weight}
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold">{fardo.type}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {fardo.contentType}
                              </p>
                            </div>
                            <p className="text-xl font-bold text-primary">
                              {formatPrice(fardo.price)}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                            {fardo.description}
                          </p>
                          {store && (
                            <div className="mt-4 pt-4 border-t flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="relative h-8 w-8 rounded-full overflow-hidden">
                                  <Image
                                    src={store.logo}
                                    alt={store.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-sm font-medium">{store.name}</span>
                                    {store.verified && (
                                      <BadgeCheck className="h-3 w-3 text-primary" />
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground">{store.location}</p>
                                </div>
                              </div>
                              <Button size="sm">Contactar</Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-serif text-3xl font-bold">
                ¿Eres importador de fardos?
              </h2>
              <p className="mt-4 text-muted-foreground">
                Únete a PACAPP Mayoreo y conecta con cientos de revendedores en todo el país. 
                Vende tus fardos más rápido y de forma directa.
              </p>
              <Link href="/registro?tipo=vendedor&mayoreo=true">
                <Button size="lg" className="mt-6 gap-2">
                  Registrar como mayorista
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

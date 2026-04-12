import Link from 'next/link'
import Image from 'next/image'
import { Package, Eye, MessageCircle, CreditCard, Plus, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SellerLayout } from '@/components/seller-layout'
import { MetricCard } from '@/components/metric-card'
import { ProductCard } from '@/components/product-card'
import { products, conversations, formatPrice } from '@/lib/mock-data'

export default function SellerDashboardPage() {
  const storeProducts = products.filter(p => p.storeId === '1').slice(0, 4)
  const recentChats = conversations.slice(0, 3)

  return (
    <SellerLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold">
            Hola, Pacas La Bendición
          </h1>
          <p className="text-muted-foreground mt-1">
            Aquí tienes un resumen de tu tienda
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Productos activos"
            value={234}
            icon={Package}
            trend={{ value: 12, positive: true }}
          />
          <MetricCard
            title="Vistas del mes"
            value="1,847"
            icon={Eye}
            trend={{ value: 8, positive: true }}
          />
          <MetricCard
            title="Chats nuevos"
            value={12}
            icon={MessageCircle}
            trend={{ value: 5, positive: true }}
          />
          <MetricCard
            title="Plan actual"
            value="Básico"
            icon={CreditCard}
            subtitle="RD$500/mes"
          />
        </div>

        {/* Products Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Tus productos</CardTitle>
            <div className="flex gap-2">
              <Link href="/seller/productos/nuevo">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Agregar producto</span>
                </Button>
              </Link>
              <Link href="/seller/productos">
                <Button variant="ghost" className="gap-2">
                  Ver todos
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {storeProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {storeProducts.map((product) => (
                  <ProductCard key={product.id} product={product} showStore={false} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Aún no tienes productos publicados
                </p>
                <Link href="/seller/productos/nuevo">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Agregar tu primer producto
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Conversations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Conversaciones recientes</CardTitle>
            <Link href="/seller/chats">
              <Button variant="ghost" className="gap-2">
                Ver todas
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentChats.map((chat) => (
                <Link key={chat.id} href="/seller/chats">
                  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={chat.storeAvatar} alt="Comprador" />
                      <AvatarFallback>C</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">Comprador</span>
                        <span className="text-xs text-muted-foreground">{chat.lastMessageTime}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative h-8 w-8 rounded overflow-hidden">
                        <Image
                          src={chat.productImage}
                          alt={chat.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {chat.unreadCount > 0 && (
                        <Badge>{chat.unreadCount}</Badge>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/seller/productos/nuevo">
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Agregar producto</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Publica una nueva prenda en tu tienda
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/seller/tienda">
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Ver mi tienda</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Así te ven tus compradores
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/seller/suscripcion">
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Mejorar plan</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Desbloquea más funciones para tu tienda
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </SellerLayout>
  )
}

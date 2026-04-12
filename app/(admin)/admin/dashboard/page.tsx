import Link from 'next/link'
import { Users, Store, Package, DollarSign, ArrowRight, Check, X, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AdminLayout } from '@/components/admin-layout'
import { MetricCard } from '@/components/metric-card'
import { formatPrice } from '@/lib/mock-data'

const pendingPayments = [
  { id: '1', store: 'Pacas El Cibao', plan: 'Pro', amount: 1500, date: '7 abril 2026', method: 'Transferencia' },
  { id: '2', store: 'Ropa Bonita RD', plan: 'Básico', amount: 500, date: '6 abril 2026', method: 'Tarjeta' },
  { id: '3', store: 'El Rincón de Mami', plan: 'Básico', amount: 500, date: '5 abril 2026', method: 'Transferencia' },
  { id: '4', store: 'Nueva Tienda RD', plan: 'Básico', amount: 500, date: '5 abril 2026', method: 'Tarjeta' },
  { id: '5', store: 'Pacas Del Sur', plan: 'Pro', amount: 1500, date: '4 abril 2026', method: 'Transferencia' },
]

const topStores = [
  { name: 'Pacas La Bendición', products: 234, views: 12500, chats: 156 },
  { name: 'Pacas Don Juan', products: 312, views: 10800, chats: 134 },
  { name: 'El Rincón de Mami', products: 187, views: 8900, chats: 98 },
  { name: 'Boutique Segunda Vida', products: 98, views: 7600, chats: 87 },
  { name: 'Pacas El Cibao', products: 278, views: 6500, chats: 76 },
]

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Resumen general de PACAPP
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Usuarios totales"
            value="3,847"
            icon={Users}
            trend={{ value: 12, positive: true }}
          />
          <MetricCard
            title="Tiendas activas"
            value="156"
            icon={Store}
            trend={{ value: 8, positive: true }}
          />
          <MetricCard
            title="Productos publicados"
            value="8,432"
            icon={Package}
            trend={{ value: 15, positive: true }}
          />
          <MetricCard
            title="Ingresos del mes"
            value="RD$45,500"
            icon={DollarSign}
            trend={{ value: 22, positive: true }}
          />
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Chats per day chart */}
          <Card>
            <CardHeader>
              <CardTitle>Chats por día</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-end gap-2">
                {[65, 45, 78, 52, 88, 70, 95].map((value, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-primary/80 rounded-t"
                      style={{ height: `${value * 1.5}px` }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {['L', 'M', 'X', 'J', 'V', 'S', 'D'][index]}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top stores chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Tiendas más activas</CardTitle>
              <Link href="/admin/tiendas">
                <Button variant="ghost" size="sm">
                  Ver todas
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topStores.slice(0, 5).map((store, index) => (
                  <div key={store.name} className="flex items-center gap-4">
                    <span className="text-sm font-medium w-6">{index + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{store.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {store.products} productos · {store.views.toLocaleString()} vistas
                      </p>
                    </div>
                    <div 
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${(store.views / 12500) * 100}px` }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Payments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pagos pendientes de aprobación</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {pendingPayments.length} pagos requieren verificación
              </p>
            </div>
            <Link href="/admin/pagos">
              <Button variant="outline" className="gap-2">
                Ver todos
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tienda</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.store}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{payment.plan}</Badge>
                    </TableCell>
                    <TableCell>{formatPrice(payment.amount)}</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tiendas verificadas</p>
                  <p className="text-2xl font-bold">89</p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">57%</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Planes Pro</p>
                  <p className="text-2xl font-bold">34</p>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">22%</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Chats este mes</p>
                  <p className="text-2xl font-bold">1,247</p>
                </div>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">+18%</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Caridad acumulada</p>
                  <p className="text-2xl font-bold">RD$32,500</p>
                </div>
                <Badge variant="secondary" className="bg-pink-100 text-pink-800">65%</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

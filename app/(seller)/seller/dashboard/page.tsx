import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Package, PackageCheck, Eye, PackageOpen, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { MetricCard } from '@/components/metric-card'
import { EmptyState } from '@/components/shared/EmptyState'
import { LocationBanner } from '@/components/seller/LocationBanner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DashboardProductActions } from './DashboardProductActions'
import type { ProductStatus } from '@/types/database.types'

const PLAN_LABELS: Record<string, string> = {
  free:  'Plan Gratis',
  basic: 'Plan Básico',
  pro:   'Plan Pro',
}

export default async function SellerDashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch store
  const { data: store } = await supabase
    .from('stores')
    .select('id, name, subscription_plan, latitude, longitude')
    .eq('owner_id', user.id)
    .maybeSingle()

  if (!store) redirect('/seller/onboarding')

  // Fetch product metrics
  const { data: productStats } = await supabase
    .from('products')
    .select('status, views_count')
    .eq('store_id', store.id)

  const activeCount = productStats?.filter((p) => p.status === 'active').length ?? 0
  const soldCount   = productStats?.filter((p) => p.status === 'sold').length ?? 0
  const totalViews  = productStats?.reduce((sum, p) => sum + (p.views_count ?? 0), 0) ?? 0

  // Fetch 6 most recent products with their first image
  const { data: recentProducts } = await supabase
    .from('products')
    .select('id, title, price, status, views_count, product_images(url)')
    .eq('store_id', store.id)
    .order('created_at', { ascending: false })
    .limit(6)

  const hasProducts = (recentProducts?.length ?? 0) > 0

  // Type-safe cast: Supabase returns joined rows
  const typedProducts = (recentProducts ?? []) as Array<{
    id: string
    title: string | null
    price: number
    status: ProductStatus
    views_count: number
    product_images: { url: string }[]
  }>

  const hasLocation = store.latitude !== null && store.longitude !== null

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Location banner */}
        <LocationBanner hasLocation={hasLocation} />

        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{store.name}</h1>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="secondary">
                {PLAN_LABELS[store.subscription_plan] ?? store.subscription_plan}
              </Badge>
              {/* TODO (phase 7): link to real subscription management */}
              <Button variant="link" size="sm" className="h-auto p-0 text-xs" asChild>
                <Link href="#">Actualizar plan</Link>
              </Button>
            </div>
          </div>
          <Button asChild>
            <Link href="/seller/productos/nuevo">
              <Plus className="mr-2 h-4 w-4" /> Agregar producto
            </Link>
          </Button>
        </div>

        {/* Metrics */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <MetricCard title="Productos activos" value={activeCount} icon={Package} />
          <MetricCard title="Productos vendidos" value={soldCount} icon={PackageCheck} />
          <MetricCard
            title="Vistas totales"
            value={totalViews.toLocaleString('es-DO')}
            icon={Eye}
          />
        </div>

        {/* Recent products */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Tus productos recientes</h2>
          {hasProducts && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/seller/productos">Ver todos</Link>
            </Button>
          )}
        </div>

        {hasProducts ? (
          <DashboardProductActions
            initialProducts={typedProducts}
            storeId={store.id}
          />
        ) : (
          <EmptyState
            icon={PackageOpen}
            title="Aún no tienes productos"
            description="Sube tu primer producto en menos de 1 minuto"
            actionLabel="+ Agregar producto"
            actionHref="/seller/productos/nuevo"
          />
        )}
      </div>
    </div>
  )
}

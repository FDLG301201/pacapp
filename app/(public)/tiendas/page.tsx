// TODO (phase 3): Rewrite with real Supabase data — mock-data types suppressed until then
// @ts-nocheck
import { stores, provinces } from "@/lib/mock-data"
import { TiendasFilters } from "./_components/tiendas-filters"

export default function TiendasPage() {
  const stats = {
    totalStores: stores.length,
    verifiedStores: stores.filter((s) => s.verified).length,
    totalProducts: stores.reduce((acc, s) => acc + s.productCount, 0),
  }

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Tiendas de Pacas</h1>
          <p className="mt-2 text-muted-foreground">
            Encuentra las mejores tiendas de ropa de segunda mano en tu zona
          </p>
        </div>

        <TiendasFilters stores={stores} provinces={provinces} stats={stats} />
      </div>
    </main>
  )
}

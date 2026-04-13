// TODO (phase 2): Build seller analytics dashboard
import { SellerLayout } from '@/components/seller-layout'
import { BarChart3 } from 'lucide-react'

export default function EstadisticasPage() {
  return (
    <SellerLayout>
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <BarChart3 className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Estadísticas</h1>
        <p className="text-muted-foreground mt-2 max-w-sm">
          Aquí verás vistas, clics y rendimiento de tus productos.
          Esta sección estará disponible pronto.
        </p>
      </div>
    </SellerLayout>
  )
}

// TODO (phase 2): Build store profile editor
import { SellerLayout } from '@/components/seller-layout'
import { Store } from 'lucide-react'

export default function MiTiendaPage() {
  return (
    <SellerLayout>
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Store className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Mi Tienda</h1>
        <p className="text-muted-foreground mt-2 max-w-sm">
          Aquí podrás editar el perfil de tu tienda, logo, descripción y dirección.
          Esta sección estará disponible pronto.
        </p>
      </div>
    </SellerLayout>
  )
}

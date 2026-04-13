// TODO (phase 3): Build buyer favorites page
import { Heart } from 'lucide-react'

export default function FavoritosPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center py-24 text-center">
      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Heart className="h-8 w-8 text-primary" />
      </div>
      <h1 className="text-2xl font-bold">Mis Favoritos</h1>
      <p className="text-muted-foreground mt-2 max-w-sm">
        Aquí verás los productos que guardaste. Esta sección estará disponible pronto.
      </p>
    </main>
  )
}

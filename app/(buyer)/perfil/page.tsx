// TODO (phase 3): Build buyer profile page
import { User } from 'lucide-react'

export default function PerfilPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center py-24 text-center">
      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <User className="h-8 w-8 text-primary" />
      </div>
      <h1 className="text-2xl font-bold">Mi Perfil</h1>
      <p className="text-muted-foreground mt-2 max-w-sm">
        Aquí podrás editar tu información y preferencias. Esta sección estará disponible pronto.
      </p>
    </main>
  )
}

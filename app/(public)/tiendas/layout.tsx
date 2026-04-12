import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

// Layout for all /tiendas/* routes.
// Renders Header and Footer server-side so client-component pages
// don't need to import them directly (which would break next/headers).
export default function TiendasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

// Public layout — renders Header and Footer for all public-facing pages.
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <>{children}</>
      <Footer />
    </div>
  )
}

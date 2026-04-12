'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Store, MessageCircle, CreditCard, BarChart3, Menu, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Logo } from './logo'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const navItems = [
  { href: '/seller/dashboard',   label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/seller/productos',   label: 'Productos',    icon: Package },
  { href: '/seller/tienda',      label: 'Mi Tienda',    icon: Store },
  { href: '/seller/chats',       label: 'Chats',        icon: MessageCircle },
  { href: '/seller/suscripcion', label: 'Suscripción',  icon: CreditCard },
  { href: '/seller/estadisticas',label: 'Estadísticas', icon: BarChart3 },
]

interface SellerLayoutProps {
  children: React.ReactNode
  storeName?: string
}

export function SellerLayout({ children, storeName = '' }: SellerLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Sesión cerrada')
    router.push('/')
  }

  const NavContent = () => (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive ? 'secondary' : 'ghost'}
              className={`w-full justify-start gap-3 ${isActive ? 'bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary' : ''}`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Button>
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r bg-card">
        <div className="p-4 border-b">
          <Logo />
        </div>
        <div className="flex-1 p-4">
          {storeName && (
            <>
              <p className="text-xs text-muted-foreground mb-1">TIENDA</p>
              <p className="font-medium mb-4 truncate">{storeName}</p>
            </>
          )}
          <NavContent />
        </div>
        <div className="p-4 border-t space-y-2">
          <Link href="/">
            <Button variant="outline" className="w-full">
              Ver catálogo público
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5" />
            Cerrar sesión
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-50 flex items-center justify-between h-16 px-4 border-b bg-card">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 flex flex-col">
              <div className="p-4 border-b">
                <Logo />
              </div>
              <div className="flex-1 p-4">
                {storeName && (
                  <>
                    <p className="text-xs text-muted-foreground mb-1">TIENDA</p>
                    <p className="font-medium mb-4 truncate">{storeName}</p>
                  </>
                )}
                <NavContent />
              </div>
              <div className="p-4 border-t space-y-2">
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    Ver catálogo público
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-5 w-5" />
                  Cerrar sesión
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <Logo />
          {/* Spacer to keep logo centered */}
          <div className="w-10" />
        </header>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t flex items-center justify-around py-2 z-50">
          {navItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 p-2">
                <item.icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`text-xs ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 pb-24 lg:pb-6">
          {children}
        </main>
      </div>
    </div>
  )
}

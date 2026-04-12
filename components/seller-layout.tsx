'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Store, MessageCircle, CreditCard, BarChart3, Menu, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Logo } from './logo'

const navItems = [
  { href: '/seller/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/seller/productos', label: 'Productos', icon: Package },
  { href: '/seller/tienda', label: 'Mi Tienda', icon: Store },
  { href: '/seller/chats', label: 'Chats', icon: MessageCircle, badge: 2 },
  { href: '/seller/suscripcion', label: 'Suscripción', icon: CreditCard },
  { href: '/seller/estadisticas', label: 'Estadísticas', icon: BarChart3 },
]

interface SellerLayoutProps {
  children: React.ReactNode
  storeName?: string
}

export function SellerLayout({ children, storeName = 'Pacas La Bendición' }: SellerLayoutProps) {
  const pathname = usePathname()

  const NavContent = () => (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive ? 'secondary' : 'ghost'}
              className={`w-full justify-start gap-3 ${isActive ? 'bg-primary/10 text-primary' : ''}`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
              {item.badge && (
                <Badge className="ml-auto">{item.badge}</Badge>
              )}
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
          <p className="text-xs text-muted-foreground mb-2">TIENDA</p>
          <p className="font-medium mb-4 truncate">{storeName}</p>
          <NavContent />
        </div>
        <div className="p-4 border-t">
          <Link href="/">
            <Button variant="outline" className="w-full">
              Ver catálogo público
            </Button>
          </Link>
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
            <SheetContent side="left" className="w-64 p-0">
              <div className="p-4 border-b">
                <Logo />
              </div>
              <div className="p-4">
                <p className="text-xs text-muted-foreground mb-2">TIENDA</p>
                <p className="font-medium mb-4 truncate">{storeName}</p>
                <NavContent />
              </div>
              <div className="p-4 border-t mt-auto">
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    Ver catálogo público
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
          <Logo />
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              3
            </Badge>
          </Button>
        </header>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t flex items-center justify-around py-2 z-50">
          {navItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 p-2">
                <div className="relative">
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  {item.badge && (
                    <Badge className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-[10px]">
                      {item.badge}
                    </Badge>
                  )}
                </div>
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

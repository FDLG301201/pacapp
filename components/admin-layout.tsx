'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Store, CreditCard, Star, Heart, Settings, Menu, Bell, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/client'

const BASE_NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/usuarios', label: 'Usuarios', icon: Users },
  { href: '/admin/tiendas', label: 'Tiendas', icon: Store },
  { href: '/admin/pagos', label: 'Pagos pendientes', icon: CreditCard },
  { href: '/admin/resenas', label: 'Reseñas', icon: Star },
  { href: '/admin/caridad', label: 'Caridad', icon: Heart },
  { href: '/admin/configuracion', label: 'Configuración', icon: Settings },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const supabase = createClient()
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    supabase
      .from('subscription_requests')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending')
      .then(({ count }) => setPendingCount(count ?? 0))
  }, [])

  const navItems = BASE_NAV.map((item) =>
    item.href === '/admin/pagos' && pendingCount > 0
      ? { ...item, badge: pendingCount }
      : { ...item, badge: undefined }
  )

  const NavContent = () => (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive ? 'secondary' : 'ghost'}
              className={`w-full justify-start gap-3 ${isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
              {item.badge !== undefined && item.badge > 0 && (
                <Badge className="ml-auto bg-red-500">{item.badge}</Badge>
              )}
            </Button>
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar - Dark theme for admin */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white">
        <div className="p-4 border-b border-white/10">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-bold text-primary-foreground">P</span>
            </div>
            <div>
              <span className="font-serif font-bold">PACAPP</span>
              <Badge variant="secondary" className="ml-2 text-xs">Admin</Badge>
            </div>
          </Link>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <NavContent />
        </div>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Administrador</p>
              <p className="text-xs text-white/60">admin@pacapp.do</p>
            </div>
          </div>
          <Link href="/login">
            <Button variant="ghost" className="w-full justify-start gap-2 text-white/70 hover:text-white hover:bg-white/10">
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-muted/30">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-50 flex items-center justify-between h-16 px-4 border-b bg-slate-900 text-white">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 bg-slate-900 text-white border-slate-800">
              <div className="p-4 border-b border-white/10">
                <Link href="/admin/dashboard" className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                    <span className="font-bold text-primary-foreground">P</span>
                  </div>
                  <div>
                    <span className="font-serif font-bold">PACAPP</span>
                    <Badge variant="secondary" className="ml-2 text-xs">Admin</Badge>
                  </div>
                </Link>
              </div>
              <div className="p-4">
                <NavContent />
              </div>
            </SheetContent>
          </Sheet>
          <span className="font-serif font-bold">PACAPP Admin</span>
          <Button variant="ghost" size="icon" className="relative text-white">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
              3
            </Badge>
          </Button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

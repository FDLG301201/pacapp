'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Bell,
  MessageCircle,
  Menu,
  Store,
  LogOut,
  Heart,
  Settings,
  Search,
  LayoutDashboard,
  Users,
  CreditCard,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Logo } from './logo'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { HeaderUser } from './header'

const ROLE_LABELS: Record<string, string> = {
  buyer: 'Comprador',
  seller: 'Vendedor',
  admin: 'Administrador',
}

interface HeaderClientProps {
  user: HeaderUser | null
}

export function HeaderClient({ user }: HeaderClientProps) {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Sesión cerrada')
    router.refresh()
    router.push('/')
  }

  const chatsHref = user?.role === 'seller' ? '/seller/chats' : '/chats'
  const displayName = user?.full_name ?? user?.email ?? 'Usuario'
  const avatarSrc = user?.avatar_url ?? undefined

  return (
    <>
      {/* ── Desktop nav ── */}
      <nav className="hidden md:flex items-center gap-2">
        {user ? (
          <>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
            </Button>

            <Link href={chatsHref}>
              <Button variant="ghost" size="icon" className="relative">
                <MessageCircle className="h-5 w-5" />
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={avatarSrc} alt={displayName} />
                    <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                {/* User info */}
                <div className="flex items-center gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={avatarSrc} alt={displayName} />
                    <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium truncate">{displayName}</span>
                    <Badge variant="outline" className="text-xs w-fit mt-0.5">
                      {ROLE_LABELS[user.role]}
                    </Badge>
                  </div>
                </div>
                <DropdownMenuSeparator />

                {/* Buyer links */}
                {user.role === 'buyer' && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/favoritos" className="cursor-pointer">
                        <Heart className="mr-2 h-4 w-4" />
                        Mis favoritos
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/chats" className="cursor-pointer">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Mis chats
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/perfil" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Mi perfil
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                {/* Seller links */}
                {user.role === 'seller' && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/seller/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Mi dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/seller/tienda" className="cursor-pointer">
                        <Store className="mr-2 h-4 w-4" />
                        Mi tienda
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/seller/productos" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Mis productos
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/seller/chats" className="cursor-pointer">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Mis chats
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/seller/suscripcion" className="cursor-pointer">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Mi suscripción
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                {/* Admin links */}
                {user.role === 'admin' && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Panel admin
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/usuarios" className="cursor-pointer">
                        <Users className="mr-2 h-4 w-4" />
                        Usuarios
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/tiendas" className="cursor-pointer">
                        <Store className="mr-2 h-4 w-4" />
                        Tiendas
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/caridad" className="cursor-pointer">
                        <Heart className="mr-2 h-4 w-4" />
                        Módulo caridad
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Link href="/login">
              <Button variant="ghost">Iniciar sesión</Button>
            </Link>
            <Link href="/registro?tipo=vendedor">
              <Button>Vender en PACAPP</Button>
            </Link>
          </>
        )}
      </nav>

      {/* ── Mobile nav ── */}
      <div className="flex md:hidden items-center gap-2">
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
        </Button>
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <SheetHeader>
              <SheetTitle>
                <Logo />
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar productos..."
                  className="w-full pl-10"
                />
              </div>

              {user ? (
                <>
                  <div className="flex items-center gap-3 py-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={avatarSrc} alt={displayName} />
                      <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium truncate max-w-[180px]">{displayName}</p>
                      <Badge variant="outline" className="text-xs mt-0.5">
                        {ROLE_LABELS[user.role]}
                      </Badge>
                    </div>
                  </div>

                  <nav className="flex flex-col gap-2">
                    {user.role === 'buyer' && (
                      <>
                        <Link href="/favoritos" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start">
                            <Heart className="mr-2 h-4 w-4" />
                            Favoritos
                          </Button>
                        </Link>
                        <Link href="/chats" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start">
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Mensajes
                          </Button>
                        </Link>
                      </>
                    )}
                    {user.role === 'seller' && (
                      <>
                        <Link href="/seller/dashboard" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Mi dashboard
                          </Button>
                        </Link>
                        <Link href="/seller/chats" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start">
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Mensajes
                          </Button>
                        </Link>
                      </>
                    )}
                    {user.role === 'admin' && (
                      <Link href="/admin/dashboard" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Panel admin
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-destructive hover:text-destructive"
                      onClick={() => {
                        setMobileMenuOpen(false)
                        handleSignOut()
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar sesión
                    </Button>
                  </nav>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Iniciar sesión
                    </Button>
                  </Link>
                  <Link href="/registro?tipo=vendedor" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">Vender en PACAPP</Button>
                  </Link>
                </div>
              )}

              <div className="border-t pt-4 mt-2">
                <nav className="flex flex-col gap-2">
                  <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Inicio
                    </Button>
                  </Link>
                  <Link href="/mapa" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Mapa de tiendas
                    </Button>
                  </Link>
                  <Link href="/mayoreo" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Mayoreo
                    </Button>
                  </Link>
                </nav>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

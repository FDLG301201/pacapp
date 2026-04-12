// Server Component — reads real auth state on every request.
// Do NOT add "use client" here.
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Logo } from './logo'
import { HeaderClient } from './header-client'
import { createClient } from '@/lib/supabase/server'
import type { UserRole } from '@/types/database.types'

export interface HeaderUser {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  avatar_url: string | null
}

export async function Header() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let headerUser: HeaderUser | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, role, avatar_url')
      .eq('id', user.id)
      .single()

    if (profile) {
      headerUser = {
        id: user.id,
        email: user.email ?? '',
        full_name: profile.full_name,
        role: profile.role,
        avatar_url: profile.avatar_url,
      }
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Logo />

          {/* Search Bar — hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Busca blusas, jeans, zapatos..."
                className="w-full pl-10 bg-muted/50"
              />
            </div>
          </div>

          {/* Auth-aware nav — client subcomponent */}
          <HeaderClient user={headerUser} />
        </div>
      </div>
    </header>
  )
}

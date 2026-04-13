import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'

// Routes that require a specific role
const PROTECTED_ROUTES: Record<string, string[]> = {
  buyer:  ['/favoritos', '/chats', '/perfil'],
  seller: ['/seller'],
  admin:  ['/admin'],
}

// Routes that redirect logged-in users away
const AUTH_ROUTES = ['/login', '/registro', '/recuperar']

export async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)
  const pathname = request.nextUrl.pathname

  // ── Redirect logged-in users away from auth pages ──────────
  if (user && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // ── Protect role-based routes ───────────────────────────────
  const needsRole = Object.entries(PROTECTED_ROUTES).find(([, paths]) =>
    paths.some((p) => pathname.startsWith(p))
  )

  if (needsRole) {
    // Not logged in → send to login
    if (!user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Logged in but wrong role → fetch profile to check
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: () => {},
        },
      }
    )

    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const profile = data as { role: string } | null
    const requiredRole = needsRole[0]
    if (profile?.role !== requiredRole && profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, icons, images in /public
     */
    '/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|placeholder|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

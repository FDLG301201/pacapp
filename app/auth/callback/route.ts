import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Handles:
// 1. Google OAuth redirect after sign-in
// 2. Email confirmation links
// 3. Password reset links (?type=recovery)
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const type = requestUrl.searchParams.get('type')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Auth callback error:', error.message)
      return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
    }
  }

  // Password recovery flow — redirect to update-password page
  if (type === 'recovery') {
    return NextResponse.redirect(`${origin}/actualizar-contrasena`)
  }

  // Default: redirect to home; middleware will route by role
  return NextResponse.redirect(origin)
}

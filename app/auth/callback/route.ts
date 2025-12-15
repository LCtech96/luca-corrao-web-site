import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const type = requestUrl.searchParams.get('type')
  const origin = requestUrl.origin

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(cookieStore)
    
    try {
      // Exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Error exchanging code for session:', error)
        // Se è un errore di reset password, reindirizza alla pagina di reset con errore
        if (type === 'recovery') {
          return NextResponse.redirect(`${origin}/auth/reset-password?error=invalid_token`)
        }
        // Altrimenti reindirizza alla home con errore
        return NextResponse.redirect(`${origin}/?error=auth_callback_error`)
      }
      
      // Se è un reset password, reindirizza alla pagina di reset
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/auth/reset-password`)
      }
    } catch (err) {
      console.error('Exception in auth callback:', err)
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/auth/reset-password?error=callback_exception`)
      }
      return NextResponse.redirect(`${origin}/?error=auth_callback_exception`)
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(origin)
}


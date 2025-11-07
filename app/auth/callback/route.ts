import { createClient } from '@/lib/supabase/client'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = createClient()
    
    try {
      // Exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Error exchanging code for session:', error)
        // Redirect to home with error
        return NextResponse.redirect(`${origin}/?error=auth_callback_error`)
      }
    } catch (err) {
      console.error('Exception in auth callback:', err)
      return NextResponse.redirect(`${origin}/?error=auth_callback_exception`)
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(origin)
}


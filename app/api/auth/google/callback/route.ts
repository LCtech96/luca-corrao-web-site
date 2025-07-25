import { NextRequest, NextResponse } from 'next/server'
import { getTokensFromCode } from '@/lib/google-auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      return NextResponse.json(
        { error: 'Autorizzazione negata dall\'utente' },
        { status: 400 }
      )
    }

    if (!code) {
      return NextResponse.json(
        { error: 'Codice di autorizzazione mancante' },
        { status: 400 }
      )
    }

    // Scambia il codice con i token
    const tokens = await getTokensFromCode(code)
    
    // Qui potresti salvare i token nel database per l'utente
    // Per ora li restituiamo nella risposta
    return NextResponse.json({
      success: true,
      message: 'Autenticazione Google completata con successo',
      tokens: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        scope: tokens.scope,
        token_type: tokens.token_type,
        expiry_date: tokens.expiry_date
      }
    })
  } catch (error) {
    console.error('Errore nel callback OAuth:', error)
    return NextResponse.json(
      { error: 'Errore durante l\'autenticazione Google' },
      { status: 500 }
    )
  }
} 
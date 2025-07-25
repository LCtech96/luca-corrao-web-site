import { NextRequest, NextResponse } from 'next/server'
import { generateAuthUrl } from '@/lib/google-auth'

export async function GET(request: NextRequest) {
  try {
    const authUrl = generateAuthUrl()
    
    return NextResponse.json({ 
      authUrl,
      message: 'URL di autorizzazione generato con successo'
    })
  } catch (error) {
    console.error('Errore nella generazione URL di autorizzazione:', error)
    return NextResponse.json(
      { error: 'Errore nella configurazione OAuth' },
      { status: 500 }
    )
  }
} 
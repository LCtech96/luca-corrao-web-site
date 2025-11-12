import { NextRequest, NextResponse } from 'next/server'
import { getAllStructures, addStructure, updateStructure, deleteStructure } from '@/lib/structures-service'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// GET - Recupera tutte le strutture
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const accessToken = searchParams.get('accessToken')

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Token di accesso richiesto' },
        { status: 401 }
      )
    }

    const structures = await getAllStructures(accessToken)
    
    return NextResponse.json({ 
      success: true,
      structures 
    })
  } catch (error) {
    console.error('Errore nel recupero strutture:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero delle strutture' },
      { status: 500 }
    )
  }
}

// POST - Aggiungi nuova struttura
export async function POST(request: NextRequest) {
  try {
    // Verifica autenticazione con Supabase server-side
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    )
    
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Devi essere autenticato per caricare una struttura' },
        { status: 401 }
      )
    }
    
    console.log('✅ User authenticated:', session.user.email, 'ID:', session.user.id)
    
    const body = await request.json()
    const { 
      name, 
      description, 
      address, 
      gpsCoordinates, 
      mainImage, 
      images, 
      mainImageFileId,
      imageFileIds,
      owner, 
      ownerEmail,
      ownerId
    } = body

    if (!name || !description || !address || !mainImage || !owner || !ownerEmail) {
      return NextResponse.json(
        { error: 'Tutti i campi obbligatori devono essere compilati' },
        { status: 400 }
      )
    }
    
    // Per sicurezza, usa sempre l'ID dell'utente dalla sessione
    const safeOwnerId = session.user.id
    const safeOwnerEmail = session.user.email || ownerEmail

    // Usa Google Sheets API access token (per ora usa quello dal .env o un dummy)
    const googleAccessToken = process.env.GOOGLE_SHEETS_API_KEY || 'dummy-token-for-now'

    const newStructure = await addStructure(googleAccessToken, {
      name,
      description,
      address,
      gpsCoordinates,
      rating: 0,
      mainImage,
      images: images || [],
      mainImageFileId: mainImageFileId || undefined,
      imageFileIds: imageFileIds || undefined,
      owner,
      ownerEmail: safeOwnerEmail,
      ownerId: safeOwnerId
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Struttura aggiunta con successo (in attesa di approvazione)',
      structure: newStructure
    })
  } catch (error) {
    console.error('Errore nell\'aggiunta struttura:', error)
    return NextResponse.json(
      { error: 'Errore nell\'aggiunta della struttura' },
      { status: 500 }
    )
  }
}

// PUT - Aggiorna struttura esistente
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      structureId, 
      updates, 
      accessToken 
    } = body

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Token di accesso richiesto' },
        { status: 401 }
      )
    }

    if (!structureId) {
      return NextResponse.json(
        { error: 'ID struttura richiesto' },
        { status: 400 }
      )
    }

    await updateStructure(accessToken, structureId, updates)

    return NextResponse.json({ 
      success: true, 
      message: 'Struttura aggiornata con successo'
    })
  } catch (error) {
    console.error('Errore nell\'aggiornamento struttura:', error)
    return NextResponse.json(
      { error: 'Errore nell\'aggiornamento della struttura' },
      { status: 500 }
    )
  }
}

// DELETE - Elimina struttura
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const structureId = searchParams.get('structureId')
    const accessToken = searchParams.get('accessToken')

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Token di accesso richiesto' },
        { status: 401 }
      )
    }

    if (!structureId) {
      return NextResponse.json(
        { error: 'ID struttura richiesto' },
        { status: 400 }
      )
    }

    await deleteStructure(accessToken, structureId)

    return NextResponse.json({ 
      success: true, 
      message: 'Struttura eliminata con successo'
    })
  } catch (error) {
    console.error('Errore nell\'eliminazione struttura:', error)
    return NextResponse.json(
      { error: 'Errore nell\'eliminazione della struttura' },
      { status: 500 }
    )
  }
} 
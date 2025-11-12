import { NextRequest, NextResponse } from 'next/server'
import { getAllStructures, addStructure, updateStructure, deleteStructure, approveStructure, rejectStructure } from '@/lib/supabase/structures-service'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Admin emails
const ADMIN_EMAILS = [
  'luca@bedda.tech',
  'lucacorrao96@outlook.it',
  'luca@metatech.dev',
  'lucacorrao1996@outlook.com',
  'luca@lucacorrao.com'
]

// GET - Recupera tutte le strutture
export async function GET(request: NextRequest) {
  try {
    const structures = await getAllStructures()
    
    return NextResponse.json({ 
      success: true,
      structures,
      count: structures.length
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
  console.log('🔷 POST /api/structures called')
  try {
    console.log('🔷 Getting cookies...')
    // Verifica autenticazione con Supabase server-side
    const cookieStore = await cookies()
    console.log('🔷 Cookies retrieved, creating Supabase client...')
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
    
    console.log('🔷 Getting session...')
    const { data: { session } } = await supabase.auth.getSession()
    console.log('🔷 Session:', session ? 'Found' : 'Not found', session?.user?.email)
    
    if (!session?.user) {
      console.log('❌ No user in session')
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

    console.log('📦 Creating structure:', { name, owner, ownerEmail: safeOwnerEmail, ownerId: safeOwnerId })

    const newStructure = await addStructure({
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
    }, supabase) // ← PASSA IL CLIENT AUTENTICATO!

    if (!newStructure) {
      throw new Error('Failed to create structure')
    }

    console.log('✅ Structure created successfully:', newStructure.id)

    return NextResponse.json({ 
      success: true, 
      message: 'Struttura aggiunta con successo (in attesa di approvazione)',
      structure: newStructure
    })
  } catch (error) {
    console.error('💥 ERRORE COMPLETO nell\'aggiunta struttura:', error)
    console.error('💥 Error name:', (error as any)?.name)
    console.error('💥 Error message:', (error as any)?.message)
    console.error('💥 Error stack:', (error as any)?.stack)
    return NextResponse.json(
      { 
        error: 'Errore nell\'aggiunta della struttura',
        details: error instanceof Error ? error.message : 'Unknown error',
        errorType: (error as any)?.name || 'Unknown'
      },
      { status: 500 }
    )
  }
}

// PUT - Aggiorna struttura esistente
export async function PUT(request: NextRequest) {
  try {
    // Verifica autenticazione
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
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
        { error: 'Devi essere autenticato' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { structureId, updates } = body

    if (!structureId) {
      return NextResponse.json(
        { error: 'ID struttura richiesto' },
        { status: 400 }
      )
    }

    const updatedStructure = await updateStructure(structureId, updates, supabase)

    return NextResponse.json({ 
      success: true, 
      message: 'Struttura aggiornata con successo',
      structure: updatedStructure
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
    // Verifica autenticazione
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
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
        { error: 'Devi essere autenticato' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const structureId = searchParams.get('structureId')

    if (!structureId) {
      return NextResponse.json(
        { error: 'ID struttura richiesto' },
        { status: 400 }
      )
    }

    const success = await deleteStructure(structureId, supabase)

    if (!success) {
      throw new Error('Failed to delete structure')
    }

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
import { NextRequest, NextResponse } from 'next/server'
import { getAllStructures, addStructure, updateStructure, deleteStructure } from '@/lib/structures-service'

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
      accessToken 
    } = body

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Token di accesso richiesto' },
        { status: 401 }
      )
    }

    if (!name || !description || !address || !mainImage || !owner || !ownerEmail) {
      return NextResponse.json(
        { error: 'Tutti i campi obbligatori devono essere compilati' },
        { status: 400 }
      )
    }

    const newStructure = await addStructure(accessToken, {
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
      ownerEmail
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Struttura aggiunta con successo',
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
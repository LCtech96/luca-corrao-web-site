import { NextRequest, NextResponse } from 'next/server'

// Database delle recensioni (in produzione andrebbe in un database reale)
const reviews = new Map<string, {
  id: string
  userId: string
  userEmail: string
  userName: string
  structureId: string
  structureName: string
  rating: number
  comment: string
  createdAt: string
}>()

// Genera ID univoco per le recensioni
function generateReviewId(): string {
  return `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// POST - Crea nuova recensione
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      structureId, 
      structureName, 
      rating, 
      comment,
      userEmail,
      userName 
    } = body

    // Validazione campi
    if (!structureId || !structureName || !rating || !comment || !userEmail || !userName) {
      return NextResponse.json(
        { error: 'Tutti i campi sono obbligatori' },
        { status: 400 }
      )
    }

    // Validazione rating (1-5 stelle)
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating deve essere tra 1 e 5' },
        { status: 400 }
      )
    }

    // Validazione commento
    if (comment.length < 10) {
      return NextResponse.json(
        { error: 'Il commento deve essere di almeno 10 caratteri' },
        { status: 400 }
      )
    }

    // Verifica se l'utente ha già recensito questa struttura
    const existingReview = Array.from(reviews.values()).find(
      review => review.userEmail === userEmail && review.structureId === structureId
    )

    if (existingReview) {
      return NextResponse.json(
        { error: 'Hai già recensito questa struttura' },
        { status: 400 }
      )
    }

    // Crea la recensione
    const reviewId = generateReviewId()
    const newReview = {
      id: reviewId,
      userId: userEmail, // Usa email come ID utente
      userEmail,
      userName,
      structureId,
      structureName,
      rating,
      comment,
      createdAt: new Date().toISOString()
    }

    reviews.set(reviewId, newReview)

    console.log(`Recensione creata: ${reviewId} per struttura ${structureName}`)

    return NextResponse.json({ 
      success: true, 
      message: 'Recensione pubblicata con successo',
      review: newReview
    })
  } catch (error) {
    console.error('Errore nella creazione recensione:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}

// GET - Recupera recensioni
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const structureId = searchParams.get('structureId')
    const userEmail = searchParams.get('userEmail')

    let filteredReviews = Array.from(reviews.values())

    // Filtra per struttura se specificato
    if (structureId) {
      filteredReviews = filteredReviews.filter(review => review.structureId === structureId)
    }

    // Filtra per utente se specificato
    if (userEmail) {
      filteredReviews = filteredReviews.filter(review => review.userEmail === userEmail)
    }

    // Ordina per data di creazione (più recenti prima)
    filteredReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({ 
      success: true, 
      reviews: filteredReviews,
      total: filteredReviews.length
    })
  } catch (error) {
    console.error('Errore nel recupero recensioni:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}

// PUT - Aggiorna recensione
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      reviewId, 
      rating, 
      comment,
      userEmail 
    } = body

    // Validazione campi
    if (!reviewId || !rating || !comment || !userEmail) {
      return NextResponse.json(
        { error: 'Tutti i campi sono obbligatori' },
        { status: 400 }
      )
    }

    // Verifica che la recensione esista
    const review = reviews.get(reviewId)
    if (!review) {
      return NextResponse.json(
        { error: 'Recensione non trovata' },
        { status: 404 }
      )
    }

    // Verifica che l'utente sia il proprietario della recensione
    if (review.userEmail !== userEmail) {
      return NextResponse.json(
        { error: 'Non autorizzato a modificare questa recensione' },
        { status: 403 }
      )
    }

    // Validazione rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating deve essere tra 1 e 5' },
        { status: 400 }
      )
    }

    // Validazione commento
    if (comment.length < 10) {
      return NextResponse.json(
        { error: 'Il commento deve essere di almeno 10 caratteri' },
        { status: 400 }
      )
    }

    // Aggiorna la recensione
    review.rating = rating
    review.comment = comment
    reviews.set(reviewId, review)

    return NextResponse.json({ 
      success: true, 
      message: 'Recensione aggiornata con successo',
      review
    })
  } catch (error) {
    console.error('Errore nell\'aggiornamento recensione:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}

// DELETE - Elimina recensione
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reviewId = searchParams.get('reviewId')
    const userEmail = searchParams.get('userEmail')

    if (!reviewId || !userEmail) {
      return NextResponse.json(
        { error: 'ID recensione e email utente sono obbligatori' },
        { status: 400 }
      )
    }

    // Verifica che la recensione esista
    const review = reviews.get(reviewId)
    if (!review) {
      return NextResponse.json(
        { error: 'Recensione non trovata' },
        { status: 404 }
      )
    }

    // Verifica che l'utente sia il proprietario della recensione
    if (review.userEmail !== userEmail) {
      return NextResponse.json(
        { error: 'Non autorizzato a eliminare questa recensione' },
        { status: 403 }
      )
    }

    // Elimina la recensione
    reviews.delete(reviewId)

    return NextResponse.json({ 
      success: true, 
      message: 'Recensione eliminata con successo'
    })
  } catch (error) {
    console.error('Errore nell\'eliminazione recensione:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
} 
import { NextRequest, NextResponse } from 'next/server'
import { getAllAccommodations } from '@/lib/supabase/accommodations-service'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const location = searchParams.get('location') || ''
    const guests = parseInt(searchParams.get('guests') || '0')
    const checkIn = searchParams.get('checkIn') || ''
    const checkOut = searchParams.get('checkOut') || ''

    // Recupera tutte le strutture attive
    const allAccommodations = await getAllAccommodations()

    // Filtra basandoti sui parametri (logica semplificata)
    let filtered = allAccommodations

    // Filtro per numero ospiti (estrai numero da capacity es: "4 ospiti")
    if (guests > 0) {
      filtered = filtered.filter(acc => {
        const capacityMatch = acc.capacity.match(/(\d+)/)
        const maxGuests = capacityMatch ? parseInt(capacityMatch[1]) : 0
        return maxGuests >= guests
      })
    }

    // Filtro per location (cerca in address, distance, description)
    if (location) {
      const lowerLocation = location.toLowerCase()
      filtered = filtered.filter(acc => 
        acc.address?.toLowerCase().includes(lowerLocation) ||
        acc.distance?.toLowerCase().includes(lowerLocation) ||
        acc.description.toLowerCase().includes(lowerLocation) ||
        acc.name.toLowerCase().includes(lowerLocation)
      )
    }

    // Formatta per l'AI (include solo campi necessari)
    const formatted = filtered.map(acc => ({
      id: acc.id,
      name: acc.name,
      subtitle: acc.subtitle,
      description: acc.description,
      capacity: acc.capacity,
      features: acc.features,
      mainImage: acc.main_image,
      price: acc.price,
      address: acc.address,
      distance: acc.distance,
      slug: generateSlug(acc.name)
    }))

    return NextResponse.json({
      success: true,
      accommodations: formatted,
      count: formatted.length,
      filters: {
        location,
        guests,
        checkIn,
        checkOut
      }
    })

  } catch (error) {
    console.error('Accommodations API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Helper per generare slug da nome
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}


"use client"

import { useParams, useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BookingSystem } from "@/components/booking-system"
import { getPropertyBySlug, isPropertySlug } from "@/lib/property-utils"

export default function PropertyBookingPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const slug = params.id as string
  const property = isPropertySlug(slug) ? getPropertyBySlug(slug) : null

  const checkIn = searchParams.get("checkIn") ?? undefined
  const checkOut = searchParams.get("checkOut") ?? undefined

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Struttura non trovata</h1>
          <Link href="/esplora-le-strutture">
            <Button className="bg-amber-600 hover:bg-amber-700">Torna alle strutture</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link href={`/${slug}`} className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900">
            <ChevronLeft className="w-5 h-5" />
            <span>Torna a {property.name}</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <BookingSystem
          propertySlug={slug}
          propertyName={property.name}
          mode="page"
          initialCheckIn={checkIn}
          initialCheckOut={checkOut}
          onClose={() => router.push(`/${slug}`)}
          onDatesChange={(inDate, outDate) => {
            const params = new URLSearchParams()
            if (inDate) params.set("checkIn", inDate)
            if (outDate) params.set("checkOut", outDate)
            const query = params.toString()
            router.replace(`/${slug}/prenota${query ? `?${query}` : ""}`, { scroll: false })
          }}
        />
      </div>
    </div>
  )
}

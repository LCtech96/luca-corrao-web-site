"use client"

import type React from "react"
import { useState } from "react"
import { useAccommodations } from "@/hooks/use-accommodations"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Users,
  Calendar,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
  Plane,
  ParkingCircle,
  Wifi,
  Car,
  Eye,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { BookingSystem } from "./booking-system"

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
}

// Fallback data for when Supabase is loading or unavailable
const fallbackAccommodations = [
  {
    id: "lucas-rooftop",
    slug: "lucas-rooftop",
    name: "Lucas Rooftop",
    subtitle: "Intimità con Vista a Terrasini",
    description:
      "A 50 metri da Piazza Duomo e 300 metri dal mare. Perfetta per 4+1 persone. Caratterizzata da una splendida terrazza panoramica e interni moderni dai toni caldi.",
    features: [
      "Climatizzatore",
      "Acqua calda",
      "Macchinetta del caffè",
      "Terrazza panoramica",
      "Interni moderni",
      "Lavatrice",
      "WiFi gratuito",
    ],
    capacity: "4+1 persone",
    distance: "50m da Piazza Duomo, 300m dal mare",
    mainImage: "/images/lucas-rooftop-terrace.jpg",
    images: [
      "/images/lucas-rooftop-terrace.jpg",
      "/images/lucas-rooftop-bedroom-1.jpg",
      "/images/lucas-rooftop-bedroom-2.jpg",
      "/images/lucas-rooftop-kitchen.jpg",
      "/images/lucas-rooftop-bathroom.jpg",
      "/images/lucas-rooftop-terrace-raw.jpg",
    ],
    imageDescriptions: [
      "Terrazza panoramica Lucas Rooftop",
      "Camera da letto principale",
      "Seconda camera da letto",
      "Cucina moderna attrezzata",
      "Bagno moderno",
      "Vista dalla terrazza",
    ],
    owner: "Luca Corrao",
    price: "€80/notte",
    isActive: true,
  },
  {
    id: "lucas-suite",
    slug: "lucas-suite",
    name: "Lucas Suite",
    subtitle: "Modernità e Comfort nel Cuore di Terrasini",
    description:
      "A 30 metri da Piazza Duomo e 350 metri dal mare. Ideale per 2 persone. Caratterizzata da splendidi affreschi storici sui soffitti che si fondono con comfort moderni.",
    features: [
      "Climatizzatore",
      "Acqua calda garantita",
      "Macchina del caffè",
      "Spazio ampio",
      "Affreschi storici",
      "Design moderno",
      "WiFi gratuito",
    ],
    capacity: "2 persone",
    distance: "30m da Piazza Duomo, 350m dal mare",
    mainImage: "/images/bedroom-historic-1.jpg",
    images: [
      "/images/bedroom-historic-1.jpg",
      "/images/bedroom-historic-2.jpg",
      "/images/ceiling-fresco-1.jpg",
      "/images/bathroom-modern.jpg",
    ],
    imageDescriptions: [
      "Camera da letto con affreschi storici",
      "Vista alternativa della camera",
      "Dettaglio degli affreschi sul soffitto",
      "Bagno moderno",
    ],
    owner: "Luca Corrao",
    price: "€60/notte",
    isActive: true,
  },
  {
    id: "lucas-cottage",
    slug: "lucas-cottage",
    name: "Lucas Cottage",
    subtitle: "Tranquillità e Natura a Trappeto",
    description:
      "A 25 minuti dall'aeroporto e 5 minuti dal mare. Perfetto per 4 persone. Caratterizzato da un ambiente rustico-chic con piscina privata e vista panoramica sulla campagna siciliana. A pochi minuti da Castellammare del Golfo, Scopello e la bellissima riserva naturale dello Zingaro.",
    features: [
      "Aria condizionata",
      "WiFi gratuito",
      "Self check-in",
      "Piscina privata",
      "Parcheggio gratuito in loco",
      "1 camera da letto con 2 letti matrimoniali",
      "1 bagno",
      "Vista panoramica",
    ],
    capacity: "4 persone",
    distance: "25 min dall'aeroporto, 5 min dal mare",
    mainImage: "/images/lucas-cottage-exterior-1.jpg",
    images: [
      "/images/lucas-cottage-exterior-1.jpg",
      "/images/lucas-cottage-interior-1.jpg",
      "/images/lucas-cottage-interior-2.jpg",
      "/images/lucas-cottage-pool-1.jpg",
      "/images/lucas-cottage-pool-2.jpg",
      "/images/lucas-cottage-exterior-2.jpg",
      "/images/lucas-cottage-pool-front.jpg",
    ],
    imageDescriptions: [
      "Vista esterna del cottage con piscina",
      "Interno del cottage - zona living",
      "Camera da letto con due letti matrimoniali",
      "Piscina privata con vista panoramica",
      "Area relax della piscina",
      "Vista esterna del cottage",
      "Vista frontale della piscina",
    ],
    owner: "Luca Corrao",
    price: "€100/notte",
    isActive: true,
  },
]

export function AccommodationsSectionConvex() {
  // Fetch accommodations from Supabase
  const { accommodations: supabaseAccommodations } = useAccommodations()
  
  // Use Supabase data if available, otherwise use fallback data
  const accommodations = supabaseAccommodations || fallbackAccommodations
  
  const [selectedGallery, setSelectedGallery] = useState<{
    accommodationId: string
    currentImageIndex: number
  } | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<{
    propertyId: string
    propertyName: string
  } | null>(null)

  const openGallery = (accommodationId: string, imageIndex = 0) => {
    setSelectedGallery({ accommodationId, currentImageIndex: imageIndex })
  }

  const closeGallery = () => {
    setSelectedGallery(null)
  }

  const openBookingSystem = (propertyId: string, propertyName: string) => {
    setSelectedBooking({ propertyId, propertyName })
  }

  const closeBookingSystem = () => {
    setSelectedBooking(null)
  }

  const nextImage = () => {
    if (!selectedGallery) return
    const accommodation = accommodations.find((acc) => acc.id === selectedGallery.accommodationId)
    if (!accommodation) return
    const nextIndex = (selectedGallery.currentImageIndex + 1) % accommodation.images.length
    setSelectedGallery({ ...selectedGallery, currentImageIndex: nextIndex })
  }

  const prevImage = () => {
    if (!selectedGallery) return
    const accommodation = accommodations.find((acc) => acc.id === selectedGallery.accommodationId)
    if (!accommodation) return
    const prevIndex =
      selectedGallery.currentImageIndex === 0 ? accommodation.images.length - 1 : selectedGallery.currentImageIndex - 1
    setSelectedGallery({ ...selectedGallery, currentImageIndex: prevIndex })
  }

  const currentGalleryAccommodation = selectedGallery
    ? accommodations.find((acc) => acc.id === selectedGallery.accommodationId)
    : null

  return (
    <section id="accommodations" className="py-20 bg-gradient-to-b from-white via-amber-50/30 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header - Wander Inspired */}
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 tracking-tight leading-tight">
              Find your happy place
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Esperienze uniche in Sicilia. Strutture premium con vista mare, 
              <br className="hidden md:block" />
              affreschi storici e piscine private.
            </p>
          </div>

          {/* Loading state */}
          {!accommodations && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Caricamento strutture...</p>
            </div>
          )}

          {/* Accommodations Grid - Wander-inspired Design */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {accommodations?.map((accommodation) => {
              const slug = accommodation.slug || generateSlug(accommodation.name)
              return (
              <Link 
                key={accommodation.id} 
                href={`/property/${slug}`}
                className="group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 block"
              >
                {/* Image Container with Overlay Effect */}
                <div 
                  className="relative h-80 overflow-hidden cursor-pointer"
                >
                  <Image
                    src={(accommodation as any).mainImage || (accommodation as any).main_image || accommodation.images?.[0] || "/placeholder.svg"}
                    alt={`${accommodation.name} - Struttura ricettiva Terrasini`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  
                  {/* Premium Badge */}
                  <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm text-amber-700 px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2 z-10">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    Premium
                  </div>
                  
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Hover Content */}
                  <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                    <div className="text-white space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-sm font-medium">{accommodation.subtitle}</p>
                      <p className="text-xs opacity-90 line-clamp-2">{accommodation.description}</p>
                    </div>
                  </div>
                </div>

                {/* Content - Clean and Modern */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-amber-600 transition-colors">
                      {accommodation.name}
                    </h3>
                    <p className="text-amber-600 font-medium text-sm">{accommodation.subtitle}</p>
                  </div>

                  {/* Location and Capacity - Minimal Style */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      <span>{accommodation.distance?.split(',')[0] || 'Terrasini'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      <span>{accommodation.capacity}</span>
                    </div>
                  </div>

                  {/* Features - Subtle Pills */}
                  <div className="flex flex-wrap gap-2">
                    {accommodation.features?.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        {feature}
                      </span>
                    ))}
                    {(accommodation.features?.length || 0) > 3 && (
                      <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-amber-700 bg-amber-50 rounded-full">
                        +{(accommodation.features?.length || 0) - 3}
                      </span>
                    )}
                  </div>

                  {/* Price - Prominent Display */}
                  <div className="flex items-baseline justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-gray-900">
                        {accommodation.price?.split('/')[0] || '€80'}
                      </span>
                      <span className="text-gray-500 text-sm">/ notte</span>
                    </div>
                  </div>

                  {/* Action Buttons - Wander Style */}
                  <div className="flex gap-3 mt-4">
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex-1 border-2 border-gray-200 hover:border-amber-500 hover:bg-amber-50 transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation()
                        openGallery(accommodation.id, 0)
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {accommodation.images?.length || 0} foto
                    </Button>
                    <Button
                      size="lg"
                      className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation()
                        openBookingSystem(accommodation.id, accommodation.name)
                      }}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Prenota
                    </Button>
                  </div>
                </div>
              </Link>
              )
            })}
          </div>

          {/* Image Gallery Modal */}
          {selectedGallery && currentGalleryAccommodation && (
            <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
              <div className="relative max-w-4xl w-full">
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white"
                  onClick={closeGallery}
                >
                  <X className="w-6 h-6" />
                </Button>

                {/* Navigation Buttons */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>

                {/* Main Image */}
                <div className="relative h-[70vh] w-full">
                  <Image
                    src={currentGalleryAccommodation.images?.[selectedGallery.currentImageIndex] || "/placeholder.svg"}
                    alt={
                      (currentGalleryAccommodation as any).imageDescriptions?.[selectedGallery.currentImageIndex] ||
                      (currentGalleryAccommodation as any).image_descriptions?.[selectedGallery.currentImageIndex] ||
                      `${currentGalleryAccommodation.name} - Foto ${selectedGallery.currentImageIndex + 1}`
                    }
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Image Info */}
                <div className="text-center mt-4 text-white">
                  <h3 className="text-xl font-bold mb-2">{currentGalleryAccommodation.name}</h3>
                  <p className="text-gray-300 mb-2">
                    {(currentGalleryAccommodation as any).imageDescriptions?.[selectedGallery.currentImageIndex] ||
                      (currentGalleryAccommodation as any).image_descriptions?.[selectedGallery.currentImageIndex] ||
                      `Foto ${selectedGallery.currentImageIndex + 1}`}
                  </p>
                  <p className="text-sm text-gray-400">
                    {selectedGallery.currentImageIndex + 1} di {currentGalleryAccommodation.images?.length || 0}
                  </p>
                </div>

                {/* Thumbnail Navigation */}
                <div className="flex justify-center mt-4 gap-2 overflow-x-auto pb-2">
                  {currentGalleryAccommodation.images?.map((image, index) => (
                    <div
                      key={index}
                      className={`relative w-16 h-16 cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        index === selectedGallery.currentImageIndex
                          ? "border-amber-500 scale-110"
                          : "border-white/30 hover:border-white/60"
                      }`}
                      onClick={() => setSelectedGallery({ ...selectedGallery, currentImageIndex: index })}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Booking System Modal */}
          {selectedBooking && (
            <BookingSystem
              propertyId={selectedBooking.propertyId}
              propertyName={selectedBooking.propertyName}
              onClose={closeBookingSystem}
            />
          )}

          {/* Beach Location Showcase */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">La Nostra Location da Sogno</h3>
              <p className="text-gray-600">Tramonti mozzafiato e acque cristalline a Terrasini</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/images/terrasini-beach.jpg"
                  alt="Spiaggia di Terrasini - Acque cristalline a 300 metri dalle nostre strutture"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h4 className="text-xl font-bold mb-2">Spiaggia di Terrasini</h4>
                  <p className="text-sm opacity-90">Acque cristalline e sabbia dorata</p>
                </div>
              </div>
              <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/images/terrasini-sunset.jpg"
                  alt="Tramonto a Terrasini - Paesaggio mozzafiato della costa siciliana"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h4 className="text-xl font-bold mb-2">Tramonti Indimenticabili</h4>
                  <p className="text-sm opacity-90">La magia della costa siciliana</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Services */}
          <div className="bg-gradient-to-r from-blue-50 to-amber-50 p-8 rounded-lg mb-16">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Servizi Aggiuntivi</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-4">
                <Car className="w-12 h-12 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-gray-900">Noleggio Auto</h4>
                  <p className="text-gray-600 text-sm">Sconto esclusivo del 10% per i nostri ospiti</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Wifi className="w-12 h-12 text-green-600" />
                <div>
                  <h4 className="font-semibold text-gray-900">Connessione Premium</h4>
                  <p className="text-gray-600 text-sm">WiFi ad alta velocità in tutte le strutture</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Plane className="w-12 h-12 text-purple-600" />
                <div>
                  <h4 className="font-semibold text-gray-900">Transfer Aeroporto</h4>
                  <p className="text-gray-600 text-sm">Servizio navetta da/per l'aeroporto di Palermo</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <ParkingCircle className="w-12 h-12 text-orange-600" />
                <div>
                  <h4 className="font-semibold text-gray-900">Parcheggio Riservato</h4>
                  <p className="text-gray-600 text-sm">Posto auto gratuito davanti alla struttura</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
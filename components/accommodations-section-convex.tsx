"use client"

import type React from "react"
import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"
import Image from "next/image"
import { BookingSystem } from "./booking-system"

// Fallback data for when Convex is loading or unavailable
const fallbackAccommodations = [
  {
    _id: "lucas-rooftop" as any,
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
    _id: "lucas-suite" as any,
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
    _id: "lucas-cottage" as any,
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
      "/images/lucas-cottage-interior-1.jpg.jpg",
      "/images/lucas-cottage-interior-2.jpg.jpg",
      "/images/lucas-cottage-pool-1.jpg.jpg",
      "/images/lucas-cottage-pool-2.jpg.jpg",
      "/images/lucas-cottage-exterior-2.jpg.jpg",
      "/images/lucas-cottage-pool-fronthead.jpg.jpg",
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
  // Fetch accommodations from Convex
  const convexAccommodations = useQuery(api.accommodations.getAll)
  
  // Use Convex data if available, otherwise use fallback data
  const accommodations = convexAccommodations || fallbackAccommodations
  
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
    const accommodation = accommodations.find((acc) => acc._id === selectedGallery.accommodationId)
    if (!accommodation) return
    const nextIndex = (selectedGallery.currentImageIndex + 1) % accommodation.images.length
    setSelectedGallery({ ...selectedGallery, currentImageIndex: nextIndex })
  }

  const prevImage = () => {
    if (!selectedGallery) return
    const accommodation = accommodations.find((acc) => acc._id === selectedGallery.accommodationId)
    if (!accommodation) return
    const prevIndex =
      selectedGallery.currentImageIndex === 0 ? accommodation.images.length - 1 : selectedGallery.currentImageIndex - 1
    setSelectedGallery({ ...selectedGallery, currentImageIndex: prevIndex })
  }

  const currentGalleryAccommodation = selectedGallery
    ? accommodations.find((acc) => acc._id === selectedGallery.accommodationId)
    : null

  return (
    <section id="accommodations" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Le Nostre Strutture Ricettive</h2>
            <p className="text-xl text-gray-600 mb-8">
              Scopri l'eccellenza dell'ospitalità siciliana nelle nostre esclusive proprietà
            </p>
            <div className="bg-blue-50 p-6 rounded-lg max-w-4xl mx-auto">
              <p className="text-blue-800 font-medium">
                <strong>Oltre 56 posti letto</strong> distribuiti tra Terrasini, Villagrazia di Carini, Cinisi e più di
                30 posti letto in un casale esclusivo vicino Castellammare del Golfo
              </p>
            </div>
          </div>

          {/* Loading state */}
          {!accommodations && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Caricamento strutture...</p>
            </div>
          )}

          {/* Accommodations Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {accommodations?.map((accommodation) => (
              <Card key={accommodation._id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-64 cursor-pointer" onClick={() => openGallery(accommodation._id, 0)}>
                  <Image
                    src={accommodation.mainImage || accommodation.images?.[0] || "/placeholder.svg"}
                    alt={`${accommodation.name} - Struttura ricettiva Terrasini`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-amber-600 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 hover:opacity-100 transition-opacity duration-300 bg-white/90 px-4 py-2 rounded-lg">
                      <p className="text-gray-900 font-medium">Clicca per vedere tutte le foto</p>
                    </div>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">{accommodation.name}</CardTitle>
                  <p className="text-amber-600 font-medium">{accommodation.subtitle}</p>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-600 mb-4">{accommodation.description}</p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-amber-600" />
                      {accommodation.distance}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-amber-600" />
                      {accommodation.capacity}
                    </div>
                    {accommodation.price && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Star className="w-4 h-4 text-amber-600" />
                        {accommodation.price}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {accommodation.features?.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => openGallery(accommodation._id, 0)}
                    >
                      Vedi Galleria ({accommodation.images?.length || 0} foto)
                    </Button>
                    <Button
                      className="flex-1 bg-amber-600 hover:bg-amber-700"
                      onClick={() => openBookingSystem(accommodation._id, accommodation.name)}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Prenota Ora
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
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
                      currentGalleryAccommodation.imageDescriptions?.[selectedGallery.currentImageIndex] ||
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
                    {currentGalleryAccommodation.imageDescriptions?.[selectedGallery.currentImageIndex] ||
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

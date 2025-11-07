"use client"

import { useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Users,
  Calendar,
  Star,
  Wifi,
  Car,
  Wind,
  Coffee,
  Waves,
  Home,
  Dumbbell,
  Flame,
  ChevronLeft,
  Heart,
  Share2,
  Check,
  X as XIcon,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { BookingModalAdvanced } from "@/components/booking-modal-advanced"

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
}

// Fallback data per le strutture
const propertiesData = {
  "lucas-rooftop": {
    id: "lucas-rooftop",
    name: "Lucas Rooftop",
    location: "Terrasini, Sicilia",
    subtitle: "Intimità con Vista a Terrasini",
    description:
      "Lucas Rooftop è un rifugio moderno nel cuore di Terrasini, perfetto per chi cerca l'equilibrio tra comfort urbano e relax mediterraneo. A soli 50 metri da Piazza Duomo e 300 metri dal mare, questa struttura offre un'esperienza unica con la sua splendida terrazza panoramica che si affaccia sul centro storico e il mare.",
    guests: 5,
    bedrooms: 2,
    beds: 3,
    bathrooms: 1,
    mainImage: "/images/lucas-rooftop-terrace.jpg",
    images: [
      "/images/lucas-rooftop-terrace.jpg",
      "/images/lucas-rooftop-bedroom-1.jpg",
      "/images/lucas-rooftop-bedroom-2.jpg",
      "/images/lucas-rooftop-kitchen.jpg",
      "/images/lucas-rooftop-bathroom.jpg",
      "/images/lucas-rooftop-terrace-raw.jpg",
    ],
    price: 80,
    rating: 5.0,
    reviewsCount: 24,
    amenities: [
      { name: "Terrazza panoramica", icon: "home" },
      { name: "WiFi gratuito", icon: "wifi" },
      { name: "Climatizzatore", icon: "wind" },
      { name: "Macchinetta del caffè", icon: "coffee" },
      { name: "Lavatrice", icon: "home" },
      { name: "Acqua calda", icon: "flame" },
    ],
    bedrooms_detail: [
      {
        name: "Camera 1",
        bed: "1 letto matrimoniale",
        image: "/images/lucas-rooftop-bedroom-1.jpg",
      },
      {
        name: "Camera 2",
        bed: "1 letto matrimoniale + 1 singolo",
        image: "/images/lucas-rooftop-bedroom-2.jpg",
      },
    ],
    checkIn: "dopo le 15:00",
    checkOut: "prima delle 11:00",
    features: [
      "Vista mare dalla terrazza",
      "Centro storico a 50m",
      "Spiaggia a 300m",
      "Ristoranti nelle vicinanze",
      "Supermercato a 100m",
      "Parcheggio gratuito in strada",
    ],
  },
  "lucas-suite": {
    id: "lucas-suite",
    name: "Lucas Suite",
    location: "Terrasini, Sicilia",
    subtitle: "Modernità e Comfort nel Cuore di Terrasini",
    description:
      "Lucas Suite è un gioiello nel centro di Terrasini, dove la storia si fonde con il comfort moderno. A soli 30 metri da Piazza Duomo e 350 metri dal mare, questa suite elegante è caratterizzata da splendidi affreschi storici sui soffitti che raccontano la storia siciliana, abbinati a comfort contemporanei per un'esperienza indimenticabile.",
    guests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    mainImage: "/images/bedroom-historic-1.jpg",
    images: [
      "/images/bedroom-historic-1.jpg",
      "/images/bedroom-historic-2.jpg",
      "/images/ceiling-fresco-1.jpg",
      "/images/bathroom-modern.jpg",
    ],
    price: 60,
    rating: 5.0,
    reviewsCount: 18,
    amenities: [
      { name: "Affreschi storici", icon: "home" },
      { name: "WiFi gratuito", icon: "wifi" },
      { name: "Climatizzatore", icon: "wind" },
      { name: "Macchina del caffè", icon: "coffee" },
      { name: "Acqua calda garantita", icon: "flame" },
      { name: "Spazio ampio", icon: "home" },
    ],
    bedrooms_detail: [
      {
        name: "Camera da letto",
        bed: "1 letto matrimoniale king size",
        image: "/images/bedroom-historic-1.jpg",
      },
    ],
    checkIn: "dopo le 15:00",
    checkOut: "prima delle 11:00",
    features: [
      "Affreschi originali del XVIII secolo",
      "Centro storico a 30m",
      "Spiaggia a 350m",
      "Design moderno",
      "Ristoranti tipici nelle vicinanze",
      "Vista sul centro storico",
    ],
  },
  "lucas-cottage": {
    id: "lucas-cottage",
    name: "Lucas Cottage",
    location: "Trappeto, Sicilia",
    subtitle: "Tranquillità e Natura a Trappeto",
    description:
      "Lucas Cottage è un paradiso di tranquillità immerso nella campagna siciliana, a soli 5 minuti dal mare e 25 minuti dall'aeroporto di Palermo. Perfetto per chi cerca privacy e relax, questo cottage rustico-chic vanta una piscina privata con vista panoramica sulla natura incontaminata. Ideale come base per esplorare Castellammare del Golfo, Scopello e la magnifica Riserva dello Zingaro.",
    guests: 4,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
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
    price: 100,
    rating: 5.0,
    reviewsCount: 32,
    amenities: [
      { name: "Piscina privata", icon: "waves" },
      { name: "WiFi gratuito", icon: "wifi" },
      { name: "Aria condizionata", icon: "wind" },
      { name: "Parcheggio gratuito", icon: "car" },
      { name: "Self check-in", icon: "home" },
      { name: "Vista panoramica", icon: "home" },
    ],
    bedrooms_detail: [
      {
        name: "Camera da letto",
        bed: "2 letti matrimoniali",
        image: "/images/lucas-cottage-interior-2.jpg",
      },
    ],
    checkIn: "dopo le 14:00",
    checkOut: "prima delle 10:00",
    features: [
      "Piscina privata con vista panoramica",
      "Giardino privato",
      "5 min dal mare",
      "25 min dall'aeroporto",
      "Vicino alla Riserva dello Zingaro",
      "Area BBQ esterna",
    ],
  },
}

export default function PropertyPage() {
  const params = useParams()
  const propertySlug = params.id as string
  
  // Find property by slug (slug is the same as the key in propertiesData)
  const property = propertiesData[propertySlug as keyof typeof propertiesData]

  const [selectedImage, setSelectedImage] = useState(0)
  const [showAllPhotos, setShowAllPhotos] = useState(false)
  const [showBooking, setShowBooking] = useState(false)

  // Share functionality
  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.name,
          text: `${property.subtitle} - ${property.location}`,
          url: url,
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url)
        alert('Link copiato negli appunti!')
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Proprietà non trovata</h1>
          <p className="text-gray-600 mb-6">La struttura che cerchi non esiste o è stata rimossa.</p>
          <Link href="/">
            <Button className="bg-amber-600 hover:bg-amber-700">Torna alla home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      wifi: Wifi,
      car: Car,
      wind: Wind,
      coffee: Coffee,
      waves: Waves,
      home: Home,
      flame: Flame,
    }
    const IconComponent = icons[iconName] || Home
    return <IconComponent className="w-5 h-5" />
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">Torna alle strutture</span>
            </Link>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleShare}
                title="Condividi questa struttura"
              >
                <Share2 className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" title="Aggiungi ai preferiti">
                <Heart className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Property Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <MapPin className="w-4 h-4" />
          <span className="uppercase tracking-wide">{property.location}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{property.name}</h1>
        <div className="flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span className="font-semibold">{property.rating}</span>
            <span className="text-gray-600">({property.reviewsCount} recensioni)</span>
          </div>
          <div className="flex items-center gap-4">
            <span>{property.guests} ospiti</span>
            <span>·</span>
            <span>{property.bedrooms} camere</span>
            <span>·</span>
            <span>{property.bathrooms} bagni</span>
          </div>
        </div>
      </div>

      {/* Image Gallery - Wander Style */}
      <div className="container mx-auto px-4 mb-12">
        <div className="grid grid-cols-4 gap-2 rounded-2xl overflow-hidden max-h-[600px]">
          {/* Main Large Image */}
          <div
            className="col-span-4 md:col-span-2 row-span-2 relative cursor-pointer group h-full"
            onClick={() => setShowAllPhotos(true)}
          >
            <Image
              src={property.images[0]}
              alt={property.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Smaller Images Grid */}
          {property.images.slice(1, 5).map((image, index) => (
            <div
              key={index}
              className="col-span-2 md:col-span-1 relative cursor-pointer group h-[298px]"
              onClick={() => setShowAllPhotos(true)}
            >
              <Image
                src={image}
                alt={`${property.name} - Foto ${index + 2}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {index === 3 && property.images.length > 5 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Button
                    variant="secondary"
                    className="bg-white hover:bg-gray-100"
                    onClick={() => setShowAllPhotos(true)}
                  >
                    Mostra tutte le {property.images.length} foto
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 mb-20">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-12">
            {/* About Section */}
            <section className="border-b border-gray-200 pb-12">
              <h2 className="text-2xl font-bold mb-6">Informazioni sulla proprietà</h2>
              <p className="text-gray-700 text-lg leading-relaxed">{property.description}</p>
            </section>

            {/* Amenities Section */}
            <section className="border-b border-gray-200 pb-12">
              <h2 className="text-2xl font-bold mb-6">Comfort di Livello Alberghiero</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="text-amber-600">{getIcon(amenity.icon)}</div>
                    <span className="font-medium text-gray-900">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Bedrooms Section */}
            <section className="border-b border-gray-200 pb-12">
              <h2 className="text-2xl font-bold mb-6">Dove dormirai</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {property.bedrooms_detail.map((bedroom, index) => (
                  <div key={index} className="rounded-xl border border-gray-200 overflow-hidden">
                    <div className="relative h-48">
                      <Image src={bedroom.image} alt={bedroom.name} fill className="object-cover" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{bedroom.name}</h3>
                      <p className="text-gray-600">{bedroom.bed}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Features Section */}
            <section className="border-b border-gray-200 pb-12">
              <h2 className="text-2xl font-bold mb-6">Caratteristiche</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {property.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* House Rules */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Regole della casa</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <span>Check-in: {property.checkIn}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <span>Check-out: {property.checkOut}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-600" />
                  <span>Massimo {property.guests} ospiti</span>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="border-2 border-gray-200 rounded-2xl p-6 shadow-xl">
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-bold">€{property.price}</span>
                  <span className="text-gray-600">/ notte</span>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-lg py-6 mb-4"
                  onClick={() => setShowBooking(true)}
                >
                  Prenota Ora
                </Button>

                <p className="text-center text-sm text-gray-600 mb-6">Non ti verrà addebitato nulla ancora</p>

                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">€{property.price} x 1 notte</span>
                    <span className="font-medium">€{property.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pulizia</span>
                    <span className="font-medium">€50</span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-gray-200">
                    <span className="font-semibold">Totale</span>
                    <span className="font-semibold">€{property.price + 50}</span>
                  </div>
                </div>
              </div>

              {/* Reviews Summary */}
              <div className="mt-6 p-6 bg-amber-50 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                  <span className="text-2xl font-bold">{property.rating}</span>
                </div>
                <p className="text-gray-700 font-medium">Gli ospiti amano questa struttura</p>
                <p className="text-sm text-gray-600 mt-1">{property.reviewsCount} recensioni verificate</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Gallery Modal */}
      {showAllPhotos && (
        <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
          <div className="min-h-screen p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">Tutte le foto</h2>
              <Button variant="ghost" size="icon" className="text-white" onClick={() => setShowAllPhotos(false)}>
                <XIcon className="w-6 h-6" />
              </Button>
            </div>
            <div className="max-w-5xl mx-auto space-y-4">
              {property.images.map((image, index) => (
                <div key={index} className="relative h-[600px] rounded-lg overflow-hidden">
                  <Image src={image} alt={`${property.name} - Foto ${index + 1}`} fill className="object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBooking && (
        <BookingModalAdvanced
          propertyName={property.name}
          propertyPrice={property.price}
          propertyId={property.id}
          propertySlug={propertySlug}
          onClose={() => setShowBooking(false)}
        />
      )}
    </div>
  )
}


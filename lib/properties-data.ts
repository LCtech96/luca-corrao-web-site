export type Property = {
  id: string
  name: string
  location: string
  subtitle: string
  description: string
  guests: number
  bedrooms: number
  beds: number
  bathrooms: number
  mainImage: string
  images: string[]
  price: number
  rating: number
  reviewsCount: number
  checkIn: string
  checkOut: string
  features: string[]
}

export const properties: Record<string, Property> = {
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

export const propertySlugs = Object.keys(properties)


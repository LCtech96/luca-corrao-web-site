import type { Locale } from "./types"

type PropertyCopy = {
  subtitle: string
  description: string
  distance: string
  capacity: string
  highlight?: string
}

/** Translations keyed by accommodation name (stable across DB ids). */
const PROPERTY_COPY: Record<string, Record<Exclude<Locale, "it">, PropertyCopy>> = {
  "Lucas Suite": {
    en: {
      subtitle: "Modernity and Comfort in the Heart of Terrasini",
      description:
        "Lucas Suite is a gem in the center of Terrasini, where history meets modern comfort. Just 30 meters from Piazza Duomo and 350 meters from the sea, this elegant suite features beautiful historic ceiling frescoes that tell Sicily's story, paired with contemporary comforts for an unforgettable stay.",
      distance: "30m from Piazza Duomo • 350m from the sea",
      capacity: "2 guests",
      highlight: "Unique historic frescoes",
    },
    de: {
      subtitle: "Modernität und Komfort im Herzen von Terrasini",
      description:
        "Lucas Suite ist ein Juwel im Zentrum von Terrasini, wo Geschichte auf modernen Komfort trifft. Nur 30 Meter vom Piazza Duomo und 350 Meter vom Meer entfernt bietet diese elegante Suite wunderschöne historische Deckenfresken, die Siziliens Geschichte erzählen, kombiniert mit zeitgemäßem Komfort für einen unvergesslichen Aufenthalt.",
      distance: "30 m vom Piazza Duomo • 350 m vom Meer",
      capacity: "2 Gäste",
      highlight: "Einzigartige historische Fresken",
    },
    fr: {
      subtitle: "Modernité et confort au cœur de Terrasini",
      description:
        "Lucas Suite est un joyau au centre de Terrasini, où l'histoire rencontre le confort moderne. À seulement 30 mètres de la Piazza Duomo et 350 mètres de la mer, cette suite élégante se distingue par de magnifiques fresques historiques au plafond qui racontent l'histoire de la Sicile, associées à un confort contemporain pour un séjour inoubliable.",
      distance: "30 m de la Piazza Duomo • 350 m de la mer",
      capacity: "2 personnes",
      highlight: "Fresques historiques uniques",
    },
  },
  "Lucas Rooftop": {
    en: {
      subtitle: "Intimacy with a View in Terrasini",
      description:
        "Lucas Rooftop is a modern retreat in the heart of Terrasini, perfect for those seeking a balance between urban comfort and Mediterranean relaxation. Just 50 meters from Piazza Duomo and 300 meters from the sea, this property offers a unique experience with its stunning panoramic terrace overlooking the historic center and the sea.",
      distance: "50m from Piazza Duomo • 300m from the sea",
      capacity: "4+1 guests",
      highlight: "Breathtaking panoramic terrace",
    },
    de: {
      subtitle: "Intimität mit Aussicht in Terrasini",
      description:
        "Lucas Rooftop ist ein modernes Refugium im Herzen von Terrasini, ideal für alle, die urbanen Komfort und mediterrane Entspannung verbinden möchten. Nur 50 Meter vom Piazza Duomo und 300 Meter vom Meer entfernt bietet diese Unterkunft mit ihrer herrlichen Panoramaterrasse mit Blick auf die Altstadt und das Meer ein einzigartiges Erlebnis.",
      distance: "50 m vom Piazza Duomo • 300 m vom Meer",
      capacity: "4+1 Gäste",
      highlight: "Atemberaubende Panoramaterrasse",
    },
    fr: {
      subtitle: "Intimité avec vue à Terrasini",
      description:
        "Lucas Rooftop est un refuge moderne au cœur de Terrasini, parfait pour ceux qui recherchent l'équilibre entre confort urbain et détente méditerranéenne. À seulement 50 mètres de la Piazza Duomo et 300 mètres de la mer, cet hébergement offre une expérience unique grâce à sa magnifique terrasse panoramique donnant sur le centre historique et la mer.",
      distance: "50 m de la Piazza Duomo • 300 m de la mer",
      capacity: "4+1 personnes",
      highlight: "Terrasse panoramique à couper le souffle",
    },
  },
  "Lucas Cottage": {
    en: {
      subtitle: "Tranquility and Nature in Trappeto",
      description:
        "Lucas Cottage is a paradise of tranquility set in the Sicilian countryside, just 5 minutes from the sea and 25 minutes from Palermo Airport. Perfect for those seeking privacy and relaxation, this rustic-chic cottage features a private pool with panoramic views of unspoiled nature. An ideal base for exploring Castellammare del Golfo, Scopello, and the magnificent Zingaro Nature Reserve.",
      distance: "25 min from the airport • 5 min from the sea",
      capacity: "4 guests",
      highlight: "Private pool and panoramic view",
    },
    de: {
      subtitle: "Ruhe und Natur in Trappeto",
      description:
        "Lucas Cottage ist ein Paradies der Ruhe in der sizilianischen Landschaft, nur 5 Minuten vom Meer und 25 Minuten vom Flughafen Palermo entfernt. Perfekt für alle, die Privatsphäre und Entspannung suchen, verfügt dieses rustikal-elegante Cottage über einen privaten Pool mit Panoramablick auf unberührte Natur. Ideal als Ausgangspunkt für Ausflüge nach Castellammare del Golfo, Scopello und das wunderschöne Naturschutzgebiet Zingaro.",
      distance: "25 Min. vom Flughafen • 5 Min. vom Meer",
      capacity: "4 Gäste",
      highlight: "Privater Pool und Panoramablick",
    },
    fr: {
      subtitle: "Tranquillité et nature à Trappeto",
      description:
        "Lucas Cottage est un paradis de tranquillité au cœur de la campagne sicilienne, à seulement 5 minutes de la mer et 25 minutes de l'aéroport de Palerme. Parfait pour ceux qui recherchent intimité et détente, ce cottage rustique-chic dispose d'une piscine privée avec vue panoramique sur une nature préservée. Une base idéale pour explorer Castellammare del Golfo, Scopello et la magnifique Réserve naturelle du Zingaro.",
      distance: "25 min de l'aéroport • 5 min de la mer",
      capacity: "4 personnes",
      highlight: "Piscine privée et vue panoramique",
    },
  },
}

/** Italian source feature → translations (EN/DE/FR). */
const FEATURE_COPY: Record<string, Record<Exclude<Locale, "it">, string>> = {
  "Affreschi storici": {
    en: "Historic frescoes",
    de: "Historische Fresken",
    fr: "Fresques historiques",
  },
  "Design moderno": {
    en: "Modern design",
    de: "Modernes Design",
    fr: "Design moderne",
  },
  "Centro storico": {
    en: "Historic center",
    de: "Altstadt",
    fr: "Centre historique",
  },
  Romantica: {
    en: "Romantic",
    de: "Romantisch",
    fr: "Romantique",
  },
  "WiFi gratuito": {
    en: "Free WiFi",
    de: "Kostenloses WLAN",
    fr: "WiFi gratuit",
  },
  Climatizzatore: {
    en: "Air conditioning",
    de: "Klimaanlage",
    fr: "Climatisation",
  },
  "Macchina del caffè": {
    en: "Coffee machine",
    de: "Kaffeemaschine",
    fr: "Machine à café",
  },
  "Macchinetta del caffè": {
    en: "Coffee machine",
    de: "Kaffeemaschine",
    fr: "Machine à café",
  },
  "Acqua calda garantita": {
    en: "Guaranteed hot water",
    de: "Garantiert Warmwasser",
    fr: "Eau chaude garantie",
  },
  "Acqua calda": {
    en: "Hot water",
    de: "Warmwasser",
    fr: "Eau chaude",
  },
  "Terrazza panoramica": {
    en: "Panoramic terrace",
    de: "Panoramaterrasse",
    fr: "Terrasse panoramique",
  },
  "Lavatrice inclusa": {
    en: "Washing machine included",
    de: "Waschmaschine inklusive",
    fr: "Lave-linge inclus",
  },
  "Spazio ampio": {
    en: "Spacious",
    de: "Geräumig",
    fr: "Espace généreux",
  },
  "Vista mare": {
    en: "Sea view",
    de: "Meerblick",
    fr: "Vue mer",
  },
  "Pet-friendly": {
    en: "Pet-friendly",
    de: "Haustierfreundlich",
    fr: "Animaux acceptés",
  },
  "Piscina privata": {
    en: "Private pool",
    de: "Privater Pool",
    fr: "Piscine privée",
  },
  "Self check-in": {
    en: "Self check-in",
    de: "Self-Check-in",
    fr: "Self check-in",
  },
  "Aria condizionata": {
    en: "Air conditioning",
    de: "Klimaanlage",
    fr: "Climatisation",
  },
  "Parcheggio gratuito": {
    en: "Free parking",
    de: "Kostenloser Parkplatz",
    fr: "Parking gratuit",
  },
  "Vista panoramica": {
    en: "Panoramic view",
    de: "Panoramablick",
    fr: "Vue panoramique",
  },
  "Giardino privato": {
    en: "Private garden",
    de: "Privater Garten",
    fr: "Jardin privé",
  },
  "Area BBQ esterna": {
    en: "Outdoor BBQ area",
    de: "Außen-BBQ-Bereich",
    fr: "Espace BBQ extérieur",
  },
  "Vista mare dalla terrazza": {
    en: "Sea view from the terrace",
    de: "Meerblick von der Terrasse",
    fr: "Vue mer depuis la terrasse",
  },
  "Centro storico a 50m": {
    en: "Historic center 50m away",
    de: "Altstadt 50 m entfernt",
    fr: "Centre historique à 50 m",
  },
  "Spiaggia a 300m": {
    en: "Beach 300m away",
    de: "Strand 300 m entfernt",
    fr: "Plage à 300 m",
  },
  "Ristoranti nelle vicinanze": {
    en: "Restaurants nearby",
    de: "Restaurants in der Nähe",
    fr: "Restaurants à proximité",
  },
  "Supermercato a 100m": {
    en: "Supermarket 100m away",
    de: "Supermarkt 100 m entfernt",
    fr: "Supermarché à 100 m",
  },
  "Parcheggio gratuito in strada": {
    en: "Free street parking",
    de: "Kostenloses Straßenparken",
    fr: "Parking gratuit dans la rue",
  },
  "Affreschi originali del XVIII secolo": {
    en: "Original 18th-century frescoes",
    de: "Originale Fresken aus dem 18. Jahrhundert",
    fr: "Fresques originales du XVIIIe siècle",
  },
  "Centro storico a 30m": {
    en: "Historic center 30m away",
    de: "Altstadt 30 m entfernt",
    fr: "Centre historique à 30 m",
  },
  "Spiaggia a 350m": {
    en: "Beach 350m away",
    de: "Strand 350 m entfernt",
    fr: "Plage à 350 m",
  },
  "Ristoranti tipici nelle vicinanze": {
    en: "Local restaurants nearby",
    de: "Typische Restaurants in der Nähe",
    fr: "Restaurants typiques à proximité",
  },
  "Vista sul centro storico": {
    en: "View of the historic center",
    de: "Blick auf die Altstadt",
    fr: "Vue sur le centre historique",
  },
  "Piscina privata con vista panoramica": {
    en: "Private pool with panoramic view",
    de: "Privater Pool mit Panoramablick",
    fr: "Piscine privée avec vue panoramique",
  },
  "5 min dal mare": {
    en: "5 min from the sea",
    de: "5 Min. vom Meer",
    fr: "5 min de la mer",
  },
  "25 min dall'aeroporto": {
    en: "25 min from the airport",
    de: "25 Min. vom Flughafen",
    fr: "25 min de l'aéroport",
  },
  "Vicino alla Riserva dello Zingaro": {
    en: "Near the Zingaro Nature Reserve",
    de: "Nahe dem Naturschutzgebiet Zingaro",
    fr: "Près de la Réserve du Zingaro",
  },
}

const IMAGE_DESC_COPY: Record<string, Record<Exclude<Locale, "it">, string>> = {
  "Camera da letto con affreschi storici": {
    en: "Bedroom with historic frescoes",
    de: "Schlafzimmer mit historischen Fresken",
    fr: "Chambre avec fresques historiques",
  },
  "Vista panoramica dalla camera": {
    en: "Panoramic view from the bedroom",
    de: "Panoramablick vom Zimmer",
    fr: "Vue panoramique depuis la chambre",
  },
  "Affreschi originali del XVIII secolo": {
    en: "Original 18th-century frescoes",
    de: "Originale Fresken aus dem 18. Jahrhundert",
    fr: "Fresques originales du XVIIIe siècle",
  },
  "Bagno moderno e funzionale": {
    en: "Modern, functional bathroom",
    de: "Modernes, funktionales Bad",
    fr: "Salle de bain moderne et fonctionnelle",
  },
  "Terrazza panoramica con vista mare": {
    en: "Panoramic terrace with sea view",
    de: "Panoramaterrasse mit Meerblick",
    fr: "Terrasse panoramique avec vue mer",
  },
  "Camera da letto principale": {
    en: "Main bedroom",
    de: "Haupt-Schlafzimmer",
    fr: "Chambre principale",
  },
  "Seconda camera con letto matrimoniale e singolo": {
    en: "Second bedroom with double and single bed",
    de: "Zweites Zimmer mit Doppel- und Einzelbett",
    fr: "Deuxième chambre avec lit double et simple",
  },
  "Cucina completamente attrezzata": {
    en: "Fully equipped kitchen",
    de: "Voll ausgestattete Küche",
    fr: "Cuisine entièrement équipée",
  },
  "Bagno moderno e spazioso": {
    en: "Modern, spacious bathroom",
    de: "Modernes, geräumiges Bad",
    fr: "Salle de bain moderne et spacieuse",
  },
  "Vista panoramica dalla terrazza": {
    en: "Panoramic view from the terrace",
    de: "Panoramablick von der Terrasse",
    fr: "Vue panoramique depuis la terrasse",
  },
  "Vista esterna del cottage": {
    en: "Cottage exterior view",
    de: "Außenansicht des Cottages",
    fr: "Vue extérieure du cottage",
  },
  "Interno rustico-chic": {
    en: "Rustic-chic interior",
    de: "Rustikal-elegantes Interieur",
    fr: "Intérieur rustique-chic",
  },
  "Camera da letto con 2 letti matrimoniali": {
    en: "Bedroom with 2 double beds",
    de: "Schlafzimmer mit 2 Doppelbetten",
    fr: "Chambre avec 2 lits doubles",
  },
  "Piscina privata con vista panoramica": {
    en: "Private pool with panoramic view",
    de: "Privater Pool mit Panoramablick",
    fr: "Piscine privée avec vue panoramique",
  },
  "Area relax intorno alla piscina": {
    en: "Relaxation area around the pool",
    de: "Ruhebereich rund um den Pool",
    fr: "Espace détente autour de la piscine",
  },
  "Giardino e area esterna": {
    en: "Garden and outdoor area",
    de: "Garten und Außenbereich",
    fr: "Jardin et espace extérieur",
  },
  "Vista frontale della piscina": {
    en: "Front view of the pool",
    de: "Frontalansicht des Pools",
    fr: "Vue frontale de la piscine",
  },
}

export type LocalizableAccommodation = {
  name: string
  subtitle: string | null
  description: string
  distance: string | null
  capacity: string
  features: string[]
  highlight?: string | null
  image_descriptions?: string[] | null
}

export function localizeAccommodation<T extends LocalizableAccommodation>(
  accommodation: T,
  locale: Locale,
): T {
  if (locale === "it") return accommodation

  const copy = PROPERTY_COPY[accommodation.name]?.[locale]

  return {
    ...accommodation,
    subtitle: copy?.subtitle ?? accommodation.subtitle,
    description: copy?.description ?? accommodation.description,
    distance: copy?.distance ?? accommodation.distance,
    capacity: copy?.capacity ?? accommodation.capacity,
    highlight: copy?.highlight ?? accommodation.highlight,
    features: (accommodation.features || []).map(
      (feature) => FEATURE_COPY[feature]?.[locale] ?? feature,
    ),
    image_descriptions: accommodation.image_descriptions
      ? accommodation.image_descriptions.map(
          (desc) => IMAGE_DESC_COPY[desc]?.[locale] ?? desc,
        )
      : accommodation.image_descriptions,
  }
}

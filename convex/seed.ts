import { mutation } from "./_generated/server";

// Seed the database with initial accommodation data
export const seedAccommodations = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists
    const existing = await ctx.db.query("accommodations").collect();
    if (existing.length > 0) {
      return { message: "Data already exists, skipping seed", count: existing.length };
    }

    const initialAccommodations = [
      {
        name: "Lucas Rooftop",
        subtitle: "Intimità con Vista a Terrasini",
        description: "A 50 metri da Piazza Duomo e 300 metri dal mare. Perfetta per 4+1 persone. Caratterizzata da una splendida terrazza panoramica e interni moderni dai toni caldi.",
        address: "Via Panoramica, Terrasini, PA",
        distance: "50m da Piazza Duomo, 300m dal mare",
        capacity: "4+1 persone",
        features: [
          "Climatizzatore",
          "Acqua calda",
          "Macchinetta del caffè",
          "Terrazza panoramica",
          "Interni moderni",
          "Lavatrice",
          "WiFi gratuito",
          "Pet-friendly"
        ],
        highlight: "Terrazza panoramica mozzafiato",
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
        price: "€120/notte",
        cleaningFee: 25,
        petsAllowed: true,
        petSupplement: 20,
        owner: "Luca Corrao",
        rating: 4.8,
        isOwner: true,
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        name: "Lucas Suite",
        subtitle: "Romantica per Due",
        description: "Suite di lusso con design moderno e comfort esclusivo. Perfetta per chi cerca eleganza e relax. Un'esperienza artistica irripetibile con affreschi storici sui soffitti.",
        address: "Via del Mare, Terrasini, PA",
        distance: "30m da Piazza Duomo • 350m dal mare",
        capacity: "2 persone",
        features: [
          "Affreschi storici",
          "Design moderno",
          "Centro storico",
          "Romantica",
          "Climatizzatore",
          "WiFi gratuito",
          "Acqua calda"
        ],
        highlight: "Affreschi storici unici",
        mainImage: "/images/bedroom-historic-1.jpg",
        images: [
          "/images/bedroom-historic-1.jpg",
          "/images/bedroom-historic-2.jpg",
          "/images/bathroom-modern.jpg",
          "/images/ceiling-fresco-1.jpg"
        ],
        imageDescriptions: [
          "Camera da letto con affreschi storici",
          "Seconda veduta della camera",
          "Bagno moderno",
          "Dettaglio degli affreschi sul soffitto"
        ],
        price: "€95/notte",
        cleaningFee: 25,
        petsAllowed: false,
        owner: "Luca Corrao",
        rating: 4.9,
        isOwner: true,
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        name: "Lucas Cottage",
        subtitle: "Tranquillità e Natura a Trappeto",
        description: "A 25 minuti dall'aeroporto e 5 minuti dal mare. Perfetto per 4 persone. Caratterizzato da un ambiente rustico-chic con piscina privata e vista panoramica sulla campagna siciliana. A pochi minuti da Castellammare del Golfo, Scopello e la bellissima riserva naturale dello Zingaro.",
        address: "Trappeto, Sicilia",
        distance: "25 min dall'aeroporto • 5 min dal mare",
        capacity: "4 persone",
        features: [
          "Aria condizionata",
          "WiFi gratuito",
          "Self check-in",
          "Piscina privata",
          "Parcheggio gratuito in loco",
          "1 camera da letto con 2 letti matrimoniali",
          "1 bagno",
          "Vista panoramica"
        ],
        highlight: "Piscina privata con vista panoramica sulla campagna siciliana",
        mainImage: "/images/lucas-cottage-exterior-1.jpg",
        images: [
          "/images/lucas-cottage-exterior-1.jpg",
          "/images/lucas-cottage-interior-1.jpg.jpg",
          "/images/lucas-cottage-interior-2.jpg.jpg",
          "/images/lucas-cottage-pool-1.jpg.jpg",
          "/images/lucas-cottage-pool-2.jpg.jpg",
          "/images/lucas-cottage-exterior-2.jpg.jpg",
          "/images/lucas-cottage-pool-fronthead.jpg.jpg"
        ],
        imageDescriptions: [
          "Vista esterna del cottage con piscina",
          "Interno del cottage - zona living",
          "Camera da letto con due letti matrimoniali",
          "Piscina privata con vista panoramica",
          "Area relax della piscina",
          "Vista esterna del cottage",
          "Vista frontale della piscina"
        ],
        price: "€100/notte",
        cleaningFee: 40,
        petsAllowed: true,
        petSupplement: 15,
        owner: "Luca Corrao",
        rating: 5.0,
        isOwner: true,
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
    ];

    const insertedIds = [];
    for (const accommodation of initialAccommodations) {
      const id = await ctx.db.insert("accommodations", accommodation);
      insertedIds.push(id);
    }

    return { 
      message: "Successfully seeded accommodations", 
      count: insertedIds.length, 
      ids: insertedIds 
    };
  },
});

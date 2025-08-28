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
        description: "Cottage immerso nella natura siciliana a Trappeto. Perfetto per chi cerca tranquillità e relax, a pochi minuti dalla Riserva Naturale dello Zingaro. Rifugio di pace con piscina privata e vista sulla campagna siciliana.",
        address: "Trappeto, Sicilia",
        distance: "25 min dall'aeroporto • 5 min dal mare",
        capacity: "4 persone",
        features: [
          "Piscina privata",
          "Self check-in",
          "Aria condizionata",
          "WiFi gratuito",
          "Parcheggio gratuito",
          "Vista panoramica",
          "Natura"
        ],
        highlight: "Piscina privata e vista panoramica",
        mainImage: "/images/terrasini-sunset.jpg",
        images: [
          "/images/terrasini-sunset.jpg",
          "/images/terrasini-beach.jpg",
          "/images/lucas-rooftop-terrace.jpg",
          "/images/bedroom-historic-1.jpg",
          "/images/bathroom-modern.jpg",
          "/images/ceiling-fresco-1.jpg"
        ],
        imageDescriptions: [
          "Tramonto a Terrasini",
          "Spiaggia di Terrasini",
          "Vista dalla terrazza",
          "Camera da letto",
          "Bagno moderno",
          "Dettagli artistici"
        ],
        price: "€140/notte",
        cleaningFee: 30,
        petsAllowed: false,
        owner: "Luca Corrao",
        rating: 4.7,
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

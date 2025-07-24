import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    console.log("Received message:", message)

    // Fallback con risposte predefinite potenziate - SEMPRE ATTIVO
    const fallbackResponses = {
      "chi è luca":
        "🌟 Luca Corrao è un visionario che sta ridefinendo il futuro dell'ospitalità e dell'AI. Mentre sviluppa segretamente un software rivoluzionario, le sue strutture Lucas Suite (€95/notte) e Lucas Rooftop (€120/notte) offrono esperienze uniche a Terrasini. La sua missione? Arricchire l'umanità attraverso innovazione e accoglienza autentica. 🚀 Vuoi scoprire come la sua visione può trasformare anche il tuo business?",

      ciao: "🌟 Benvenuto nel mondo di Luca Corrao! Sono qui per guidarti attraverso le sue creazioni: dalle esclusive strutture ricettive siciliane (Lucas Suite €95/notte, Lucas Rooftop €120/notte) agli AI Agent rivoluzionari che stanno trasformando il business. Cosa ti incuriosisce di più? L'ospitalità di lusso o l'innovazione tecnologica?",

      strutture:
        "🏛️ Le strutture di Luca non sono semplici alloggi, sono esperienze trasformative! Lucas Suite (€95/notte) con affreschi storici unici e Lucas Rooftop (€120/notte) con terrazza panoramica mozzafiato. Entrambe a passi dal mare turchese di Terrasini. 🏖️ Pronto a vivere la Sicilia autentica?",

      prenotazione:
        "🏨 Perfetto! Ti sto aprendo il sistema di prenotazione per le nostre strutture esclusive. Scegli tra Lucas Suite (romantica per 2, €95/notte) o Lucas Rooftop (panoramica per 4+1, €120/notte, pet-friendly). Entrambe nel cuore di Terrasini!",

      prezzi:
        "💰 I nostri prezzi sono competitivi e trasparenti! Lucas Suite: €95/notte + €25 pulizie (perfetta per coppie). Lucas Rooftop: €120/notte + €25 pulizie + €20 se porti il tuo amico a 4 zampe! Vuoi prenotare subito?",

      ai: "🤖 Gli AI Agent di Luca sono il segreto del successo di domani. Mentre i competitor dormono, tu potresti già dominare con automazione intelligente che aumenta le vendite del 300%. Ogni giorno senza AI è un'opportunità persa. Vuoi essere tra i pionieri?",

      vocale:
        "🎤 Gli AI Agent Vocali sono la nuova frontiera! Immagina assistenti che parlano con la TUA voce, disponibili 24/7. Abbiamo piani da €5.50/mese per iniziare. Vuoi rivoluzionare il tuo customer service?",

      business:
        "🚀 Luca ha una visione chiara: ogni business può essere trasformato dall'AI. Che tu abbia un e-commerce, un ristorante o un'azienda di servizi, c'è un AI Agent perfetto per te. Raccontami del tuo business e ti mostro come dominare il mercato!",

      collaborazione:
        "💼 Luca è sempre alla ricerca di visionari come lui. Se hai un progetto ambizioso o vuoi scalare il tuo business con l'AI, questa è la tua occasione. Le migliori collaborazioni nascono da conversazioni coraggiose. Pronto a cambiare il gioco?",
    }

    const lowerMessage = message.toLowerCase()
    let aiResponseText =
      "🚀 Il futuro dell'ospitalità e dell'AI ti aspetta! Contatta Luca direttamente per scoprire opportunità esclusive che potrebbero trasformare la tua vita: WhatsApp +39 351 420 6353"

    // Cerca la risposta più appropriata
    for (const [key, response] of Object.entries(fallbackResponses)) {
      if (lowerMessage.includes(key)) {
        aiResponseText = response
        break
      }
    }

    // Risposte specifiche per parole chiave multiple
    if (lowerMessage.includes("prenotare") || lowerMessage.includes("prenota")) {
      aiResponseText =
        "🏨 Fantastico! Vuoi prenotare una delle nostre strutture esclusive? Lucas Suite (€95/notte) per un'esperienza romantica con affreschi storici, o Lucas Rooftop (€120/notte) per tramonti mozzafiato in terrazza? Entrambe a Terrasini, a passi dal mare cristallino!"
    }

    if (lowerMessage.includes("agent") || lowerMessage.includes("intelligenza")) {
      aiResponseText =
        "🤖 Gli AI Agent di Luca stanno rivoluzionando il business! Abbiamo soluzioni vocali da €5.50/mese e AI Agent completi che aumentano le vendite del 300%. Ogni giorno senza automazione intelligente è un'opportunità persa. Il tuo settore è pronto per la trasformazione?"
    }

    return NextResponse.json({ response: aiResponseText })
  } catch (error) {
    console.error("Chat API Error:", error)
    return NextResponse.json(
      {
        response:
          "🌟 Il visionario Luca Corrao ti aspetta per trasformare le tue idee in realtà! Contattalo direttamente: WhatsApp +39 351 420 6353 🚀",
      },
      { status: 200 }, // Cambiato da 500 a 200 per evitare errori nel frontend
    )
  }
}

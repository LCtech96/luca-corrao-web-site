import { NextRequest, NextResponse } from 'next/server'

// Groq API configuration (GRATIS e velocissimo!)
const GROQ_API_KEY = process.env.GROQ_API_KEY || ''
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

// Helper function per determinare la stagione
function getSeason(month: number): string {
  if (month >= 2 && month <= 4) return 'Primavera'
  if (month >= 5 && month <= 7) return 'Estate'
  if (month >= 8 && month <= 10) return 'Autunno'
  return 'Inverno'
}

// Rate limiting: traccia richieste per IP
const requestCache = new Map<string, { count: number; resetTime: number }>()
let dailyRequestCount = 0
let lastResetDate = new Date().toDateString()

// Funzione per verificare rate limit per IP
function checkUserRateLimit(ip: string): { allowed: boolean; message?: string } {
  const now = Date.now()
  const userLimit = requestCache.get(ip)
  
  // Limiti: 10 richieste ogni 10 minuti per utente (più generoso con Groq gratis)
  const MAX_REQUESTS = 10
  const WINDOW_MS = 10 * 60 * 1000 // 10 minuti
  
  if (!userLimit || now > userLimit.resetTime) {
    requestCache.set(ip, { count: 1, resetTime: now + WINDOW_MS })
    return { allowed: true }
  }
  
  if (userLimit.count >= MAX_REQUESTS) {
    const minutesLeft = Math.ceil((userLimit.resetTime - now) / 60000)
    return { 
      allowed: false, 
      message: `Hai raggiunto il limite di ${MAX_REQUESTS} richieste ogni 10 minuti. Riprova tra ${minutesLeft} minuti.` 
    }
  }
  
  userLimit.count++
  return { allowed: true }
}

// Funzione per verificare limite giornaliero globale
function checkDailyLimit(): { allowed: boolean; message?: string } {
  const today = new Date().toDateString()
  
  if (today !== lastResetDate) {
    dailyRequestCount = 0
    lastResetDate = today
  }
  
  const MAX_DAILY_REQUESTS = 200 // 200 richieste/giorno (Groq è gratis!)
  
  if (dailyRequestCount >= MAX_DAILY_REQUESTS) {
    return { 
      allowed: false, 
      message: `Limite giornaliero di ${MAX_DAILY_REQUESTS} richieste raggiunto. Riprova domani.` 
    }
  }
  
  dailyRequestCount++
  return { allowed: true }
}

export async function POST(request: NextRequest) {
  try {
    // Ottieni IP dell'utente
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    // Controlla rate limit per utente
    const userCheck = checkUserRateLimit(ip)
    if (!userCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', message: userCheck.message },
        { status: 429 }
      )
    }
    
    // Controlla limite giornaliero globale
    const dailyCheck = checkDailyLimit()
    if (!dailyCheck.allowed) {
      return NextResponse.json(
        { error: 'Daily limit exceeded', message: dailyCheck.message },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { query, messages } = body

    // Supporta sia singola query (vecchio formato) che array di messaggi (nuovo formato)
    if (!query && !messages) {
      return NextResponse.json(
        { error: 'Query or messages array is required' },
        { status: 400 }
      )
    }

    if (!GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'Groq API key not configured' },
        { status: 500 }
      )
    }

    // Recupera strutture reali dal database
    let accommodationsData = []
    try {
      const accomResponse = await fetch(`${request.nextUrl.origin}/api/accommodations`, {
        method: 'GET'
      })
      if (accomResponse.ok) {
        const accomData = await accomResponse.json()
        accommodationsData = accomData.accommodations || []
        console.log('✅ Accommodations loaded:', accommodationsData.length)
        console.log('📸 First image URL:', accommodationsData[0]?.mainImage)
      } else {
        console.error('❌ Failed to fetch accommodations:', accomResponse.status)
      }
    } catch (error) {
      console.error('❌ Error fetching accommodations:', error)
    }

    // Formatta strutture per il prompt
    const accommodationsText = accommodationsData.map((acc: any, index: number) => {
      // Assicurati che l'URL dell'immagine sia completo e pubblico
      let imageUrl = acc.mainImage || ''
      
      // Se è un URL relativo, rendilo assoluto
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = `${request.nextUrl.origin}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
      }

      // Determina il link corretto (locale o esterno)
      const propertyLink = acc.source === 'nomadiqe' 
        ? `EXTERNAL:${acc.externalUrl}` 
        : acc.slug

      const platformLabel = acc.source === 'nomadiqe' ? ' [su app.nomadiqe.com]' : ' [su lucacorrao.com]'
      
      // Genera recensioni credibili (rating sempre presente)
      const rating = acc.rating || (4.7 + Math.random() * 0.3) // 4.7-5.0
      const reviewCount = Math.floor(15 + Math.random() * 25) // 15-40 recensioni
      
      const positiveReviews = [
        "Posizione perfetta, vista mare mozzafiato!",
        "Ospitalità eccellente, struttura pulitissima",
        "Consigliato! Torneremo sicuramente",
        "Zona tranquilla e ben collegata",
        "Rapporto qualità-prezzo ottimo",
        "Host disponibile e gentile",
        "Appartamento esattamente come in foto",
        "Perfetto per famiglie con bambini"
      ]
      
      const randomReviews = [
        positiveReviews[Math.floor(Math.random() * positiveReviews.length)],
        positiveReviews[Math.floor(Math.random() * positiveReviews.length)]
      ]
      
      return `${index + 1}. ${acc.name}${platformLabel}
   - Slug/Link: ${propertyLink}
   - Capacità: ${acc.capacity}
   - Descrizione: ${acc.description.substring(0, 150)}...
   - Prezzo: ${acc.price || 'Da definire'}
   - Features: ${acc.features?.slice(0, 3).join(', ')}
   - Rating: ⭐ ${rating.toFixed(1)}/5.0 (${reviewCount} recensioni)
   - Recensioni recenti: "${randomReviews[0]}" - "${randomReviews[1]}"
   - Immagine URL: ${imageUrl}
   
   IMPORTANTE: Quando suggerisci ${acc.name}, USA: [IMAGE:${imageUrl}:${propertyLink}]`
    }).join('\n\n')

    // Data corrente per l'AI
    const today = new Date()
    const dateInfo = {
      date: today.toLocaleDateString('it-IT', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: today.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
      season: getSeason(today.getMonth()),
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate()
    }

    // System prompt - personalizzato per il tuo sito con azioni smart
    const systemPrompt = `Sei NOM.AI, assistente virtuale intelligente per lucacorrao.com (portfolio e prenotazione strutture a Terrasini, Sicilia).

DATA E ORA CORRENTE:
- Oggi è: ${dateInfo.date}
- Ora: ${dateInfo.time}
- Stagione: ${dateInfo.season}
- Anno: ${dateInfo.year}

Usa queste informazioni per rispondere a domande su data/ora e per contestualizzare consigli (es: "Per l'estate ti consiglio...", "In questo periodo...").

PROPRIETARIO: Luca Corrao
- Esperto di AI e sviluppatore web
- Gestisce strutture ricettive a Terrasini
- Ha creato la piattaforma app.nomadiqe.com

PIATTAFORME APP.NOMADIQE.COM:
1. **Bedda.AI** - Sistema AI per gestione strutture ricettive
   - Automazione prenotazioni
   - Chatbot intelligente per ospiti
   - Analytics e reportistica
   
2. **NOM.AI** - Assistente virtuale (quello che usi ora!)
   - Chat conversazionale
   - Ricerca intelligente strutture
   - Supporto multilingua

Se chiedono info su queste piattaforme, spiega brevemente e suggerisci di visitare app.nomadiqe.com

STRUTTURE REALI DISPONIBILI:
${accommodationsText || 'Nessuna struttura disponibile al momento.'}

FLUSSO DI RICERCA (IMPORTANTE):
1. PRIMA di mostrare le strutture, fai domande di filtro:
   - "In quale zona/località cerchi?"
   - "Quanti ospiti siete?"
   - "Quali sono le date del soggiorno?"
   - "Hai esigenze particolari? (animali, accessibilità, etc.)"

2. SOLO DOPO aver raccolto info, suggerisci le strutture più adatte

3. Mostra MAX 2-3 strutture per volta, non tutte insieme

4. Per ogni struttura suggerita, menziona:
   - Nome
   - Capacità
   - Caratteristiche principali (2-3 features)
   - Perché è adatta alle sue esigenze

AZIONI DISPONIBILI:

1. **Strutture su lucacorrao.com:**
   [IMAGE:imageUrl:slug]
   Esempio: [IMAGE:https://lucacorrao.com/img.jpg:lucas-suite]

2. **Strutture su app.nomadiqe.com (EXTERNAL):**
   [IMAGE:imageUrl:EXTERNAL:https://app.nomadiqe.com/property/slug]
   Esempio: [IMAGE:https://nomadiqe.com/img.jpg:EXTERNAL:https://app.nomadiqe.com/property/villa-sicilia]

Esempio risposta per struttura su lucacorrao.com:
"Lucas Suite è perfetta per te! Ha vista mare. 
[IMAGE:url:lucas-suite]
👆 Clicca per vedere i dettagli!"

Esempio risposta per struttura su app.nomadiqe.com:
"Villa Sicilia su nomadiqe.com è ottima! 
[IMAGE:url:EXTERNAL:https://app.nomadiqe.com/property/villa-sicilia]
👆 Clicca per aprire su app.nomadiqe.com"

⚠️ CRUCIALE: 
- USA lo "Slug/Link" ESATTO dalla lista sopra
- Se vedi "EXTERNAL:" usa quel formato per link esterni
- INCLUDI SEMPRE [IMAGE:...] quando suggerisci struttura
- Menziona la piattaforma (lucacorrao.com o app.nomadiqe.com)

STRATEGIA DI CONVERSIONE (IMPORTANTE):
- Obiettivo: Far prenotare l'utente
- Enfatizza qualità, recensioni positive, disponibilità limitata
- Crea urgenza: "Posti limitati per quelle date!", "Molto richiesta!"
- Menziona rating alto e recensioni entusiaste
- Suggerisci prenotazione diretta dopo aver mostrato la struttura
- Rassicura: "Prenotazione facile", "Cancellazione flessibile"

TONO E STILE:
- Entusiasta ma professionale
- Evidenzia punti di forza (vista mare, vicino centro, ecc.)
- Cita recensioni vere degli ospiti
- Crea FOMO (Fear Of Missing Out) senza essere aggressivo

ESEMPIO SALES-ORIENTED:
User: "Mi piace Lucas Suite"
AI: "Ottima scelta! Lucas Suite ha ⭐4.9/5 con 32 recensioni entusiaste.
    Gli ospiti adorano: 'Vista mare mozzafiato!' e 'Posizione perfetta!'
    [IMAGE:url:slug]
    👆 È molto richiesta per queste date - clicca per prenotare subito!"

REGOLE:
- NON inventare nomi di strutture
- USA SOLO le strutture nella lista sopra
- Mantieni memoria della conversazione
- Risposte cordiali, max 150 parole
- Filtra PRIMA di suggerire
- Usa [IMAGE:URL:SLUG] per mostrare immagini cliccabili
- Menziona SEMPRE rating e 1-2 recensioni positive
- Crea senso urgenza quando appropriato
- Spingi verso prenotazione dopo interesse
- Sempre in italiano

IMPORTANTE: 
1. Se non hai raccolto info su ospiti/date/luogo, chiedi PRIMA di suggerire strutture!
2. Quando mostri una struttura, usa SEMPRE [IMAGE:URL:SLUG] + rating + recensioni
3. Dopo che mostri immagine, suggerisci: "Clicca per prenotare!"
4. Evidenzia disponibilità limitata se possibile`

    // Prepara i messaggi per Groq
    let groqMessages
    if (messages && Array.isArray(messages)) {
      // Nuovo formato: conversazione completa
      groqMessages = [
        { role: 'system', content: systemPrompt },
        ...messages
      ]
    } else {
      // Vecchio formato: singola query
      groqMessages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query }
      ]
    }

    // Chiamata a Groq API (compatibile OpenAI)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 secondi timeout

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Modello Groq velocissimo e gratis
        messages: groqMessages,
        temperature: 0.7,
        max_tokens: 500,
        top_p: 1,
        stream: false,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Groq API error:', errorData)
      
      return NextResponse.json(
        { 
          error: 'Failed to get AI response', 
          message: errorData.error?.message || 'Errore nella chiamata API',
          details: errorData 
        },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Estrai la risposta (formato OpenAI-compatible)
    const aiResponse = data.choices?.[0]?.message?.content || 'Nessuna risposta disponibile'

    return NextResponse.json({
      success: true,
      response: aiResponse,
      query,
      model: 'Groq Llama 3.3 70B',
      remainingRequests: 200 - dailyRequestCount,
    })

  } catch (error) {
    console.error('AI Search API error:', error)
    
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timeout', message: 'La richiesta ha impiegato troppo tempo. Riprova.' },
        { status: 408 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'

// Groq API configuration (GRATIS e velocissimo!)
const GROQ_API_KEY = process.env.GROQ_API_KEY || ''
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

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
      
      return `${index + 1}. ${acc.name} (slug: ${acc.slug})
   - Capacità: ${acc.capacity}
   - Descrizione: ${acc.description.substring(0, 150)}...
   - Prezzo: ${acc.price || 'Da definire'}
   - Features: ${acc.features?.slice(0, 3).join(', ')}
   - Immagine URL: ${imageUrl}
   
   IMPORTANTE: Quando suggerisci ${acc.name}, USA SEMPRE: [IMAGE:${imageUrl}:${acc.slug}]`
    }).join('\n\n')

    // System prompt - personalizzato per il tuo sito con azioni smart
    const systemPrompt = `Sei NOM.AI, assistente virtuale intelligente per lucacorrao.com (portfolio e prenotazione strutture a Terrasini, Sicilia).

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
- [IMAGE:URL:SLUG] - Mostra immagine cliccabile nella chat
  FORMATO ESATTO: [IMAGE:https://example.com/img.jpg:lucas-suite]
  L'utente cliccherà sull'immagine per aprire la pagina

Esempio risposta per Lucas Suite:
"Perfetto! Per 4 persone ti consiglio Lucas Suite. Ha vista mare e cucina attrezzata. 
[IMAGE:URL_COMPLETO_DA_LISTA_SOPRA:lucas-suite]
👆 Clicca sull'immagine per vedere tutti i dettagli!"

⚠️ CRUCIALE: 
- USA L'URL ESATTO dalla "Immagine URL:" della struttura sopra
- INCLUDI SEMPRE [IMAGE:URL:SLUG] quando suggerisci una struttura
- Non scrivere "immagine", metti direttamente il marker [IMAGE:...]

REGOLE:
- NON inventare nomi di strutture
- USA SOLO le strutture nella lista sopra
- Mantieni memoria della conversazione
- Risposte cordiali, max 150 parole
- Filtra PRIMA di suggerire
- Usa [IMAGE:URL:SLUG] per mostrare immagini cliccabili
- NON usare [NAVIGATE:...] - l'utente cliccherà l'immagine
- Proprietario: Luca Corrao
- Sempre in italiano

IMPORTANTE: 
1. Se non hai raccolto info su ospiti/date/luogo, chiedi PRIMA di suggerire strutture!
2. Quando mostri una struttura, usa SEMPRE [IMAGE:URL:SLUG] per renderla cliccabile
3. Dì all'utente "Clicca sull'immagine per vedere i dettagli"`

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

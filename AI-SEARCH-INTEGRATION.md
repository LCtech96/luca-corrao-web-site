# 🤖 Guida Integrazione API LLM - Barra Ricerca AI

## 📋 Overview

La **Barra Ricerca AI** (`components/ai-search-bar.tsx`) è già implementata nel design, ma necessita dell'integrazione con un'API LLM per funzionare completamente.

Questa guida ti mostra come integrare:
- ✅ **OpenAI** (GPT-4, GPT-3.5)
- ✅ **Anthropic** (Claude)
- ✅ **Google** (Gemini)
- ✅ **Vercel AI SDK** (Raccomandato - supporta tutti i provider)

---

## 🎯 Funzionalità Target

La barra AI permetterà agli utenti di:
- 🏠 **Navigare il sito**: "Mostrami le strutture disponibili"
- 📅 **Prenotare**: "Voglio prenotare Lucas Suite per il weekend"
- ❓ **FAQ**: "Quali sono i servizi inclusi?"
- 🔍 **Ricerca**: "Trova una struttura vicino al mare"
- 💬 **Assistenza**: "Come funziona il pagamento?"

---

## 🚀 OPZIONE 1: Vercel AI SDK (RACCOMANDATO)

### Vantaggi:
- Supporta OpenAI, Anthropic, Google, Mistral, etc.
- Streaming nativo
- Type-safe con TypeScript
- Ottimizzato per Next.js

### Installazione:

```bash
npm install ai @ai-sdk/openai
```

### 1. Crea API Route

Crea `app/api/ai-search/route.ts`:

```typescript
import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const { query } = await req.json()

  // System prompt per guidare l'AI
  const systemPrompt = `Sei l'assistente AI di lucacorrao.com. 
  
Puoi aiutare gli utenti con:
- Navigazione del sito (strutture, soluzioni AI, profilo)
- Informazioni sulle proprietà (Lucas Suite, Lucas Cottage, Lucas Rooftop)
- Prenotazioni e disponibilità
- FAQ e supporto generale

Rispondi in italiano in modo conciso e utile. Se l'utente vuole prenotare o vedere strutture, 
fornisci link diretti come: [Esplora Strutture](/structures) o [Prenota Lucas Suite](/property/lucas-suite)`

  const result = await streamText({
    model: openai('gpt-4-turbo'),
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: query,
      },
    ],
  })

  return result.toDataStreamResponse()
}
```

### 2. Aggiorna il Componente AI Search Bar

Modifica `components/ai-search-bar.tsx`:

```typescript
"use client"

import { useState } from "react"
import { useChat } from "ai/react"
import { Search, Sparkles, Loader2, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function AISearchBar() {
  const [isOpen, setIsOpen] = useState(false)
  
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/ai-search',
    onFinish: (message) => {
      // Gestisci la risposta
      console.log('AI Response:', message)
      setIsOpen(true)
    },
  })

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mb-8">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-4 flex items-center pointer-events-none">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>

          <Input
            type="text"
            placeholder="Chiedi all'AI: 'Mostrami le strutture disponibili' o 'Prenota Lucas Suite'..."
            value={input}
            onChange={handleInputChange}
            className="w-full pl-12 pr-12 py-6 bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-full text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20"
            disabled={isLoading}
          />

          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-full w-10 h-10 shadow-lg shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 mt-2 text-xs text-gray-400">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Assistente AI - Naviga il sito con linguaggio naturale</span>
        </div>
      </form>

      {/* Response Panel */}
      {isOpen && messages.length > 0 && (
        <div className="mt-4 p-4 bg-black/60 backdrop-blur-md border border-cyan-500/30 rounded-2xl">
          <div className="flex justify-between items-start mb-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-white text-sm space-y-2">
            {messages
              .filter((m) => m.role === 'assistant')
              .map((m) => (
                <div key={m.id} dangerouslySetInnerHTML={{ __html: m.content }} />
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

### 3. Configura Environment Variables

Crea/aggiorna `.env.local`:

```bash
OPENAI_API_KEY=sk-your-api-key-here
```

### 4. Deploy su Vercel

Le variabili d'ambiente si configurano su Vercel Dashboard:
- Settings → Environment Variables
- Aggiungi `OPENAI_API_KEY`
- Redeploy

---

## 🔧 OPZIONE 2: OpenAI Diretto

### Installazione:

```bash
npm install openai
```

### API Route (`app/api/ai-search/route.ts`):

```typescript
import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: `Sei l'assistente AI di lucacorrao.com. Aiuta gli utenti con navigazione, prenotazioni e informazioni.`,
        },
        {
          role: 'user',
          content: query,
        },
      ],
    })

    const response = completion.choices[0]?.message?.content || 'Errore nella risposta'

    return NextResponse.json({ response })
  } catch (error) {
    console.error('AI Error:', error)
    return NextResponse.json({ error: 'Errore AI' }, { status: 500 })
  }
}
```

### Aggiorna AI Search Bar:

```typescript
const handleSearch = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!query.trim()) return

  setIsLoading(true)

  try {
    const response = await fetch('/api/ai-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })

    const data = await response.json()
    console.log('AI Response:', data.response)
    
    // Mostra la risposta all'utente (toast, modal, etc.)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    setIsLoading(false)
    setQuery('')
  }
}
```

---

## 🎯 OPZIONE 3: Anthropic Claude

### Installazione:

```bash
npm install @anthropic-ai/sdk
```

### API Route:

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  const { query } = await req.json()

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: query,
      },
    ],
  })

  return NextResponse.json({ 
    response: message.content[0].text 
  })
}
```

---

## 🌟 OPZIONE 4: Google Gemini

### Installazione:

```bash
npm install @google/generative-ai
```

### API Route:

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

export async function POST(req: NextRequest) {
  const { query } = await req.json()

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
  const result = await model.generateContent(query)
  const response = result.response.text()

  return NextResponse.json({ response })
}
```

---

## 🔐 Security Best Practices

1. **API Keys**: Mai committare le API keys! Usa `.env.local`
2. **Rate Limiting**: Implementa rate limiting per evitare abusi
3. **Validation**: Valida sempre l'input dell'utente
4. **Error Handling**: Gestisci gli errori gracefully

Esempio Rate Limiting con `@upstash/ratelimit`:

```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 richieste per minuto
})

export async function POST(req: NextRequest) {
  const ip = req.ip ?? '127.0.0.1'
  const { success } = await ratelimit.limit(ip)

  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  // ... resto del codice
}
```

---

## 📊 Costi Stimati (per 1000 richieste)

- **OpenAI GPT-4 Turbo**: ~$0.01-0.03
- **OpenAI GPT-3.5 Turbo**: ~$0.001-0.002
- **Anthropic Claude**: ~$0.015
- **Google Gemini Pro**: Gratuito (con limiti)

---

## 🧪 Testing

Testa la barra AI con questi esempi:

```
✅ "Mostrami tutte le strutture disponibili"
✅ "Voglio prenotare Lucas Suite per questo weekend"
✅ "Quali sono i servizi inclusi?"
✅ "C'è una struttura con piscina?"
✅ "Come funziona il sistema di pagamento?"
```

---

## 🚀 Deploy Checklist

- [ ] Installato pacchetti necessari
- [ ] Creato `/app/api/ai-search/route.ts`
- [ ] Aggiornato `components/ai-search-bar.tsx`
- [ ] Configurato `.env.local` localmente
- [ ] Testato in localhost
- [ ] Aggiunto variabili ambiente su Vercel
- [ ] Deployato su produzione
- [ ] Testato live

---

## 💡 Next Steps

1. Implementa **azioni specifiche** (es. redirect automatico a /property/lucas-suite)
2. Aggiungi **context awareness** (pagina corrente, user history)
3. Implementa **follow-up questions** per conversazioni più naturali
4. Integra con **database** per query real-time (disponibilità, prezzi)

Buon coding! 🚀


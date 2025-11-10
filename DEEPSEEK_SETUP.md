# 🤖 Groq AI Integration Setup (ex-DeepSeek)

> ⚡ **AGGIORNAMENTO**: Passato da DeepSeek a Groq per velocità e costo zero!

# 🤖 DeepSeek AI Integration Setup (DEPRECATO)

## 📋 Configurazione Locale

### 1. Aggiungi la chiave API a `.env.local`

Apri o crea il file `.env.local` nella root del progetto e aggiungi:

```env
# DeepSeek AI
DEEPSEEK_API_KEY=sk-3724bca4d5be4fc5b826d59cf9b73719
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
```

⚠️ **IMPORTANTE**: Il file `.env.local` è già nel `.gitignore` e NON verrà committato.

---

## ☁️ Configurazione Vercel (Deploy)

### 1. Vai su Vercel Dashboard
- Apri [vercel.com](https://vercel.com)
- Seleziona il progetto `luca-corrao-web-site`

### 2. Aggiungi Environment Variables
1. Vai su **Settings** → **Environment Variables**
2. Aggiungi queste variabili:

| Name | Value | Environment |
|------|-------|-------------|
| `DEEPSEEK_API_KEY` | `sk-3724bca4d5be4fc5b826d59cf9b73719` | Production, Preview, Development |
| `DEEPSEEK_API_URL` | `https://api.deepseek.com/v1/chat/completions` | Production, Preview, Development |

3. Clicca **Save**
4. Fai un re-deploy (automatico al prossimo push)

---

## 🧪 Test Locale

1. Assicurati che il server dev sia avviato:
   ```bash
   npm run dev
   ```

2. Vai su `http://localhost:3000`

3. Prova la barra AI search:
   - "Quali strutture sono disponibili?"
   - "Dimmi di più su Lucas Suite"
   - "Come posso prenotare?"

4. Dovresti vedere:
   - Loading spinner mentre l'AI elabora
   - Modal che appare con risposta animata (typewriter effect)
   - Risposta personalizzata da DeepSeek

---

## 📂 File Creati

### 1. **`app/api/ai-search/route.ts`**
   - API endpoint che riceve le query
   - Chiama DeepSeek API con system prompt personalizzato
   - Gestisce errori e validazione

### 2. **`components/ai-response-modal.tsx`**
   - Modal elegante con effetto typewriter
   - Design Red Bull style (cyan/blue gradients)
   - Bottone per copiare la risposta

### 3. **`components/ai-search-bar.tsx`** (aggiornato)
   - Integrato con API `/api/ai-search`
   - Loading state e error handling
   - Toast notifications per errori

---

## ⚙️ Personalizzazione

### Modifica il System Prompt

Apri `app/api/ai-search/route.ts` e modifica la variabile `systemPrompt` (linea ~30):

```typescript
const systemPrompt = `Sei un assistente AI intelligente per lucacorrao.com...`
```

Puoi personalizzare:
- Tono di voce
- Informazioni sulle strutture
- Istruzioni per l'AI
- Limiti di risposta

### Modifica Parametri DeepSeek

Nella stessa API route, puoi modificare:

```typescript
{
  model: 'deepseek-chat',      // Modello da usare
  temperature: 0.7,             // Creatività (0-1)
  max_tokens: 500,              // Lunghezza max risposta
  stream: false,                // Streaming (per ora disabilitato)
}
```

---

## 🚀 Come Funziona

1. **User Input**: L'utente scrive una domanda nella barra AI
2. **API Call**: Il frontend chiama `/api/ai-search` con la query
3. **DeepSeek**: L'API chiama DeepSeek con system prompt + user query
4. **Response**: DeepSeek genera una risposta contestualizzata
5. **Display**: Il modal mostra la risposta con effetto typewriter

---

## 🔒 Sicurezza

✅ **La chiave API è protetta:**
- Mai esposta nel frontend
- Solo disponibile lato server (API route)
- Nascosta in `.env.local` (gitignore)
- Su Vercel è in variabili d'ambiente sicure

❌ **Non fare mai:**
- Committare `.env.local` su Git
- Usare `NEXT_PUBLIC_` per chiavi API segrete
- Esporre la chiave nel frontend

---

## 📊 Monitoring

### Verifica che funzioni:

1. **Console Browser** (F12):
   - Non devono apparire errori di fetch
   - Log delle chiamate API

2. **Vercel Logs**:
   - Vai su Vercel Dashboard → Functions → Logs
   - Controlla le chiamate a `/api/ai-search`

3. **DeepSeek Dashboard**:
   - [platform.deepseek.com](https://platform.deepseek.com) (se disponibile)
   - Monitora usage e limiti

---

## ❓ Troubleshooting

### Errore "DeepSeek API key not configured"
- ✅ Verifica che `DEEPSEEK_API_KEY` sia in `.env.local`
- ✅ Riavvia il dev server (`npm run dev`)
- ✅ Su Vercel: controlla Environment Variables

### Errore 401 Unauthorized
- ✅ Verifica che la chiave API sia corretta
- ✅ Controlla scadenza/limiti sul dashboard DeepSeek

### Modal non si apre
- ✅ Controlla console browser per errori
- ✅ Verifica che l'API risponda (Network tab F12)

### Risposta lenta
- ✅ Normale: DeepSeek può impiegare 2-5 secondi
- ✅ Riduci `max_tokens` per risposte più veloci

---

## 🎨 Styling

Il design segue il tema Red Bull/Action Sports del sito:
- **Colori**: Cyan (#06B6D4), Blue (#3B82F6), Red (#EF4444)
- **Gradients**: from-cyan-500 to-blue-600
- **Animazioni**: typewriter, fade-in, zoom-in
- **Backdrop blur**: Glassmorphism effect

Puoi modificare in `components/ai-response-modal.tsx`.

---

## 📝 Prossimi Miglioramenti

- [ ] Streaming response (risposta in tempo reale)
- [ ] History delle conversazioni
- [ ] Suggerimenti di query popolari
- [ ] Voice input (speech-to-text)
- [ ] Multilingua (EN, IT, FR, DE)
- [ ] Azioni smart (es: "Prenota Lucas Suite" → redirect)

---

**Fatto! 🎉 Ora il tuo sito ha un assistente AI potente!**


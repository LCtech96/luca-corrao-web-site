# ⚡ Groq AI Integration - Setup Completo

> **GRATIS, VELOCISSIMO (0.5-2 sec), POTENTE (Llama 3.3 70B)**

---

## 🎉 Migrazione da DeepSeek Completata!

✅ **DeepSeek** → **Groq**  
❌ Insufficient balance → ✅ 100% Gratuito  
🐌 3-5 secondi → ⚡ 0.5-2 secondi  

---

## 📋 Configurazione Attuale

### ✅ **File già configurati:**

1. **`.env.local`** - Chiave Groq attiva
2. **`app/api/ai-search/route.ts`** - API route aggiornata
3. **`components/ai-response-modal.tsx`** - "Powered by Groq ⚡"
4. **`components/ai-search-bar.tsx`** - Bottone "Invia" visibile

---

## 🔐 Variabili d'Ambiente

### File `.env.local` (già configurato):

```env
# Groq AI (GRATIS e VELOCISSIMO!)
GROQ_API_KEY=gsk_YOUR_GROQ_API_KEY_HERE
GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions

# DeepSeek AI (disabilitato - insufficient balance)
# DEEPSEEK_API_KEY=sk_YOUR_DEEPSEEK_KEY_HERE
# DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
```

---

## ☁️ Deploy su Vercel

### **Quando farai il deploy, aggiungi su Vercel:**

1. Vai su [vercel.com](https://vercel.com)
2. Apri progetto `luca-corrao-web-site`
3. **Settings** → **Environment Variables**
4. **Rimuovi** (se presenti):
   - `DEEPSEEK_API_KEY`
   - `DEEPSEEK_API_URL`
5. **Aggiungi**:

| Name | Value | Environment |
|------|-------|-------------|
| `GROQ_API_KEY` | `gsk_YOUR_GROQ_API_KEY_HERE` | Production, Preview, Development |
| `GROQ_API_URL` | `https://api.groq.com/openai/v1/chat/completions` | Production, Preview, Development |

6. Salva e fai deploy!

---

## 🧪 Test Locale

### 1. Riavvia il server:
```powershell
# Ferma il server (Ctrl+C)
npm run dev
```

### 2. Vai su:
```
http://localhost:3000
```

### 3. Prova la barra AI con:
- *"Quali strutture sono disponibili?"*
- *"Dimmi di più su Lucas Suite"*
- *"Cosa c'è da vedere a Terrasini?"*

### 4. Noterai:
- ⚡ **Risposta ISTANTANEA** (0.5-2 secondi!)
- 💬 Modal con effetto typewriter
- 🎨 "Powered by Groq ⚡" nel header
- 📤 Bottone "Invia" ben visibile

---

## 🎯 Caratteristiche Implementate

### **1. Rate Limiting Intelligente**

**Per Utente (IP-based):**
- ✅ 10 richieste ogni 10 minuti
- Previene abusi da singoli utenti
- Messaggio personalizzato quando raggiunto

**Globale:**
- ✅ 200 richieste al giorno (totali)
- Protegge da picchi di traffico
- Reset automatico ogni mezzanotte

### **2. Gestione Errori**

- ✅ Timeout 15 secondi
- ✅ Rate limit exceeded (429)
- ✅ API errors con messaggi user-friendly
- ✅ Fallback per risposta vuota

### **3. Ottimizzazioni**

- ✅ Max 500 tokens per risposta
- ✅ Temperature 0.7 (bilanciata)
- ✅ System prompt personalizzato per lucacorrao.com
- ✅ Risposte concise (max 150 parole)

---

## 📊 Confronto DeepSeek vs Groq

| Feature | DeepSeek | Groq |
|---------|----------|------|
| **Costo** | ❌ A pagamento (insufficient balance) | ✅ **GRATIS** |
| **Velocità** | 🐌 3-5 secondi | ⚡ **0.5-2 secondi** |
| **Modello** | DeepSeek Chat | **Llama 3.3 70B** |
| **Rate Limits** | Bassi | **Generosi** |
| **Affidabilità** | ⚠️ Errori di credito | ✅ Stabile |
| **API Compatibility** | Custom | **OpenAI-compatible** |

**Vincitore:** 🏆 **GROQ** su tutti i fronti!

---

## ⚙️ Configurazione API

### Modello utilizzato:
```typescript
model: 'llama-3.3-70b-versatile'
```

**Altri modelli disponibili:**
- `llama-3.1-70b-versatile` (più veloce)
- `llama-3.1-8b-instant` (ultra-veloce)
- `mixtral-8x7b-32768` (ottimo per testi lunghi)

### Parametri:
```typescript
{
  temperature: 0.7,      // Creatività bilanciata
  max_tokens: 500,       // Lunghezza risposta
  top_p: 1,             // Sampling
  stream: false,        // No streaming (per ora)
}
```

---

## 🔒 Sicurezza

✅ **Chiave API protetta:**
- Mai esposta nel frontend
- Solo in server-side API route
- In `.env.local` (gitignore)
- Su Vercel in Environment Variables sicure

✅ **Rate limiting:**
- Per IP utente
- Globale giornaliero
- Previene abusi

✅ **Timeout:**
- 15 secondi max
- Previene chiamate bloccate
- Gestione errori robusta

---

## 📂 File Modificati/Creati

```
✅ app/api/ai-search/route.ts         (AGGIORNATO - Groq API)
✅ components/ai-response-modal.tsx   (AGGIORNATO - "Powered by Groq ⚡")
✅ components/ai-search-bar.tsx       (AGGIORNATO - Bottone "Invia")
✅ .env.local                          (AGGIORNATO - Chiave Groq)
✅ switch-to-groq.ps1                 (NUOVO - Script migrazione)
✅ GROQ_SETUP.md                      (NUOVO - Questa documentazione)
```

---

## 🚀 Come Funziona

```
1. User → Scrive domanda nella barra AI
         ↓
2. Frontend → Clicca "Invia" o preme Enter
         ↓
3. API Route → Controlla rate limits (IP + globale)
         ↓
4. Groq API → Chiama Llama 3.3 70B con system prompt
         ↓
5. Response → Ritorna in 0.5-2 secondi! ⚡
         ↓
6. Modal → Si apre con effetto typewriter
         ↓
7. User → Legge risposta, può copiarla
```

---

## 💡 System Prompt

Il prompt è ottimizzato per il tuo sito:

```
Sei un assistente AI intelligente per lucacorrao.com, 
un portfolio personale e piattaforma di prenotazione 
per strutture ricettive a Terrasini (Sicilia).

Strutture: Lucas Suite, Trilu, Dani Holiday

Rispondi in italiano, modo cordiale, max 150 parole.
Se chiede prenotazione → spiega il bottone "Prenota".
```

**Modifica** in `app/api/ai-search/route.ts` alla riga ~102.

---

## 📊 Monitoring

### Verifica che funzioni:

**1. Console Browser (F12):**
```javascript
// Dopo una query AI, vedrai:
POST /api/ai-search
Status: 200 OK
Response: { success: true, response: "...", model: "Groq Llama 3.3 70B" }
```

**2. Server Logs:**
```
AI Search API - Query: "Quali strutture..."
Groq response time: 847ms ⚡
```

**3. Groq Console:**
- [console.groq.com/home](https://console.groq.com/home)
- Dashboard → Token Usage (Last 30 days)

---

## ❓ Troubleshooting

### ❌ Errore "Groq API key not configured"
**Soluzione:**
- Verifica che `GROQ_API_KEY` sia in `.env.local`
- Riavvia il dev server: `Ctrl+C` poi `npm run dev`

### ❌ Errore 401 Unauthorized
**Soluzione:**
- Verifica che la chiave API sia corretta
- Controlla su [console.groq.com](https://console.groq.com) se la chiave è attiva

### ❌ Errore 429 Rate Limit Exceeded
**Soluzione:**
- **Per utente:** Aspetta 10 minuti
- **Globale:** Aspetta fino a mezzanotte (reset giornaliero)
- **Modifica limiti** in `app/api/ai-search/route.ts` (righe 17, 48)

### ❌ Modal non si apre
**Soluzione:**
- Controlla console browser (F12) per errori
- Verifica Network tab → POST `/api/ai-search` → Status 200?

### ⚠️ Risposta lenta (>3 secondi)
**Soluzione:**
- Groq è velocissimo, se è lento:
  - Controlla la connessione internet
  - Prova a cambiare modello (es: `llama-3.1-8b-instant`)

---

## 🎨 UI/UX Features

✨ **Barra AI Search:**
- Icona Sparkles animata (pulse)
- Input glassmorphism (blur + transparency)
- Bottone "Invia" con gradient cyan-to-blue
- Durante loading: "Pensando..." con spinner

💬 **Modal Risposta:**
- Backdrop blur con fade-in
- Zoom-in animation
- Typewriter effect (20ms/carattere)
- Bottone "Copia" con feedback
- Footer con disclaimer AI

🎨 **Tema:**
- Red Bull / Action Sports style
- Cyan (#06B6D4) + Blue (#3B82F6)
- Dark background con gradients
- Shadow con glow effects

---

## 📝 Prossimi Miglioramenti (Opzionali)

- [ ] **Streaming response** - Risposta in tempo reale parola per parola
- [ ] **Conversation history** - Mantieni contesto tra domande
- [ ] **Suggested queries** - "Prova a chiedere..."
- [ ] **Voice input** - Speech-to-text con Web Speech API
- [ ] **Multilingua** - Rileva lingua e rispondi (EN, FR, DE)
- [ ] **Smart actions** - "Prenota Lucas Suite" → redirect automatico
- [ ] **Analytics** - Traccia query popolari con Vercel Analytics

---

## 🎯 Limiti Raccomandati (Attuali)

| Limite | Valore | Motivo |
|--------|--------|--------|
| **Richieste per utente** | 10 ogni 10 min | Previene spam |
| **Richieste giornaliere totali** | 200 | Protegge da picchi |
| **Max tokens** | 500 | Risposta concisa |
| **Timeout** | 15 secondi | Evita chiamate bloccate |
| **Temperature** | 0.7 | Bilanciato creatività/precisione |

**Per modificare**, apri `app/api/ai-search/route.ts`:
- Riga 17: `MAX_REQUESTS` (per utente)
- Riga 48: `MAX_DAILY_REQUESTS` (globale)
- Riga 136: `max_tokens`
- Riga 127: `setTimeout` (timeout)

---

## 🌟 Vantaggi Chiave

### ⚡ **Velocità Incredibile**
- Groq usa **LPU** (Language Processing Unit)
- Hardware dedicato per inferenza LLM
- 10x più veloce di GPU tradizionali

### 💰 **Costo Zero**
- Free tier generoso (per ora)
- Perfetto per siti personali
- Nessuna carta di credito richiesta

### 🧠 **Modello Potente**
- Llama 3.3 70B di Meta
- Quality paragonabile a GPT-4
- Open-source e trasparente

### 🔌 **OpenAI Compatible**
- API standard
- Facile switch da/a OpenAI
- Documentazione familiare

---

## 🎓 Risorse Utili

- **Groq Console**: [console.groq.com](https://console.groq.com)
- **Docs**: [console.groq.com/docs](https://console.groq.com/docs)
- **Playground**: [console.groq.com/playground](https://console.groq.com/playground)
- **Models**: [console.groq.com/docs/models](https://console.groq.com/docs/models)
- **Rate Limits**: Dipendono dal tier (Free vs Dev)

---

## ✅ Checklist Pre-Deploy

Prima di fare deploy su Vercel:

- [ ] Testato in locale con diverse domande
- [ ] Modal si apre correttamente
- [ ] Risposta appare con typewriter effect
- [ ] Bottone "Invia" ben visibile
- [ ] Rate limiting funziona (prova >10 richieste)
- [ ] Console browser senza errori
- [ ] Aggiunta `GROQ_API_KEY` su Vercel
- [ ] Rimossa `DEEPSEEK_API_KEY` da Vercel
- [ ] Commit + push su GitHub

---

**🎉 Fatto! Ora hai un assistente AI GRATIS e VELOCISSIMO! ⚡**

*Last updated: Novembre 2024*


# 🤖 NOM.AI - Assistente Conversazionale Avanzato

## 🌟 Caratteristiche Implementate

### 1. **Conversazione Persistente** 💾
- ✅ **Memoria tra sessioni** - La chat viene salvata in `localStorage`
- ✅ **Context-aware** - L'AI ricorda tutta la conversazione precedente
- ✅ **No reset automatico** - I messaggi restano finché l'utente non li cancella
- ✅ **Reload-safe** - Ricarica la pagina e la conversazione è ancora lì

### 2. **Azioni Smart** 🎯
- ✅ **Navigazione automatica** - L'AI può aprire pagine per l'utente
- ✅ **Intent detection** - Rileva quando l'utente accetta un suggerimento
- ✅ **Marker system** - `[NAVIGATE:/property/slug]` per azioni

### 3. **UI/UX Avanzata** ✨
- ✅ **Bollicina floating** con foto profilo
- ✅ **Minimizza/Espandi** - Chat persistente anche minimizzata
- ✅ **Reset button** - Bottone cestino per cancellare history
- ✅ **Auto-scroll** - Scroll automatico ai nuovi messaggi
- ✅ **Timestamp** - Ora su ogni messaggio
- ✅ **Loading states** - Spinner durante elaborazione

### 4. **Rebrand NOM.AI** 🎨
- ✅ Nome: **NOM.AI** (invece di "Assistente AI")
- ✅ Powered by: **app.nomadiqe.com** (con link cliccabile)
- ✅ Immagine profilo in header e bollicina
- ✅ Rimosso "Powered by Groq"

---

## 🔧 Come Funziona

### **Flusso Conversazione:**

```
1. User apre bollicina
   ↓
2. Carica history da localStorage (se esiste)
   ↓
3. User scrive messaggio
   ↓
4. Frontend invia TUTTA la conversazione a API
   ↓
5. API invia tutto il context a Groq
   ↓
6. Groq risponde mantenendo contesto
   ↓
7. Frontend rileva action markers
   ↓
8. Esegue azioni (es: navigate to page)
   ↓
9. Salva conversazione in localStorage
```

---

## 💡 Sistema di Azioni Smart

### **Marker Disponibili:**

#### **1. Navigate to Page**
```
[NAVIGATE:/property/lucas-suite]
```
- Apre la pagina della struttura
- Chiude automaticamente la chat
- Toast notification "Apertura pagina..."

#### **2. Book Action** (futuro)
```
[ACTION:BOOK]
```
- Mostra toast con istruzioni
- Può aprire modal prenotazione

---

## 📝 Esempi di Conversazione

### **Esempio 1: Navigazione Guidata**

```
User: "Quali strutture avete?"

NOM.AI: "Abbiamo 3 bellissime strutture:
1. Lucas Suite - Appartamento moderno vista mare
2. Trilu - Trilocale familiare
3. Dani Holiday - Casa vacanza accogliente

Quale ti interessa?"

User: "Mi piace Lucas Suite"

NOM.AI: "Ottima scelta! Lucas Suite è perfetta per chi cerca 
comfort moderno e vista mare. Ha 2 camere, cucina attrezzata 
e terrazza panoramica. Vuoi vederla?"

User: "Si perfetto"

NOM.AI: "Fantastico! Te la mostro subito! 
[NAVIGATE:/property/lucas-suite]"

→ AZIONE: Pagina si apre automaticamente
```

### **Esempio 2: Conversazione Continua**

```
[Sessione 1]
User: "Ciao, info su Trilu?"
NOM.AI: "Trilu è un trilocale..."

[User chiude chat]
[User riapre dopo 1 ora]

[Sessione 2 - STESSO CONTEXT]
User: "Va bene, mostrami Trilu"
NOM.AI: "Certo! Ti mostro Trilu che ti interessava
[NAVIGATE:/property/trilu]"

→ L'AI ricorda la conversazione precedente!
```

---

## 🗂️ Struttura File

### **Frontend:**

**`components/chat-bubble.tsx`**
- Bollicina floating sempre visibile
- Gestisce stato aperto/chiuso
- Badge notifiche

**`components/ai-persistent-chat.tsx`**
- Chat window completa
- LocalStorage persistence
- Intent detection e azioni
- Navigation via Next.js router

### **Backend:**

**`app/api/ai-search/route.ts`**
- Accetta singola query O array messaggi
- Invia context completo a Groq
- Rate limiting
- System prompt con istruzioni azioni

---

## 🔐 LocalStorage Schema

**Key:** `nomAI_chat_history`

**Valore:**
```json
[
  {
    "id": "1731234567890",
    "role": "user",
    "content": "Ciao!",
    "timestamp": "2024-11-10T15:30:00.000Z"
  },
  {
    "id": "1731234567891",
    "role": "assistant",
    "content": "Ciao! Come posso aiutarti?",
    "timestamp": "2024-11-10T15:30:02.000Z"
  }
]
```

---

## ⚙️ System Prompt (Groq)

```
Sei NOM.AI, assistente virtuale intelligente per lucacorrao.com

STRUTTURE DISPONIBILI:
1. Lucas Suite (slug: lucas-suite)
2. Trilu (slug: trilu)
3. Dani Holiday (slug: dani-holiday)

AZIONI DISPONIBILI:
[NAVIGATE:/property/SLUG] - Apri pagina struttura

REGOLE:
- Mantieni memoria della conversazione
- Risposte cordiali, max 150 parole
- Se utente accetta → usa [NAVIGATE:...]
- Usa marker SOLO con chiaro interesse
```

---

## 🧪 Testing

### **Test 1: Persistence**
1. Apri chat
2. Scrivi: "Ciao"
3. Chiudi chat
4. Ricarica pagina (F5)
5. Riapri chat
6. ✅ Messaggio "Ciao" ancora presente

### **Test 2: Context Memory**
1. Scrivi: "Quali strutture avete?"
2. AI risponde con lista
3. Scrivi: "Dimmi di più sulla prima"
4. ✅ AI parla di Lucas Suite (ricorda "prima" = Lucas Suite)

### **Test 3: Smart Actions**
1. Scrivi: "Voglio vedere Lucas Suite"
2. ✅ AI risponde con [NAVIGATE:...]
3. ✅ Toast "Apertura pagina..."
4. ✅ Redirect a /property/lucas-suite
5. ✅ Chat si chiude automaticamente

### **Test 4: Reset**
1. Clicca icona cestino (Trash2)
2. ✅ Toast "Chat resettata"
3. ✅ Messaggi cancellati
4. ✅ Nuovo messaggio di benvenuto

---

## 🔄 Differenze vs Vecchia Implementazione

| Feature | Prima | Ora |
|---------|-------|-----|
| **Memoria** | ❌ Nessuna | ✅ LocalStorage persistente |
| **Context** | ❌ Singola query | ✅ Tutta la conversazione |
| **Azioni** | ❌ Solo testo | ✅ Navigate automatico |
| **UI** | Barra statica | Bollicina floating |
| **Reset** | Auto reset | Manuale con bottone |
| **Nome** | "Assistente AI" | "NOM.AI" |
| **Powered by** | "Groq" | "app.nomadiqe.com" |

---

## 🚀 Espansioni Future

### **Possibili Miglioramenti:**

1. **Azioni Avanzate:**
   - `[ACTION:BOOK:lucas-suite]` → Apri modal prenotazione
   - `[ACTION:CALL]` → Mostra numero telefono
   - `[ACTION:EMAIL]` → Apri email

2. **Multi-modal:**
   - Invia foto strutture in chat
   - Voice input/output

3. **Analytics:**
   - Traccia conversazioni popolari
   - Intent analytics
   - Conversion tracking

4. **Backend Persistence:**
   - Salva chat su database
   - Sync tra dispositivi
   - Chat history per utenti registrati

5. **Admin Dashboard:**
   - Visualizza tutte le conversazioni
   - Statistiche utilizzo
   - Popular queries

---

## 📊 Rate Limits

- **Per utente:** 10 richieste / 10 minuti
- **Globale:** 200 richieste / giorno
- **Timeout:** 15 secondi per risposta
- **Max tokens:** 500 (risposta ~150 parole)

---

## 🐛 Troubleshooting

### ❌ Chat non salva conversazione
**Problema:** LocalStorage non funziona
**Soluzione:** Controlla se browser blocca localStorage (privacy mode)

### ❌ AI non ricorda conversazione
**Problema:** Messages array non inviato
**Soluzione:** Verifica che API riceva `messages` e non `query`

### ❌ Navigation non funziona
**Problema:** Marker non rilevato
**Soluzione:** Verifica regex in `executeAction()`: `/\[NAVIGATE:\/property\/([\w-]+)\]/i`

### ❌ Reset non funziona
**Problema:** LocalStorage non cancellato
**Soluzione:** Controlla console per errori localStorage

---

## 📱 Responsive

- **Desktop:** 420x600px chat window
- **Mobile:** Full screen chat (TODO)
- **Bollicina:** 64x64px su tutti i dispositivi

---

## 🎨 Styling

**Colori:**
- Primary: Cyan (#06B6D4)
- Secondary: Blue (#3B82F6)
- Background: Gradient gray-900 → black
- Border: Cyan/30 opacity
- User messages: Cyan gradient
- AI messages: Gray/50

**Font:**
- System font stack
- Bold per nomi
- Regular per contenuto

**Animazioni:**
- Fade-in backdrop (200ms)
- Slide-in chat (300ms)
- Pulse glow bollicina (infinite)
- Bounce badge notifica

---

**🎉 NOM.AI è pronto per interazioni avanzate!**

*Documentazione aggiornata: Novembre 2024*


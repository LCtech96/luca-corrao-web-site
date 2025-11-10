# 🔍 NOM.AI - Sistema di Filtraggio Intelligente + Immagini

## 🌟 Nuove Funzionalità Implementate

### 1. **Strutture Reali dal Database** 🏠
- ✅ Recupera strutture da Supabase in tempo reale
- ✅ NON inventa nomi (usa solo quelle disponibili)
- ✅ Include: nome, capacity, features, immagini, prezzi, slug

### 2. **Filtraggio Intelligente Pre-Ricerca** 🎯
- ✅ AI chiede **PRIMA** di mostrare strutture:
  - 📍 Località/zona
  - 👥 Numero ospiti
  - 📅 Date soggiorno
  - 🐕 Esigenze particolari (animali, accessibilità)
- ✅ Mostra **MAX 2-3 strutture** per volta (no overload)
- ✅ Suggerisce solo le più adatte ai criteri

### 3. **Immagini in Chat** 🖼️
- ✅ AI può mostrare foto delle strutture
- ✅ Rendering inline con `<img>` tag
- ✅ Fallback a placeholder se errore
- ✅ Border cyan + shadow per stile coerente

---

## 🏗️ Architettura

### **Nuovi Endpoint API:**

#### **1. GET `/api/accommodations`**
Recupera strutture con filtri opzionali.

**Query Parameters:**
- `location` (string) - Filtra per località
- `guests` (number) - Minimo posti letto
- `checkIn` (string) - Data check-in (futuro)
- `checkOut` (string) - Data check-out (futuro)

**Response:**
```json
{
  "success": true,
  "accommodations": [
    {
      "id": "uuid",
      "name": "Lucas Suite",
      "subtitle": "Appartamento moderno",
      "description": "...",
      "capacity": "4 ospiti",
      "features": ["WiFi", "Vista mare", "Cucina"],
      "mainImage": "https://...",
      "price": "€120 / notte",
      "slug": "lucas-suite"
    }
  ],
  "count": 3,
  "filters": {...}
}
```

#### **2. POST `/api/ai-search` (aggiornato)**
- Recupera strutture reali all'avvio
- Invia lista completa al system prompt
- AI usa solo strutture reali

---

## 💡 System Prompt (Aggiornato)

```
Sei NOM.AI per lucacorrao.com

STRUTTURE REALI DISPONIBILI:
1. Lucas Suite (slug: lucas-suite)
   - Capacità: 4 ospiti
   - Descrizione: ...
   - Prezzo: €120 / notte
   - Features: WiFi, Vista mare, Cucina
   - Immagine: https://...

2. Trilu (slug: trilu)
   ...

FLUSSO DI RICERCA (IMPORTANTE):
1. PRIMA chiedi: località, ospiti, date, esigenze
2. SOLO DOPO suggerisci 2-3 strutture adatte
3. NON inventare nomi
4. USA SOLO strutture nella lista sopra

AZIONI DISPONIBILI:
- [NAVIGATE:/property/SLUG]
- [IMAGE:URL]

Esempio:
"Perfetto! Per 4 persone ti consiglio Lucas Suite. 
Ha vista mare e cucina attrezzata. Vuoi vederla? 
[IMAGE:https://...] [NAVIGATE:/property/lucas-suite]"

REGOLE:
- Filtra PRIMA di suggerire
- Max 2-3 strutture per volta
- Marker [IMAGE:...] per mostrare foto
- Marker [NAVIGATE:...] solo con chiaro interesse
```

---

## 🖼️ Sistema Immagini

### **Formato Marker:**
```
[IMAGE:https://example.com/image.jpg]
```

### **Frontend Processing:**
1. AI invia: `"Ecco Lucas Suite! [IMAGE:https://...] Vuoi vederla?"`
2. Frontend rileva `[IMAGE:...]`
3. Estrae URL
4. Crea messaggio separato: `[IMAGES:url1|url2]`
5. Rendering speciale per messaggi `[IMAGES:...]`

### **UI Rendering:**
```tsx
{isImageMessage ? (
  <div className="rounded-2xl overflow-hidden border-cyan-500/30">
    <img src={url} alt="Anteprima" className="w-full h-48 object-cover" />
  </div>
) : (
  <div className="bg-gray-800/50 p-3">
    <p>{message.content}</p>
  </div>
)}
```

---

## 🔄 Flusso Completo

### **Esempio Conversazione:**

```
User: "Cerco un appartamento"

AI: "Certo! Per aiutarti meglio, dimmi:
     - Quanti ospiti siete?
     - In che zona preferisci (Terrasini centro, mare, etc.)?
     - Hai date in mente?"

User: "Siamo in 4, vicino al mare, dal 15 al 20 luglio"

AI: "Perfetto! Per 4 persone vicino al mare ti consiglio:

     1. Lucas Suite - Vista mare, 4 posti letto, cucina attrezzata
     2. Dani Holiday - 200m dal mare, terrazza panoramica
     
     Quale ti interessa?"

User: "Lucas Suite"

AI: "Ottima scelta! Lucas Suite è moderna con vista mare.
     [IMAGE:https://.../lucas-suite-main.jpg]
     
     Ha WiFi, aria condizionata, e cucina completa.
     Prezzo: €120/notte. Vuoi vederla nel dettaglio?"

[IMMAGINE APPARE NELLA CHAT]

User: "Si perfetto"

AI: "Te la mostro subito! [NAVIGATE:/property/lucas-suite]"

[REDIRECT AUTOMATICO]
```

---

## 📊 Filtri Supportati

### **Attualmente Implementati:**
- ✅ **Numero ospiti** - Filtra per capacity
- ✅ **Località** - Cerca in address, distance, name, description

### **Futuri (Placeholder):**
- ⏳ **Date check-in/out** - Verifica disponibilità calendario
- ⏳ **Animali** - Filtra per `pets_allowed`
- ⏳ **Range prezzo** - Filtra per `price`
- ⏳ **Features specifiche** - WiFi, piscina, etc.

---

## 🧪 Testing

### **Test 1: Filtro Ospiti**
1. Scrivi: "Cerco per 6 persone"
2. AI chiede altre info
3. Dopo risposta, suggerisce solo strutture con capacity ≥ 6

### **Test 2: Nessuna Invenzione**
1. Scrivi: "Mostrami tutte le strutture"
2. AI chiede filtri
3. Mostra SOLO strutture esistenti nel database
4. ✅ NON inventa "Villa Paradiso" o nomi casuali

### **Test 3: Immagini**
1. Scrivi: "Voglio vedere Lucas Suite"
2. AI risponde con testo + `[IMAGE:...]`
3. ✅ Immagine appare nella chat
4. ✅ Bordo cyan, dimensione 320x192px
5. ✅ Fallback a placeholder se errore

### **Test 4: Max 2-3 Risultati**
1. Scrivi: "Mostrami tutto"
2. AI chiede filtri
3. Risposta con filtri
4. ✅ AI mostra MAX 2-3 strutture, non 10+

---

## 🔧 Configurazione

### **Modificare Limiti Filtri:**

**File:** `app/api/accommodations/route.ts`

```typescript
// Cambia filtro ospiti
if (guests > 0) {
  filtered = filtered.filter(acc => {
    const capacityMatch = acc.capacity.match(/(\d+)/)
    const maxGuests = capacityMatch ? parseInt(capacityMatch[1]) : 0
    return maxGuests >= guests // Modifica logica qui
  })
}
```

### **Aggiungere Nuovi Filtri:**

```typescript
// Esempio: filtro per prezzo
const maxPrice = parseInt(searchParams.get('maxPrice') || '0')
if (maxPrice > 0) {
  filtered = filtered.filter(acc => {
    const priceMatch = acc.price?.match(/€(\d+)/)
    const price = priceMatch ? parseInt(priceMatch[1]) : 0
    return price <= maxPrice
  })
}
```

---

## 📐 UI Immagini

### **Dimensioni:**
- Width: 100% del messaggio (max-w-[80%])
- Height: 192px (h-48)
- Object-fit: cover

### **Styling:**
- Border: `border-cyan-500/30`
- Shadow: `shadow-lg`
- Rounded: `rounded-2xl`
- Overflow: `overflow-hidden`

### **Responsive:**
- Mobile: Full width del bubble
- Desktop: 80% max width

---

## ⚠️ Limitazioni Attuali

1. **Calendario non integrato** - Date non verificano disponibilità reale
2. **Filtro prezzo** - Non implementato lato API
3. **Features specifiche** - Non filtra per WiFi, piscina, etc.
4. **Immagini multiple** - Mostra solo mainImage
5. **Lazy loading** - Immagini caricate immediatamente

---

## 🚀 Espansioni Future

### **1. Calendario Disponibilità:**
```typescript
// Check su Supabase per date occupate
const isAvailable = await checkAvailability(propertyId, checkIn, checkOut)
```

### **2. Filtri Avanzati:**
- Range prezzo: €50-150
- Features richieste: ["WiFi", "Piscina"]
- Rating minimo: 4.5+
- Pet-friendly

### **3. Immagini Multiple:**
```
[IMAGES:img1.jpg|img2.jpg|img3.jpg]
→ Gallery con scroll orizzontale
```

### **4. Preview Cards:**
Invece di solo immagini, mostra card complete:
```
┌─────────────────────┐
│  [Immagine]         │
│  Lucas Suite        │
│  €120/notte         │
│  ⭐ 4.8 · 4 ospiti │
│  [Vedi Dettagli]    │
└─────────────────────┘
```

### **5. Confronto Strutture:**
```
User: "Confronta Lucas Suite e Trilu"
AI: [Mostra tabella comparativa]
```

---

## 📝 Changelog

**v2.0 - Smart Filtering + Images**
- ✅ Integrazione database Supabase
- ✅ Filtro ospiti/località
- ✅ Immagini inline nella chat
- ✅ Max 2-3 risultati per volta
- ✅ Pre-filtering con domande

**v1.0 - Basic Chat**
- Conversazione semplice
- Nomi strutture hardcoded
- Nessun filtro
- Nessuna immagine

---

## 🐛 Troubleshooting

### ❌ AI inventa ancora nomi
**Problema:** System prompt non riceve strutture
**Soluzione:** Verifica che `/api/accommodations` risponda correttamente

### ❌ Immagini non si vedono
**Problema:** URL non valido o CORS
**Soluzione:** Controlla console browser, verifica URL mainImage

### ❌ Filtro ospiti non funziona
**Problema:** Capacity format non riconosciuto
**Soluzione:** Verifica regex `acc.capacity.match(/(\d+)/)`

### ❌ Mostra tutte le strutture insieme
**Problema:** AI ignora istruzione "MAX 2-3"
**Soluzione:** Rafforza system prompt con "IMPORTANTE: MAX 2-3"

---

**🎉 NOM.AI ora usa solo dati reali e filtra intelligentemente!**

*Documentazione aggiornata: Novembre 2024*


# 🎬 Guida Step-by-Step: Video da CDN Esterno

## 🎯 Obiettivo
Caricare il video snowboarding (165-185MB) su un CDN esterno e integrarlo nel sito.

---

## 📊 Opzioni CDN Consigliate

### 🥇 **OPZIONE 1: Cloudflare Stream (RACCOMANDATO)**
- ✅ **Ottimizzato per video**
- ✅ Streaming adattivo automatico
- ✅ CDN globale velocissimo
- ✅ Facile da usare
- 💰 **$5/mese** per 1000 minuti streaming

### 🥈 **OPZIONE 2: AWS S3 + CloudFront**
- ✅ Affidabilità massima
- ✅ Scalabile
- ⚠️ Più complesso da configurare
- 💰 **Pay-as-you-go** (~$0.10-0.50/mese per traffico basso)

### 🥉 **OPZIONE 3: Vimeo Pro**
- ✅ Molto semplice
- ✅ Embed player incluso
- ⚠️ Player con branding Vimeo
- 💰 **$20/mese**

### 🏆 **OPZIONE 4: Bunny.net (MIGLIOR RAPPORTO QUALITÀ/PREZZO)**
- ✅ Economico ($10/mese per 500GB storage + 1TB bandwidth)
- ✅ CDN globale veloce
- ✅ Facile da usare
- ✅ Ottimizzato per video
- 💰 **$10/mese** oppure pay-as-you-go da $0.01/GB

---

## 🚀 STEP-BY-STEP: Bunny.net (Consigliato)

### **STEP 1: Crea Account Bunny.net**

1. Vai su **https://bunny.net**
2. Click su **"Get Started Free"**
3. Registrati con email
4. Verifica l'email

---

### **STEP 2: Crea Storage Zone**

1. Dashboard → **Storage** (nel menu laterale)
2. Click **"Add Storage Zone"**
3. Configura:
   - **Name:** `luca-corrao-videos`
   - **Region:** Europe (Amsterdam o Falkenstein) → Più vicino all'Italia
   - **Type:** Standard
4. Click **"Add Storage Zone"**

---

### **STEP 3: Carica il Video**

1. Click sulla tua Storage Zone appena creata
2. Click **"Upload Files"**
3. Seleziona il file:
   ```
   C:\Users\luca\Desktop\luca-corrao-web-site-main\public\videos\ski-extreme-4k.mp4
   ```
   (o `snowboard-action-4k.mp4` se preferisci quello)
4. Aspetta upload (~5-10 minuti per 165MB)

---

### **STEP 4: Ottieni URL CDN**

1. Una volta caricato, click sul file
2. Copia l'URL che appare, sarà tipo:
   ```
   https://luca-corrao-videos.b-cdn.net/ski-extreme-4k.mp4
   ```

---

### **STEP 5: Integra nel Codice**

Apri `components/minimal-hero.tsx` e sostituisci il gradient con:

```typescript
{/* 4K Video Background - Extreme Skiing from Bunny CDN */}
<div className="absolute inset-0 z-0">
  <video
    autoPlay
    loop
    muted
    playsInline
    className="absolute inset-0 w-full h-full object-cover"
  >
    <source src="https://luca-corrao-videos.b-cdn.net/ski-extreme-4k.mp4" type="video/mp4" />
  </video>
  {/* Dark overlay for better text readability */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
</div>
```

---

### **STEP 6: Commit e Deploy**

```bash
git add components/minimal-hero.tsx
git commit -m "feat: Integrato video da Bunny CDN"
git push origin main
```

Vercel fa il deploy automatico! 🎉

---

## 🚀 ALTERNATIVA: Cloudflare Stream

### **STEP 1: Crea Account Cloudflare**

1. Vai su **https://dash.cloudflare.com**
2. Sign up gratuito
3. Verifica email

---

### **STEP 2: Attiva Cloudflare Stream**

1. Dashboard → **Stream**
2. Click **"Purchase Stream"**
3. **$5/mese** per 1000 minuti
4. Conferma acquisto

---

### **STEP 3: Carica Video**

1. Click **"Upload"**
2. Seleziona `ski-extreme-4k.mp4`
3. Aspetta processing (~5-10 minuti)

---

### **STEP 4: Ottieni URL**

1. Click sul video caricato
2. Tab **"Embed"**
3. Copia l'URL da **"HLS/DASH manifest"**:
   ```
   https://customer-xxx.cloudflarestream.com/xxx/manifest/video.m3u8
   ```

---

### **STEP 5: Integra con HLS.js**

Installa libreria:
```bash
npm install hls.js
```

Aggiorna `components/minimal-hero.tsx`:

```typescript
"use client"

import { useEffect, useRef } from "react"
import Hls from "hls.js"

// ... nel componente
const videoRef = useRef<HTMLVideoElement>(null)

useEffect(() => {
  const video = videoRef.current
  if (!video) return

  const videoSrc = "https://customer-xxx.cloudflarestream.com/xxx/manifest/video.m3u8"

  if (Hls.isSupported()) {
    const hls = new Hls()
    hls.loadSource(videoSrc)
    hls.attachMedia(video)
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = videoSrc
  }
}, [])

// Nel JSX:
<video
  ref={videoRef}
  autoPlay
  loop
  muted
  playsInline
  className="absolute inset-0 w-full h-full object-cover"
/>
```

---

## 💰 Confronto Costi (1 anno)

| Provider | Setup | Mensile | Annuale | Note |
|----------|-------|---------|---------|------|
| **Bunny.net** | $0 | $10 | $120 | ⭐ Miglior rapporto qualità/prezzo |
| **Cloudflare Stream** | $0 | $5 | $60 | Solo per video, no storage generico |
| **AWS S3+CloudFront** | $0 | ~$2-5 | ~$24-60 | Dipende dal traffico |
| **Vimeo Pro** | $0 | $20 | $240 | Include player + analytics |

---

## 🎯 Raccomandazione Finale

**Per lucacorrao.com:**

### ✅ **USA BUNNY.NET**

**Perché:**
1. **$10/mese** → Economico
2. **CDN velocissimo** → Performance top
3. **Facile da usare** → 5 minuti setup
4. **Nessun limite** → Bandwidth illimitato con piano base
5. **Made for video** → Ottimizzato

**Setup totale: 10 minuti**

---

## 📞 Supporto

Serve aiuto? Contatta:
- **Bunny.net:** support@bunny.net (risposta in ~1h)
- **Cloudflare:** support ticket (risposta in ~4h)

---

## ✅ Checklist Deploy Video

- [ ] Account CDN creato
- [ ] Video caricato
- [ ] URL CDN ottenuto
- [ ] Codice aggiornato con URL
- [ ] Testato in localhost
- [ ] Commit + push
- [ ] Verificato su lucacorrao.com
- [ ] Video si carica velocemente
- [ ] Loop funziona
- [ ] Autoplay attivo

🎉 **Fatto!**


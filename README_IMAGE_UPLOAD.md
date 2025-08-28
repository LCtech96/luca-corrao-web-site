# 🖼️ Sistema di Upload Immagini Dinamico

## Panoramica

È stato implementato un sistema completo di gestione immagini dinamico che sostituisce le immagini statiche con un sistema basato su Convex file storage.

## 🚀 Funzionalità Implementate

### 1. **File Storage con Convex**
- Schema database aggiornato con tabella `files` per metadati
- Funzioni Convex per upload, recupero, aggiornamento e cancellazione
- Integrazione con Convex storage per file hosting

### 2. **API di Upload**
- Endpoint `/api/upload` per gestire l'upload delle immagini
- Validazione tipo file (JPEG, PNG, WebP, GIF)
- Controllo dimensione file (max 10MB)
- Gestione errori completa

### 3. **Componente UI di Upload**
- `ImageUpload` component con drag & drop
- Preview immagini in tempo reale
- Supporto upload multiplo
- Progress indicators e gestione errori
- Metadata per categorizzazione

### 4. **Pannello Amministrazione**
- Dashboard admin completo (`/admin`)
- Gestione accommodations con upload integrato
- Galleria immagini con filtri e ricerca
- Operazioni bulk (selezione multipla, cancellazione)

### 5. **Form Accommodation**
- Form completo per creare/modificare accommodation
- Upload immagini integrato nel workflow
- Gestione immagine principale
- Descrizioni immagini opzionali

## 📁 Struttura File

```
├── convex/
│   ├── schema.ts          # Schema con tabella files
│   └── files.ts           # Funzioni per gestione file
├── app/
│   ├── api/upload/        # API endpoint per upload
│   └── admin/             # Pannello amministrazione
│       ├── page.tsx       # Dashboard admin
│       ├── layout.tsx     # Layout admin
│       ├── accommodations/
│       └── images/
├── components/
│   ├── ui/
│   │   └── image-upload.tsx   # Componente upload
│   └── admin/
│       ├── accommodation-form.tsx
│       └── admin-nav.tsx
```

## 🛠️ Come Usare

### 1. **Accesso Pannello Admin**
- Autenticarsi con Clerk
- Cliccare sul pulsante "Admin" nella navigazione
- Accedere alle varie sezioni di gestione

### 2. **Upload Immagini**
- Trascinare file nell'area di upload
- Oppure cliccare per aprire file dialog
- Le immagini vengono automaticamente ottimizzate e memorizzate

### 3. **Gestione Accommodation**
- Creare nuove accommodation con form completo
- Caricare multiple immagini
- Impostare immagine principale
- Aggiungere descrizioni e metadata

### 4. **Galleria Immagini**
- Visualizzare tutte le immagini caricate
- Filtrare per categoria
- Operazioni di gestione (elimina, download)
- Vista griglia o lista

## 🔧 Configurazione

### Variabili Ambiente Necessarie
```env
# Convex
CONVEX_DEPLOYMENT=your-deployment
NEXT_PUBLIC_CONVEX_URL=your-convex-url

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-key
CLERK_SECRET_KEY=your-secret
```

### Tipi di File Supportati
- JPEG/JPG
- PNG  
- WebP
- GIF

### Limiti
- Dimensione massima: 10MB per file
- File multipli: fino a 20 per upload
- Storage: illimitato con Convex

## 🎨 Categorie Immagini

- `accommodation` - Immagini delle strutture
- `profile` - Immagini profilo e personali  
- `general` - Immagini generiche del sito

## 🔐 Sicurezza

- Autenticazione Clerk obbligatoria per admin
- Validazione lato client e server
- Controllo tipi MIME
- Soft delete per recupero dati

## 📱 Responsive Design

Tutti i componenti sono completamente responsive e ottimizzati per:
- Desktop
- Tablet  
- Mobile

## 🚀 Deploy

Il sistema è pronto per il deploy su Vercel con:
- Convex backend automaticamente gestito
- CDN per immagini ottimizzato
- Performance ottimali

## 📈 Prossimi Sviluppi

- [ ] Compressione automatica immagini
- [ ] Watermark automatico
- [ ] Backup automatico
- [ ] Analytics usage
- [ ] Integrazione AI per tag automatici

# 🎬 Guida Compressione Video con FFmpeg

## 🎯 Obiettivo
Comprimere `ski-extreme-4k.mp4` da **165MB** a **~25MB** mantenendo qualità HD.

---

## 📥 STEP 1: Installa FFmpeg

### **Windows (PowerShell):**

#### **Opzione A: Con Chocolatey (raccomandato)**
```powershell
# Installa Chocolatey (se non ce l'hai)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Installa FFmpeg
choco install ffmpeg -y
```

#### **Opzione B: Download Manuale**
1. Vai su **https://www.gyan.dev/ffmpeg/builds/**
2. Download: **ffmpeg-release-essentials.zip**
3. Estrai in `C:\ffmpeg`
4. Aggiungi a PATH:
   - Cerca "Variabili d'ambiente" nel menu Start
   - Click "Variabili d'ambiente"
   - In "Variabili di sistema" trova `Path`
   - Click "Modifica" → "Nuovo"
   - Aggiungi: `C:\ffmpeg\bin`
   - OK → OK → Riavvia PowerShell

#### **Verifica Installazione:**
```powershell
ffmpeg -version
```
Dovresti vedere la versione di FFmpeg.

---

## 🎬 STEP 2: Comprimi il Video

### **Comando Base (Qualità Alta, ~25MB):**

```powershell
cd C:\Users\luca\Desktop\luca-corrao-web-site-main\public\videos

ffmpeg -i ski-extreme-4k.mp4 -vcodec libx264 -crf 28 -preset slow -vf "scale=1920:1080" -acodec aac -b:a 128k ski-extreme-compressed.mp4
```

### **Spiegazione Parametri:**
- `-i ski-extreme-4k.mp4` → Input file
- `-vcodec libx264` → Codec video H.264 (universale)
- `-crf 28` → Qualità (18=alta, 28=buona, 32=media)
- `-preset slow` → Compressione migliore (più lenta ma file più piccolo)
- `-vf "scale=1920:1080"` → Ridimensiona a Full HD (da 4K)
- `-acodec aac` → Codec audio AAC
- `-b:a 128k` → Bitrate audio 128kbps
- `ski-extreme-compressed.mp4` → Output file

**Tempo stimato:** 3-5 minuti

---

## 🎯 VARIANTI COMPRESSIONE

### **Opzione 1: Qualità ALTA (~35-40MB)**
```powershell
ffmpeg -i ski-extreme-4k.mp4 -vcodec libx264 -crf 23 -preset medium -vf "scale=1920:1080" -acodec aac -b:a 192k ski-extreme-high.mp4
```
✅ Miglior qualità visiva
⚠️ File più grande

### **Opzione 2: Qualità MEDIA (~20-25MB) - RACCOMANDATO**
```powershell
ffmpeg -i ski-extreme-4k.mp4 -vcodec libx264 -crf 28 -preset slow -vf "scale=1920:1080" -acodec aac -b:a 128k ski-extreme-medium.mp4
```
✅ Ottimo bilanciamento qualità/dimensione
✅ Perfetto per web

### **Opzione 3: Qualità LEGGERA (~15MB)**
```powershell
ffmpeg -i ski-extreme-4k.mp4 -vcodec libx264 -crf 32 -preset fast -vf "scale=1280:720" -acodec aac -b:a 96k ski-extreme-light.mp4
```
✅ Caricamento velocissimo
⚠️ Qualità inferiore (ma accettabile per background)

---

## 📊 CONFRONTO RISOLUZIONI

| Risoluzione | Dimensione | Qualità | Raccomandato per |
|-------------|------------|---------|------------------|
| **4K (3840x2160)** | 165MB | Massima | Download/Archivio |
| **Full HD (1920x1080)** | ~25MB | Ottima | **Web/Siti** ✅ |
| **HD (1280x720)** | ~15MB | Buona | Mobile/Connessioni lente |

---

## ✅ STEP 3: Verifica Risultato

### **Controlla dimensione file:**
```powershell
ls -lh ski-extreme-*.mp4
```

### **Riproduci per testare qualità:**
```powershell
# Apri con player predefinito
Start-Process ski-extreme-compressed.mp4
```

---

## 🚀 STEP 4: Usa Video Compresso

### **A. Se <50MB → Metti nel Repo GitHub**
```powershell
# Rinomina e sostituisci
Remove-Item ski-extreme-4k.mp4
Rename-Item ski-extreme-compressed.mp4 ski-extreme-4k.mp4

# Aggiungi a Git
git add public/videos/ski-extreme-4k.mp4
git commit -m "feat: Video compresso da 165MB a 25MB"
git push origin main
```

### **B. Se >50MB → Usa CDN Gratuito**
Vedi sotto le opzioni gratuite! ⬇️

---

## 🎁 OPZIONI CDN GRATUITE

### **1. Cloudflare R2 (RACCOMANDATO)** 🥇
- ✅ **10GB storage GRATIS/mese**
- ✅ **Nessun costo egress** (bandwidth illimitata)
- ✅ API S3-compatibile
- ✅ CDN globale veloce

**Setup:**
1. Crea account Cloudflare (gratis)
2. Dashboard → R2 → Create Bucket
3. Upload video
4. Abilita "Public Access"
5. Copia URL pubblico

**Costo:** $0/mese (fino a 10GB)

---

### **2. GitHub Release Assets** 🥈
- ✅ **Gratis per file <2GB**
- ✅ CDN GitHub veloce
- ⚠️ URL lungo ma funziona

**Setup:**
1. GitHub repo → Releases → Create new release
2. Drag & drop video
3. Publish release
4. Click destro sul video → Copia URL

**Costo:** $0

---

### **3. Imgur (solo <200MB)** 🥉
- ✅ Upload diretto
- ✅ Gratis
- ⚠️ Limite 200MB

**Setup:**
1. Vai su imgur.com
2. Upload video
3. Copia URL diretto

**Costo:** $0

---

## 💡 RACCOMANDAZIONE FINALE

### **Workflow Ottimale:**

```
1. COMPRIMI con FFmpeg
   165MB → 25MB (CRF 28, 1920x1080)
   ⏱️ 3-5 minuti
   
2. SCEGLI OPZIONE:
   
   ✅ Se 25MB → Metti nel REPO GITHUB
   (Facile, veloce, zero configurazione)
   
   ✅ Se 40MB → Usa CLOUDFLARE R2
   (10GB gratis, zero egress, setup 5min)
   
   ✅ Se >50MB → Usa GITHUB RELEASE
   (Gratis, funziona sempre)
```

---

## 🎯 COMANDO VELOCE (COPY-PASTE)

```powershell
# Naviga nella cartella video
cd C:\Users\luca\Desktop\luca-corrao-web-site-main\public\videos

# Comprimi (25MB, qualità ottima)
ffmpeg -i ski-extreme-4k.mp4 -vcodec libx264 -crf 28 -preset slow -vf "scale=1920:1080" -acodec aac -b:a 128k ski-extreme-compressed.mp4

# Verifica dimensione
ls -lh ski-extreme-compressed.mp4

# Se <50MB, sostituisci originale
Remove-Item ski-extreme-4k.mp4
Rename-Item ski-extreme-compressed.mp4 ski-extreme-4k.mp4

# Deploy
git add public/videos/ski-extreme-4k.mp4
git commit -m "feat: Video compresso HD per web"
git push origin main
```

**Tempo totale: 10 minuti** ⚡

---

## ❓ Troubleshooting

### **Errore: "ffmpeg not found"**
FFmpeg non installato correttamente. Riprova Opzione B (download manuale).

### **Video compresso troppo grande**
Aumenta CRF: `-crf 32` o riduci risoluzione: `scale=1280:720`

### **Video compresso troppo pixelato**
Diminuisci CRF: `-crf 23` o aumenta risoluzione: `scale=1920:1080`

### **Compressione lentissima**
Cambia preset: `-preset fast` (più veloce, file più grande)

---

## 📞 Supporto

Serve aiuto? Dimmi a che punto sei! 😊


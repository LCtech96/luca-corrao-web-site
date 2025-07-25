# 🔧 Vercel Deployment Fix Guide

## 🚨 Errori Identificati

I seguenti errori sono stati identificati nel tuo deployment Vercel:

### 1. **Dependencies Mancanti**
- `@clerk/nextjs` non installato
- `googleapis` non installato

### 2. **Variabili d'Ambiente Non Configurate**
- Clerk authentication keys mancanti
- Google OAuth credentials non configurate
- Email service credentials mancanti

### 3. **Configurazione OAuth Non Completa**
- Redirect URI non configurato per produzione
- Client ID/Secret hardcoded invece di usare env vars

## 🛠️ Soluzioni

### Passo 1: Installare Dependencies Mancanti

```bash
npm install @clerk/nextjs googleapis
# oppure
pnpm add @clerk/nextjs googleapis
```

### Passo 2: Configurare Variabili d'Ambiente in Vercel

Vai su [Vercel Dashboard](https://vercel.com/dashboard) → Il tuo progetto → Settings → Environment Variables

Aggiungi queste variabili:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-clerk-publishable-key
CLERK_SECRET_KEY=sk_test_your-clerk-secret-key

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Google OAuth Configuration
GOOGLE_CLIENT_ID=42904699184-itfale5a6vvh6r9i1p8m5i7v77md8nt4.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URI=https://tuodominio.vercel.app/api/auth/google/callback

# Google Sheets Configuration
GOOGLE_SPREADSHEET_ID=18X9VQOYNtX-qAyHAFwkCKALuufK3MHP-ShmZ7u074X4
```

### Passo 3: Configurare Google OAuth per Produzione

1. Vai su [Google Cloud Console](https://console.cloud.google.com/)
2. Seleziona il tuo progetto
3. Vai su "APIs & Services" → "Credentials"
4. Modifica il tuo OAuth 2.0 Client ID
5. Aggiungi il redirect URI di produzione:
   ```
   https://tuodominio.vercel.app/api/auth/google/callback
   ```

### Passo 4: Configurare Clerk

1. Vai su [Clerk Dashboard](https://dashboard.clerk.com/)
2. Crea un nuovo progetto o usa quello esistente
3. Copia le chiavi API
4. Aggiorna le variabili d'ambiente in Vercel

### Passo 5: Configurare Email Service

Per usare Gmail con nodemailer:

1. Abilita "2-Step Verification" su Google
2. Genera una "App Password"
3. Usa quella password nelle variabili d'ambiente

## 🔍 Verifica Fix

### Test Locale
```bash
# Installa dependencies
npm install

# Crea .env.local con le variabili
cp .env.example .env.local
# Modifica .env.local con i tuoi valori

# Avvia in locale
npm run dev
```

### Test Produzione
1. Pusha le modifiche su GitHub
2. Vercel farà il rebuild automaticamente
3. Controlla i log per errori

## 🚀 Comandi Utili

```bash
# Rebuild forzato su Vercel
vercel --prod

# Controlla log in tempo reale
vercel logs

# Test locale con variabili di produzione
vercel env pull .env.local
```

## 📋 Checklist Completa

- [ ] Installare `@clerk/nextjs` e `googleapis`
- [ ] Configurare variabili d'ambiente in Vercel
- [ ] Aggiornare Google OAuth redirect URI
- [ ] Configurare Clerk authentication
- [ ] Testare email service
- [ ] Verificare deployment

## 🆘 Troubleshooting

### Errori Comuni

1. **"Module not found"**
   - Installa le dependencies mancanti
   - Riavvia il server

2. **"Environment variable not found"**
   - Verifica che le variabili siano configurate in Vercel
   - Ricontrolla i nomi delle variabili

3. **"OAuth redirect_uri_mismatch"**
   - Aggiorna il redirect URI in Google Console
   - Usa l'URL di produzione corretto

4. **"Email service error"**
   - Verifica le credenziali Gmail
   - Controlla che l'App Password sia corretta

## 📞 Supporto

Se continui ad avere problemi:
1. Controlla i log di Vercel per errori specifici
2. Verifica che tutte le variabili d'ambiente siano configurate
3. Testa prima in locale con `npm run dev`

---

**Nota**: Questo fix risolve i principali errori di deployment. Dopo aver applicato queste modifiche, il sito dovrebbe funzionare correttamente su Vercel. 
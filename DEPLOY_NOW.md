# 🚀 Deploy Istruzioni Rapide

## ✅ Pronto per il Deploy!

Il progetto è configurato e pronto per il deploy su Vercel.

---

## 📋 Step 1: Push su GitHub

```bash
git add .
git commit -m "Add dark/light mode theme support"
git push origin main
```

---

## 🌐 Step 2: Deploy su Vercel

### Opzione A: Deploy Automatico (se già connesso)
Se hai già collegato il repository GitHub a Vercel, il deploy partirà automaticamente dopo il push!

### Opzione B: Deploy Manuale

1. **Vai su [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Clicca "Add New..." → "Project"**
3. **Importa il tuo repository GitHub**
4. **Configura il progetto:**
   - Framework Preset: **Next.js** (dovrebbe essere rilevato automaticamente)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

---

## 🔑 Step 3: Environment Variables (IMPORTANTE!)

Aggiungi queste variabili d'ambiente su Vercel:

### Variabili Obbligatorie:

```
NEXT_PUBLIC_SUPABASE_URL=https://txszcieimfzqthkdzceb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[il_tuo_anon_key_da_supabase]
GROQ_API_KEY=[il_tuo_groq_api_key]
```

### Variabili Opzionali (se configurate):

```
BREVO_API_KEY=[se_usato_per_email]
TWILIO_ACCOUNT_SID=[se_usato_per_2FA]
TWILIO_AUTH_TOKEN=[se_usato_per_2FA]
TWILIO_PHONE_NUMBER=[se_usato_per_2FA]
STRIPE_SECRET_KEY=[se_usato_per_pagamenti]
STRIPE_PUBLISHABLE_KEY=[se_usato_per_pagamenti]
```

**Dove aggiungerle su Vercel:**
- Vai su **Project Settings → Environment Variables**
- Aggiungi ogni variabile per **Production**, **Preview**, e **Development**

---

## 🔧 Step 4: Configurazione Supabase (Post-Deploy)

Dopo il deploy, aggiorna i Redirect URLs in Supabase:

1. **Vai su [Supabase Dashboard](https://supabase.com/dashboard)**
2. **Seleziona il tuo progetto**
3. **Vai su Authentication → URL Configuration**
4. **Aggiungi questi URL nella sezione "Redirect URLs":**

```
https://tuo-dominio.vercel.app/auth/callback
https://tuo-dominio.vercel.app/auth/reset-password
```

Sostituisci `tuo-dominio.vercel.app` con il tuo dominio Vercel effettivo.

---

## ✅ Step 5: Verifica il Deploy

Dopo il deploy, verifica che tutto funzioni:

1. ✅ **Homepage** carica correttamente
2. ✅ **Dark/Light mode toggle** funziona
3. ✅ **Login/Registrazione** funziona
4. ✅ **Password reset** funziona
5. ✅ **Chatbot NOM.AI** funziona
6. ✅ **Prenotazioni** funzionano

---

## 🐛 Troubleshooting

### Build fallisce su Vercel:
- Verifica che tutte le env variables siano configurate
- Controlla i log di build su Vercel
- Assicurati che `package.json` abbia tutti i dependencies

### Auth non funziona:
- Verifica i Redirect URLs in Supabase
- Controlla che le env variables siano corrette
- Verifica che il dominio Vercel sia aggiunto in Supabase

### Dark mode non funziona:
- Verifica che `next-themes` sia installato
- Controlla che il `ThemeProvider` sia nel layout

---

## 📝 Note Importanti

1. **Environment Variables**: Devono essere configurate su Vercel PRIMA del deploy
2. **Supabase Redirect URLs**: Aggiungi il dominio di produzione dopo il deploy
3. **Database**: Assicurati che le migrations SQL siano state eseguite in Supabase
4. **.env.local**: MAI committare questo file (è già in .gitignore)

---

## 🎉 Pronto!

Una volta completati questi passaggi, il tuo sito sarà online! 🚀

---

**Per supporto, consulta:**
- `DEPLOY_INSTRUCTIONS.md` - Istruzioni dettagliate
- `FIX_PASSWORD_RESET.md` - Configurazione password reset
- `STATO_PROGETTO.md` - Stato attuale del progetto


# 🚀 Istruzioni per Deploy

## ✅ Completato Localmente

- ✅ **Commit fatto**: Tutte le modifiche sono state committate localmente
- ✅ **81 file modificati**: Migrazione Supabase completa
- ✅ **Sistema di sicurezza implementato**: Email verification, password reset, 2FA
- ✅ **Booking system pronto**: Con Revolut integration
- ✅ **Admin dashboard**: Con RLS policies e accesso limitato

---

## 📤 Quando Vuoi Fare Push/Deploy

### **Step 1: Push su GitHub**

```bash
git push origin main
```

Questo invierà tutte le modifiche al repository remoto.

---

### **Step 2: Deploy su Vercel (Raccomandato)**

#### **Opzione A: Deploy Automatico (se già connesso)**
Se hai già collegato il repository GitHub a Vercel, il deploy partirà automaticamente dopo il push!

#### **Opzione B: Deploy Manuale**

1. **Vai su [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Import Project** → Seleziona il tuo repository
3. **Configure Project:**
   - Framework Preset: **Next.js**
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   
4. **Environment Variables** (IMPORTANTISSIME):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://txszcieimfzqthkdzceb.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[tuo_anon_key]
   BREVO_API_KEY=[tuo_brevo_key]
   ```

5. **Deploy!**

---

### **Step 3: Configurazione Post-Deploy**

#### **A. Aggiorna Redirect URLs in Supabase**

Vai su **Supabase Dashboard → Authentication → URL Configuration**

Aggiungi gli URL di produzione:
```
https://tuo-dominio.vercel.app/auth/callback
https://tuo-dominio.vercel.app/auth/reset-password
```

#### **B. Configura OAuth Providers (se necessario)**

**Google Cloud Console:**
- Aggiungi il dominio Vercel agli **Authorized JavaScript origins**
- Aggiungi `https://tuo-dominio.vercel.app/auth/callback` ai **Authorized redirect URIs**

**Facebook Developers:**
- Aggiungi il dominio Vercel in **App Domains**
- Aggiungi `https://tuo-dominio.vercel.app/auth/callback` nei **Valid OAuth Redirect URIs**

---

### **Step 4: Test in Produzione**

1. ✅ **Registrazione** con email verification
2. ✅ **Login** (Google, Facebook, Email/Password)
3. ✅ **Password Reset**
4. ✅ **Booking System** con Revolut QR
5. ✅ **Admin Dashboard** (solo per email autorizzate)
6. ✅ **2FA** (se configurato Twilio)

---

## 🔒 Security Checklist per Produzione

Prima di andare live:

- [ ] ✅ Email verification attivata in Supabase
- [ ] ✅ Redirect URLs configurati
- [ ] ✅ Environment variables su Vercel
- [ ] ✅ OAuth providers configurati
- [ ] ⚠️ `.env.local` NON committato (già in .gitignore)
- [ ] ✅ HTTPS automatico su Vercel
- [ ] (Opzionale) Twilio configurato per 2FA

---

## 📊 Cosa Funziona Già

### ✅ **Completamente Funzionanti:**
- Autenticazione Supabase (email, Google, Facebook, Web3)
- Email verification obbligatoria
- Password reset flow
- 2FA setup (richiede Twilio in prod)
- Booking system con chat privata
- Admin dashboard con statistiche
- User profile management
- Revolut payment integration
- RLS policies per privacy

### 🚧 **Con "Coming Soon":**
- Admin image manager (usa Supabase Storage direttamente)
- Image gallery component (usa Supabase Storage direttamente)
- Image upload in showcase modal (temporaneamente disabilitato)

---

## 💡 Alternative di Deploy

### **1. Vercel** (Raccomandato) ⭐
- Deploy automatico da GitHub
- Serverless functions
- Edge network
- HTTPS gratis
- Free tier generoso

### **2. Netlify**
- Simile a Vercel
- Deploy automatico
- Free tier

### **3. AWS Amplify**
- Integrato con AWS
- Scalabile
- Più complesso

### **4. Self-Hosted (VPS)**
- Controllo completo
- Richiede configurazione server
- PM2 per process management
- Nginx per reverse proxy

---

## 🎯 Comandi Rapidi

```bash
# Push al repository
git push origin main

# Deploy su Vercel (se CLI installato)
vercel --prod

# Build locale per test
npm run build

# Start produzione locale
npm run build && npm start
```

---

## 📝 Note Importanti

1. **Environment Variables**: Devono essere configurate su Vercel prima del deploy
2. **Supabase Redirect URLs**: Aggiungi il dominio di produzione
3. **OAuth Credentials**: Aggiorna con il nuovo dominio
4. **.env.local**: MAI committare questo file (è già in .gitignore)
5. **Database**: Esegui le migrations SQL in Supabase prima del deploy:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_bookings_and_chat.sql`
   - `supabase/storage-setup.sql`
   - `scripts/migrate-data-to-supabase.sql` (per dati iniziali)

---

## 🆘 Troubleshooting

### **Build fallisce su Vercel:**
- Verifica che tutte le env variables siano configurate
- Controlla i log di build su Vercel
- Assicurati che `package.json` abbia tutti i dependencies

### **Auth non funziona:**
- Verifica i Redirect URLs in Supabase
- Controlla che le env variables siano corrette
- Verifica OAuth credentials per Google/Facebook

### **RLS Policies non funzionano:**
- Verifica che le migrations SQL siano state eseguite
- Controlla i log in Supabase Dashboard

---

## 🎉 Pronto per il Deploy!

Il codice è committato e pronto. Quando vorrai fare il deploy:

```bash
git push origin main
```

Poi configura su Vercel (5 minuti) e sei online! 🚀

---

**Per qualsiasi domanda, consulta le guide complete nelle varie .md files!**




# 🔐 Setup Google OAuth con Supabase

## Passo 1: Configurare Google Cloud Console

### 1.1 Crea un Progetto Google Cloud
1. Vai su [Google Cloud Console](https://consoleimage.png.cloud.google.com/)
2. Crea un nuovo progetto o seleziona uno esistente
3. Prendi nota del **Project ID**

### 1.2 Abilita Google+ API
1. Nel menu laterale, vai su **API & Services** → **Library**
2. Cerca "Google+ API"
3. Clicca **Enable**

### 1.3 Configura la Schermata di Consenso OAuth
1. Vai su **API & Services** → **OAuth consent screen**
2. Seleziona **External** (per permettere a tutti di registrarsi)
3. Clicca **Create**
4. Compila i campi obbligatori:
   - **App name**: Luca Corrao Website
   - **User support email**: la tua email
   - **Developer contact email**: la tua email
5. Clicca **Save and Continue**
6. In **Scopes**, clicca **Add or Remove Scopes**
7. Seleziona:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`
8. Clicca **Save and Continue**
9. In **Test users**, aggiungi la tua email (se l'app è in modalità test)
10. Clicca **Save and Continue** e poi **Back to Dashboard**

### 1.4 Crea le Credenziali OAuth
1. Vai su **API & Services** → **Credentials**
2. Clicca **Create Credentials** → **OAuth Client ID**
3. Seleziona **Application type**: **Web application**
4. **Name**: Supabase Auth
5. **Authorized JavaScript origins**:
   ```
   https://txszcieimfzqthkdzceb.supabase.co
   ```
6. **Authorized redirect URIs**:
   ```
   https://txszcieimfzqthkdzceb.supabase.co/auth/v1/callback
   ```
7. Clicca **Create**
8. **Salva** il **Client ID** e il **Client Secret** che appaiono

---

## Passo 2: Configurare Supabase

### 2.1 Vai al Dashboard Supabase
1. Apri [Supabase Dashboard](https://supabase.com/dashboard/project/txszcieimfzqthkdzceb)
2. Vai su **Authentication** → **Providers**

### 2.2 Abilita Google Provider
1. Trova **Google** nella lista dei provider
2. Attiva lo switch per abilitarlo
3. Incolla il **Client ID** di Google
4. Incolla il **Client Secret** di Google
5. Lascia gli altri campi di default
6. Clicca **Save**

---

## Passo 3: Testa l'Autenticazione

### 3.1 Riavvia il Dev Server
```bash
npm run dev
```

### 3.2 Prova il Login
1. Apri http://localhost:3000
2. Clicca su **"Registrati"**
3. Clicca su **"Continua con Google"**
4. Dovresti essere reindirizzato a Google per l'autenticazione
5. Dopo l'autenticazione, verrai riportato al sito

### 3.3 Verifica l'Utente in Supabase
1. Vai su **Authentication** → **Users** nel dashboard Supabase
2. Dovresti vedere il tuo utente appena registrato!

---

## Passo 4: Aggiorna gli URL per la Produzione

Quando deploi in produzione (es. Vercel):

### 4.1 Google Cloud Console
1. Vai su **Credentials** → **OAuth 2.0 Client IDs**
2. Clicca sul tuo Client ID
3. Aggiungi agli **Authorized JavaScript origins**:
   ```
   https://tuosito.com
   https://tuosito.vercel.app
   ```
4. Aggiungi agli **Authorized redirect URIs**:
   ```
   https://txszcieimfzqthkdzceb.supabase.co/auth/v1/callback
   ```
5. Salva

### 4.2 Vercel (o altro hosting)
Aggiungi le variabili d'ambiente:
```
NEXT_PUBLIC_SUPABASE_URL=https://txszcieimfzqthkdzceb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4c3pjaWVpbWZ6cXRoa2R6Y2ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NDkzODEsImV4cCI6MjA3ODAyNTM4MX0.mTJH6CkBexFlPEuoiziFRFlmDpbtauuAIjpCSpQdJuk
```

---

## ✅ Checklist Completa

- [ ] Progetto Google Cloud creato
- [ ] Google+ API abilitata
- [ ] OAuth consent screen configurata
- [ ] Credenziali OAuth create (Client ID e Secret salvati)
- [ ] Google provider abilitato in Supabase
- [ ] Client ID e Secret inseriti in Supabase
- [ ] Test del login con Google funzionante
- [ ] Utente visibile nel dashboard Supabase

---

## 🆘 Troubleshooting

### Errore: "redirect_uri_mismatch"
**Soluzione**: Verifica che l'URI di redirect in Google Cloud Console sia esattamente:
```
https://txszcieimfzqthkdzceb.supabase.co/auth/v1/callback
```

### Errore: "Access blocked: This app's request is invalid"
**Soluzione**: Completa la configurazione della schermata di consenso OAuth in Google Cloud Console

### L'utente non appare in Supabase
**Soluzione**: 
1. Controlla i log in **Authentication** → **Logs**
2. Verifica che il provider Google sia abilitato
3. Controlla che Client ID e Secret siano corretti

---

## 📚 Risorse Utili

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Your Supabase Project](https://supabase.com/dashboard/project/txszcieimfzqthkdzceb)


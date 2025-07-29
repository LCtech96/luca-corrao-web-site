# 🔗 Configurazione Webhook Clerk

## 📋 Panoramica

Questo documento spiega come configurare i webhook di Clerk per registrare automaticamente gli account utenti nel sistema.

## 🎯 Funzionalità Implementate

### ✅ Webhook Handler
- **File**: `app/api/webhook/clerk/route.ts`
- **Funzione**: Gestisce gli eventi di Clerk (registrazione, aggiornamento, eliminazione utenti)
- **Sicurezza**: Verifica delle firme Svix per autenticare le richieste

### ✅ Servizio Utenti
- **File**: `lib/user-service.ts`
- **Funzione**: Gestisce i dati degli utenti nel database locale
- **Operazioni**: Creazione, lettura, aggiornamento, eliminazione utenti

### ✅ API Utenti
- **File**: `app/api/users/route.ts`
- **Funzione**: Fornisce endpoint per visualizzare gli utenti registrati
- **Metodi**: GET (tutti gli utenti), POST (utente specifico)

### ✅ Pagina Amministrazione
- **File**: `app/admin/users/page.tsx`
- **Funzione**: Interfaccia per visualizzare e gestire gli utenti
- **Caratteristiche**: Statistiche, lista utenti, dettagli

## 🔧 Configurazione Webhook

### 1. Dashboard Clerk
1. Vai su [Clerk Dashboard](https://dashboard.clerk.com)
2. Seleziona la tua applicazione
3. Vai su **Webhooks** nel menu laterale

### 2. Crea Webhook
1. Clicca **"Add Endpoint"**
2. **URL**: `https://tuo-dominio.com/api/webhook/clerk`
3. **Version**: Seleziona la versione più recente
4. **Events**: Seleziona tutti gli eventi utente:
   - `user.created`
   - `user.updated`
   - `user.deleted`
   - `session.created`
   - `session.ended`

### 3. Ottieni Webhook Secret
1. Dopo aver creato il webhook, copia il **Webhook Signing Secret**
2. Aggiungi al file `.env.local`:
   ```env
   CLERK_WEBHOOK_SECRET=whsec_tuo_webhook_secret
   ```

## 📊 Eventi Gestiti

### `user.created`
- **Trigger**: Nuovo utente registrato
- **Azione**: Salva i dati dell'utente nel database locale
- **Dati salvati**: ID, email, nome, cognome, stato verifica, ecc.

### `user.updated`
- **Trigger**: Utente aggiorna il profilo
- **Azione**: Aggiorna i dati dell'utente nel database locale

### `user.deleted`
- **Trigger**: Utente eliminato
- **Azione**: Rimuove l'utente dal database locale

### `session.created`
- **Trigger**: Nuova sessione di login
- **Azione**: Log dell'evento (per statistiche)

### `session.ended`
- **Trigger**: Sessione terminata
- **Azione**: Log dell'evento (per statistiche)

## 🚀 Test del Sistema

### 1. Registrazione Utente
1. Vai su `http://localhost:3000/sign-up`
2. Registra un nuovo utente
3. Controlla i log del server per vedere il webhook
4. Vai su `http://localhost:3000/admin/users` per vedere l'utente

### 2. Visualizzazione Utenti
1. Accedi al dashboard: `http://localhost:3000/dashboard`
2. Clicca su "Gestione Utenti"
3. Visualizza la lista degli utenti registrati

### 3. API Test
```bash
# Ottieni tutti gli utenti
curl http://localhost:3000/api/users

# Ottieni utente specifico
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"id":"user_id"}'
```

## 🔒 Sicurezza

### Verifica Firma Webhook
- Tutti i webhook sono verificati usando Svix
- Le richieste non autenticate vengono rifiutate
- Log dettagliati per debugging

### Dati Protetti
- Solo utenti autenticati possono accedere alla pagina admin
- I dati sensibili sono protetti
- Logging sicuro degli eventi

## 📈 Statistiche Disponibili

- **Totale Utenti**: Numero totale di utenti registrati
- **Email Verificate**: Utenti con email verificata
- **Email Non Verificate**: Utenti con email non verificata
- **Nuovi (7 giorni)**: Utenti registrati nell'ultima settimana

## 🛠️ Sviluppo Locale

### Test Webhook
1. Usa [ngrok](https://ngrok.com) per esporre il server locale
2. Configura l'URL webhook con l'URL ngrok
3. Testa la registrazione di nuovi utenti

### Debug
- Controlla i log del server per gli eventi webhook
- Usa la console del browser per errori client
- Verifica le risposte API con gli strumenti di sviluppo

## 🎉 Risultato

Con questa configurazione, ogni volta che un utente si registra tramite Clerk:
1. ✅ I dati vengono automaticamente salvati nel database locale
2. ✅ L'utente appare nella pagina di amministrazione
3. ✅ Le statistiche vengono aggiornate in tempo reale
4. ✅ Il sistema è sicuro e verificato

Il sistema è ora completamente funzionante per la registrazione e gestione degli account utenti! 🚀 
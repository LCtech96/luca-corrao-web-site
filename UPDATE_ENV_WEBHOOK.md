# 🔧 Aggiorna File .env.local

## 📝 Aggiungi Webhook Secret

Aggiungi questa riga al tuo file `.env.local`:

```env
# Clerk Webhook Secret (da configurare nel dashboard Clerk)
CLERK_WEBHOOK_SECRET=whsec_tuo_webhook_secret_qui
```

## 🔗 Configurazione Webhook

1. **Vai su Clerk Dashboard**: https://dashboard.clerk.com
2. **Seleziona la tua app**
3. **Vai su Webhooks** nel menu laterale
4. **Clicca "Add Endpoint"**
5. **Configura**:
   - URL: `https://tuo-dominio.com/api/webhook/clerk`
   - Version: Più recente
   - Events: Seleziona tutti gli eventi utente
6. **Copia il Webhook Signing Secret**
7. **Sostituisci** `whsec_tuo_webhook_secret_qui` con il secret reale

## 📋 File .env.local Completo

Il tuo file `.env.local` dovrebbe contenere:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Y2hhcm1pbmctbWVlcmthdC02NC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_uvan2NnFpfpIxK8FOLJvovoWPR6OEHWf9bGODkhm3S

# Clerk Webhook Secret (da configurare)
CLERK_WEBHOOK_SECRET=whsec_tuo_webhook_secret_qui

# Brevo API Key
BREVO_API_KEY=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
```

## ✅ Dopo l'aggiornamento

1. **Riavvia il server**: `npm run dev`
2. **Testa la registrazione**: Vai su `http://localhost:3000/sign-up`
3. **Verifica i log**: Controlla la console per i messaggi webhook
4. **Controlla gli utenti**: Vai su `http://localhost:3000/admin/users` 
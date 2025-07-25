# Configurazione Google OAuth per il Sito

## Credenziali Configurate

Le seguenti credenziali OAuth sono già configurate nel sistema:

- **Client ID**: `42904699184-itfale5a6vvh6r9i1p8m5i7v77md8nt4.apps.googleusercontent.com`
- **Client Secret**: `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`
- **Redirect URI**: `http://localhost:3000/api/auth/google/callback`

## Funzionalità Implementate

### 1. Autenticazione OAuth
- **Flusso OAuth 2.0** completo con Google
- **Scopes**: Accesso a Google Sheets e email utente
- **Token management**: Gestione automatica dei token di accesso

### 2. API Endpoints
- `GET /api/auth/google` - Genera URL di autorizzazione
- `GET /api/auth/google/callback` - Gestisce il callback OAuth
- `GET/POST/PUT/DELETE /api/spreadsheet` - Operazioni sulla spreadsheet

### 3. Componenti React
- `GoogleAuthButton` - Pulsante di autenticazione
- Gestione automatica dei token nel localStorage

## Come Funziona

1. **Utente clicca "Accedi con Google"**
2. **Si apre una finestra popup** con l'autorizzazione Google
3. **Utente autorizza l'accesso** alla spreadsheet
4. **Google restituisce un codice** di autorizzazione
5. **Il sistema scambia il codice** con token di accesso
6. **I token vengono salvati** e utilizzati per le operazioni

## Sicurezza

- **Token temporanei**: I token di accesso scadono automaticamente
- **Refresh token**: Per rinnovare l'accesso senza re-autorizzazione
- **Validazione token**: Verifica automatica della validità dei token
- **Scope limitati**: Solo accesso alle spreadsheet necessarie

## Configurazione Produzione

Per il deployment in produzione:

1. **Aggiorna Redirect URI**:
   ```
   https://tuodominio.com/api/auth/google/callback
   ```

2. **Configura HTTPS**: Google OAuth richiede HTTPS in produzione

3. **Gestione token sicura**: In produzione, salva i token in un database sicuro invece che localStorage

## Troubleshooting

### Errori Comuni

1. **"redirect_uri_mismatch"**
   - Verifica che il Redirect URI sia configurato correttamente in Google Console

2. **"invalid_client"**
   - Verifica che Client ID e Client Secret siano corretti

3. **"access_denied"**
   - L'utente ha negato l'autorizzazione

### Debug

- Controlla i log del server per errori dettagliati
- Verifica la console del browser per errori JavaScript
- Usa gli strumenti di sviluppo per monitorare le chiamate API

## Prossimi Passi

1. **Testa l'autenticazione** in locale
2. **Verifica l'accesso** alla spreadsheet
3. **Testa le operazioni** CRUD sulla spreadsheet
4. **Configura per produzione** quando pronto 
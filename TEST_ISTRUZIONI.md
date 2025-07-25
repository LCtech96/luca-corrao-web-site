# Test Sistema di Registrazione

## 🚀 **Come Testare**

### **1. Apri il Sito**
- Vai su `http://localhost:3003`
- Clicca su "Registrati" nella barra di navigazione

### **2. Compila il Form**
- **Email**: Inserisci una email valida (es. `test@example.com`)
- **Password**: Almeno 8 caratteri (es. `password123`)
- **Conferma Password**: Stessa password
- **Cognome madre**: Inserisci un nome (es. `Rossi`)

### **3. Clicca "Registrati"**
- Dovrebbe apparire la schermata di verifica
- **IMPORTANTE**: Guarda il box blu con il "Codice di debug"
- Il codice sarà qualcosa come `12345` o `67890`

### **4. Inserisci il Codice**
- Copia il codice dal box blu
- Incollalo nel campo "Codice di verifica"
- Clicca "Verifica Email"

### **5. Verifica Completata**
- Dovrebbe apparire "Registrazione completata!"
- Ora puoi testare il login

## 🔍 **Debug e Log**

### **Console del Browser**
1. Apri gli strumenti di sviluppo (F12)
2. Vai alla tab "Console"
3. Vedrai i log dettagliati:
   ```
   Iniziando registrazione per: test@example.com
   Invio richiesta: {action: "register", email: "test@example.com", ...}
   Risposta ricevuta, status: 200
   Codice di debug ricevuto: 12345
   ```

### **Console del Server**
Nel terminale dove hai avviato `npm run dev`, vedrai:
```
API Auth chiamata con: { action: 'register', email: 'test@example.com' }
Codice generato per test@example.com: 12345
📧 Email di verifica inviata a test@example.com con codice: 12345
```

## 🛠️ **Risoluzione Problemi**

### **Errore "Codice di verifica non corretto"**
1. **Controlla il codice di debug**: È visibile nel box blu?
2. **Copia esattamente**: Non aggiungere spazi
3. **Verifica la console**: I log mostrano il codice corretto?

### **Non vedo il codice di debug**
1. **Controlla la console**: Ci sono errori?
2. **Verifica la risposta**: Status 200?
3. **Riprova**: A volte serve un refresh

### **Errore di connessione**
1. **Verifica il server**: È in esecuzione su porta 3003?
2. **Controlla l'URL**: `http://localhost:3003/api/auth`
3. **Riprova**: A volte è un problema temporaneo

## 📋 **Test Completo**

### **Sequenza di Test**
1. ✅ Registrazione con email valida
2. ✅ Visualizzazione codice di debug
3. ✅ Verifica con codice corretto
4. ✅ Completamento registrazione
5. ✅ Test login con credenziali
6. ✅ Test caricamento strutture (solo utenti registrati)

### **Test di Sicurezza**
- ❌ Registrazione con email non valida
- ❌ Registrazione con password corta
- ❌ Verifica con codice sbagliato
- ❌ Verifica con codice scaduto

## 🎯 **Risultato Atteso**

Dopo una registrazione riuscita:
- ✅ Utente registrato nel localStorage
- ✅ Email salvata per il login
- ✅ Stato di verifica attivo
- ✅ Accesso alle funzionalità riservate

## 🔧 **Configurazione Avanzata**

### **Per Abilitare Email Reali**
1. Installa nodemailer: `npm install nodemailer`
2. Configura le credenziali email in `.env.local`
3. Sostituisci le funzioni simulate in `app/api/auth/route.ts`

### **Per Salvare nel Database**
1. Configura Google Sheets API
2. Sostituisci il localStorage con chiamate al database
3. Implementa persistenza dei dati utente 
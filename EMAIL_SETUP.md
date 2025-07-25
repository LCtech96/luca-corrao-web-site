# Configurazione Email per il Sito

## Setup Email Gmail

Per abilitare l'invio di email di verifica e recupero password, segui questi passaggi:

### 1. Abilita l'autenticazione a due fattori su Gmail
- Vai su https://myaccount.google.com/
- Seleziona "Sicurezza"
- Abilita "Verifica in due passaggi"

### 2. Genera una password per le app
- Vai su https://myaccount.google.com/apppasswords
- Seleziona "App" e scegli "Altro (nome personalizzato)"
- Inserisci un nome (es. "Luca Corrao Website")
- Copia la password generata (16 caratteri)

### 3. Configura le variabili d'ambiente
Crea un file `.env.local` nella root del progetto con:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-16-chars
```

### 4. Test dell'invio email
Una volta configurato, il sistema invierà automaticamente:
- Email di verifica durante la registrazione
- Email di recupero password

## Note Importanti

- **EMAIL_USER**: La tua email Gmail completa
- **EMAIL_PASS**: La password per le app generata (16 caratteri)
- Non utilizzare la password normale di Gmail
- La password per le app è sicura e può essere revocata in qualsiasi momento

## Troubleshooting

Se le email non vengono inviate:
1. Verifica che l'autenticazione a due fattori sia abilitata
2. Controlla che la password per le app sia corretta
3. Verifica che le variabili d'ambiente siano configurate correttamente
4. Controlla i log del server per errori specifici

## Sicurezza

- Non committare mai il file `.env.local` nel repository
- La password per le app è sicura e può essere revocata
- Le email contengono solo codici di verifica temporanei 
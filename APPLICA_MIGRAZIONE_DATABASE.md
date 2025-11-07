# Applicare la Migrazione Database - Istruzioni

## ⚠️ IMPORTANTE: Applica la Migrazione al Database

Ho creato una nuova migrazione database che **DEVE** essere applicata al tuo database Supabase per far funzionare tutte le nuove funzionalità.

## 📁 File da Applicare

```
supabase/migrations/003_user_roles_and_profiles.sql
```

## 🚀 Metodo 1: Supabase Dashboard (Consigliato)

1. **Apri Supabase Dashboard**
   - Vai su: https://supabase.com/dashboard
   - Seleziona il tuo progetto

2. **SQL Editor**
   - Nel menu laterale, clicca su "SQL Editor"
   - Clicca su "New query"

3. **Copia e Incolla**
   - Apri il file `supabase/migrations/003_user_roles_and_profiles.sql`
   - Copia TUTTO il contenuto
   - Incolla nell'editor SQL di Supabase

4. **Esegui**
   - Clicca "Run" (o Ctrl/Cmd + Enter)
   - Attendi il completamento
   - Verifica che non ci siano errori

## 🖥️ Metodo 2: Supabase CLI (Avanzato)

Se hai Supabase CLI installato:

```bash
# Assicurati di essere nella directory del progetto
cd C:\Users\luca\Desktop\luca-corrao-web-site-main

# Applica la migrazione
supabase db push

# OPPURE applica manualmente
supabase db execute --file supabase/migrations/003_user_roles_and_profiles.sql
```

## ✅ Verifica che la Migrazione sia Applicata

Dopo aver applicato la migrazione, verifica nel SQL Editor di Supabase:

```sql
-- Verifica che la tabella user_profiles esista
SELECT * FROM user_profiles LIMIT 1;

-- Verifica le funzioni
SELECT proname FROM pg_proc WHERE proname IN ('handle_new_user', 'request_host_status', 'verify_host');

-- Verifica le policy RLS
SELECT tablename, policyname FROM pg_policies WHERE tablename = 'user_profiles';
```

## 📋 Cosa Crea Questa Migrazione

### Tabelle
- ✅ `user_profiles` - Profili utente con ruoli

### Funzioni
- ✅ `handle_new_user()` - Crea automaticamente profilo alla registrazione
- ✅ `request_host_status()` - Permette richiesta status host
- ✅ `verify_host()` - Admin approva host

### Trigger
- ✅ `on_auth_user_created` - Trigger automatico su nuova registrazione

### Views
- ✅ `admin_all_users` - Vista admin di tutti gli utenti

### Policy RLS (Row Level Security)
- ✅ Utenti vedono solo il proprio profilo
- ✅ Tutti vedono profili host pubblici
- ✅ Admin vedono tutto
- ✅ Proprietà pubbliche per tutti

### Aggiornamenti
- ✅ Policy accommodations aggiornate per supportare host
- ✅ Colonne `owner_id` e `owner_profile_name` aggiunte

## 🔧 Risoluzione Problemi

### Errore: "relation already exists"
Se hai già applicato parti della migrazione:

```sql
-- Verifica cosa esiste già
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Se user_profiles esiste già, puoi droppare e ricreare
DROP TABLE IF EXISTS user_profiles CASCADE;
-- Poi ri-esegui la migrazione completa
```

### Errore: "permission denied"
Assicurati di essere connesso come proprietario del database (di solito il ruolo `postgres` in Supabase).

### Errore: "function already exists"
```sql
-- Droppa le funzioni esistenti
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS request_host_status(TEXT, TEXT, TEXT[]) CASCADE;
DROP FUNCTION IF EXISTS verify_host(TEXT, TEXT) CASCADE;
-- Poi ri-esegui la migrazione
```

## 🎯 Dopo l'Applicazione

Una volta applicata la migrazione, il sistema sarà in grado di:

1. ✅ Creare profili utente automaticamente
2. ✅ Gestire ruoli (admin, host, guest)
3. ✅ Permettere richieste host
4. ✅ Admin può approvare host
5. ✅ Host possono listare proprietà
6. ✅ Utenti non registrati vedono proprietà

## 📞 Supporto

Se incontri problemi:

1. Controlla i log di errore in Supabase
2. Verifica che tutte le email admin siano corrette nella migrazione
3. Assicurati che Supabase Auth sia abilitato
4. Controlla che RLS sia abilitato per le tabelle

## ⚡ Quick Test

Dopo l'applicazione, testa:

```sql
-- Test 1: Verifica che la tabella esista
SELECT COUNT(*) FROM user_profiles;

-- Test 2: Verifica che le policy funzionino
SELECT * FROM user_profiles WHERE email = 'luca@bedda.tech';

-- Test 3: Verifica funzione request_host_status
SELECT request_host_status('test@example.com', 'Test bio', ARRAY['Italiano', 'Inglese']);
```

---

**IMPORTANTE**: Questa migrazione è necessaria per tutte le nuove funzionalità. Applicala prima di testare il sito! 🚀


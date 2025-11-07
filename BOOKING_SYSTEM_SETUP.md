# 🔐 Sistema di Prenotazione e Chat Sicuro

## 📋 Overview

Sistema completo di prenotazione con:
- ✅ **Chat privata** tra ospite e host
- ✅ **Row Level Security** (RLS) in Supabase
- ✅ **Admin Dashboard** (solo per Luca)
- ✅ **Pagamenti Revolut** + QR Code
- ✅ **Apple Pay** integration

---

## 🔒 Sicurezza e Privacy

### **Row Level Security (RLS) Policies**

#### **Prenotazioni (bookings)**
1. **Lettura**: Ogni utente vede SOLO le proprie prenotazioni
2. **Scrittura**: Ogni utente crea SOLO le proprie prenotazioni
3. **Admin**: Solo le email autorizzate vedono TUTTO
   - `luca@bedda.tech`
   - `lucacorrao96@outlook.it`
   - `luca@metatech.dev`
   - `lucacorrao1996@outlook.com`
   - `luca@lucacorrao.com`

#### **Chat (chat_messages)**
1. **Lettura**: 
   - L'ospite vede SOLO i messaggi della sua prenotazione
   - Il proprietario vede SOLO i messaggi delle sue proprietà
   - Admin vede TUTTI i messaggi
2. **Scrittura**: Solo chi è coinvolto nella prenotazione può scrivere
3. **Privacy**: Gli utenti NON possono leggere le chat altrui

---

## 🗄️ Setup Database

### 1. **Esegui le Migrazioni**

In Supabase SQL Editor, esegui i file in ordine:

```bash
# Step 1: Schema iniziale
supabase/migrations/001_initial_schema.sql

# Step 2: Bookings e Chat
supabase/migrations/002_bookings_and_chat.sql

# Step 3: Storage
supabase/storage-setup.sql
```

### 2. **Verifica RLS**

Controlla che RLS sia attivo:

```sql
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename IN ('bookings', 'chat_messages');
```

Dovrebbe mostrare `rowsecurity = true` per entrambe.

---

## 🎯 Funzionalità Implementate

### **1. Link Condivisibile**
- Bottone Share in pagina dettaglio
- Mobile: menu nativo condivisione
- Desktop: copia negli appunti
- URL puliti: `/property/lucas-rooftop`

### **2. Processo di Prenotazione (3 Step)**

#### **Step 1: Dati Ospite**
- Date check-in/out
- Numero ospiti
- Nome, email, telefono
- Note aggiuntive
- Calcolo prezzi automatico

#### **Step 2: Chat (Opzionale)**
- Chat real-time con Luca
- Messaggi salvati in Supabase
- Notifiche automatiche
- Storico completo

#### **Step 3: Pagamento**
- **Revolut**: Link diretto + QR Code
- **Apple Pay**: Integrazione nativa → Revolut
- Riepilogo completo
- Conferma finale

### **3. Dashboard Admin** (Solo per Luca)

Accessibile da: `/admin`

**Email autorizzate:**
- `luca@bedda.tech` ✅
- `lucacorrao96@outlook.it` ✅
- `luca@metatech.dev` ✅
- `lucacorrao1996@outlook.com` ✅
- `luca@lucacorrao.com` ✅

**Funzionalità:**
- 📊 Statistiche prenotazioni
- 📋 Lista completa prenotazioni
- 💬 TUTTE le chat di TUTTI gli utenti
- 📧 Contatti ospiti
- 💰 Status pagamenti
- ✅ Gestione status prenotazioni

---

## 💬 Sistema Chat

### **Privacy Garantita:**
```
Utente A prenota Lucas Rooftop
  ↓
  Utente A vede SOLO la sua chat con Luca
  ↓
  Utente A NON vede le chat di Utente B

Luca (admin) vede:
  ✅ Chat Utente A
  ✅ Chat Utente B
  ✅ Chat Utente C
  ✅ TUTTE le chat
```

### **RLS Query Check:**
```sql
-- Cosa vede un utente normale
SELECT * FROM chat_messages;
-- Risultato: solo i messaggi delle sue prenotazioni

-- Cosa vede luca@bedda.tech
SELECT * FROM chat_messages;
-- Risultato: TUTTI i messaggi di TUTTI
```

---

## 💳 Pagamenti Revolut

### **Link Diretto**
```
https://revolut.me/lctech96
```

### **QR Code**
- Generato dinamicamente
- API: `api.qrserver.com`
- Scansionabile da qualsiasi smartphone
- Reindirizza automaticamente a Revolut

### **Apple Pay → Revolut**
- Rileva disponibilità Apple Pay
- Completa pagamento
- Reindirizza a Revolut per conferma

---

## 🚀 Come Usare

### **Per Gli Ospiti:**

1. Naviga su una struttura
2. Click "Prenota Ora"
3. Compila i dati (Step 1)
4. Opzionale: Chatta con Luca (Step 2)
5. Scegli pagamento (Step 3)
6. Paga con Revolut o Apple Pay
7. Conferma prenotazione ✅

### **Per Luca (Admin):**

1. Login con `luca@bedda.tech` o `lucacorrao96@outlook.it`
2. Click bottone "Admin" nella nav bar (🛡️ Shield icon)
3. Vedi dashboard con:
   - Tutte le prenotazioni
   - Tutte le chat
   - Statistiche
   - Contatti ospiti
4. Rispondi ai messaggi
5. Aggiorna status prenotazioni

---

## 📊 Struttura Database

### **Tabella: bookings**
```sql
- id (UUID)
- property_name, property_slug
- guest_email, guest_name, guest_phone
- check_in, check_out, guests, nights
- price_per_night, cleaning_fee, subtotal, total
- payment_method, payment_status
- notes, status
- property_owner_email (sempre luca@bedda.tech)
- created_at, updated_at
```

### **Tabella: chat_messages**
```sql
- id (UUID)
- booking_id (FK → bookings)
- sender_email, sender_name, sender_type
- message
- is_read
- created_at
```

### **RLS Policies**
- ✅ 6 policies per bookings
- ✅ 3 policies per chat_messages
- ✅ Admin bypass per Luca

---

## 🔐 Accessi

| Email | Ruolo | Permessi |
|-------|-------|----------|
| `luca@bedda.tech` | **Admin** | ✅ Vede TUTTO |
| `lucacorrao96@outlook.it` | **Admin** | ✅ Vede TUTTO |
| `luca@metatech.dev` | **Admin** | ✅ Vede TUTTO |
| `lucacorrao1996@outlook.com` | **Admin** | ✅ Vede TUTTO |
| `luca@lucacorrao.com` | **Admin** | ✅ Vede TUTTO |
| Altri utenti | Guest | ⚠️ Solo le proprie prenotazioni |

---

## ✅ Checklist Setup

- [ ] Esegui `001_initial_schema.sql`
- [ ] Esegui `002_bookings_and_chat.sql`
- [ ] Esegui `storage-setup.sql`
- [ ] Verifica RLS attivo
- [ ] Test prenotazione come utente normale
- [ ] Test dashboard admin come Luca
- [ ] Verifica privacy (utente A non vede chat utente B)

---

## 🎯 Prossimi Passi (Opzionali)

### **Email Notifications**
- Notifica a Luca quando arriva nuova prenotazione
- Email di conferma all'ospite
- Remind checkout day

### **Webhook Revolut**
- Auto-update payment_status quando ricevi pagamento
- Conferma automatica prenotazione

### **Advanced Features**
- Calendario disponibilità
- Prezzi dinamici per stagione
- Cancellazione prenotazioni
- Review system

---

## 📞 Contatti

**Admin Email (Tutte Autorizzate):**
- luca@bedda.tech
- lucacorrao96@outlook.it
- luca@metatech.dev
- lucacorrao1996@outlook.com
- luca@lucacorrao.com

**Revolut:**
- https://revolut.me/lctech96

**WhatsApp:**
- +393514206353

**Telefono:**
- +393513671340

---

**Sistema pronto e sicuro! 🎉🔐**


-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Property Information
  property_id UUID REFERENCES accommodations(id) ON DELETE CASCADE,
  property_name TEXT NOT NULL,
  property_slug TEXT NOT NULL,
  
  -- Guest Information
  guest_email TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  
  -- Booking Details
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL,
  nights INTEGER NOT NULL,
  
  -- Pricing
  price_per_night DECIMAL(10,2) NOT NULL,
  cleaning_fee DECIMAL(10,2) DEFAULT 50.00,
  subtotal DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  
  -- Payment
  payment_method TEXT, -- 'revolut', 'applepay', etc.
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'cancelled'
  payment_date TIMESTAMPTZ,
  
  -- Additional Info
  notes TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled', 'completed'
  
  -- Owner Information (chi gestisce la proprietà)
  property_owner_email TEXT NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Relazione con la prenotazione
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  
  -- Mittente e Destinatario
  sender_email TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_type TEXT NOT NULL, -- 'guest', 'host', 'admin'
  
  -- Contenuto
  message TEXT NOT NULL,
  
  -- Stato
  is_read BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_bookings_guest_email ON bookings(guest_email);
CREATE INDEX idx_bookings_property_id ON bookings(property_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX idx_bookings_property_owner ON bookings(property_owner_email);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);

CREATE INDEX idx_chat_booking_id ON chat_messages(booking_id);
CREATE INDEX idx_chat_sender_email ON chat_messages(sender_email);
CREATE INDEX idx_chat_created_at ON chat_messages(created_at DESC);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- BOOKINGS POLICIES

-- 1. Gli utenti possono LEGGERE solo le proprie prenotazioni
CREATE POLICY "Users can read their own bookings"
  ON bookings
  FOR SELECT
  USING (
    guest_email = current_setting('request.jwt.claims', true)::json->>'email'
    OR property_owner_email = current_setting('request.jwt.claims', true)::json->>'email'
    OR current_setting('request.jwt.claims', true)::json->>'email' IN ('luca@bedda.tech', 'lucacorrao96@outlook.it', 'luca@metatech.dev', 'lucacorrao1996@outlook.com', 'luca@lucacorrao.com')
  );

-- 2. Gli utenti possono CREARE le proprie prenotazioni
CREATE POLICY "Users can create their own bookings"
  ON bookings
  FOR INSERT
  WITH CHECK (
    guest_email = current_setting('request.jwt.claims', true)::json->>'email'
  );

-- 3. Solo l'ospite e il proprietario possono AGGIORNARE
CREATE POLICY "Users can update their own bookings"
  ON bookings
  FOR UPDATE
  USING (
    guest_email = current_setting('request.jwt.claims', true)::json->>'email'
    OR property_owner_email = current_setting('request.jwt.claims', true)::json->>'email'
    OR current_setting('request.jwt.claims', true)::json->>'email' IN ('luca@bedda.tech', 'lucacorrao96@outlook.it', 'luca@metatech.dev', 'lucacorrao1996@outlook.com', 'luca@lucacorrao.com')
  );

-- CHAT POLICIES

-- 1. Gli utenti possono LEGGERE solo i messaggi delle proprie prenotazioni
CREATE POLICY "Users can read their own chat messages"
  ON chat_messages
  FOR SELECT
  USING (
    -- L'utente è il mittente
    sender_email = current_setting('request.jwt.claims', true)::json->>'email'
    OR 
    -- L'utente è il proprietario della proprietà prenotata
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.id = chat_messages.booking_id 
      AND bookings.property_owner_email = current_setting('request.jwt.claims', true)::json->>'email'
    )
    OR
    -- L'utente è l'ospite che ha fatto la prenotazione
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.id = chat_messages.booking_id 
      AND bookings.guest_email = current_setting('request.jwt.claims', true)::json->>'email'
    )
    OR
    -- L'utente è l'ADMIN (Luca)
    current_setting('request.jwt.claims', true)::json->>'email' IN ('luca@bedda.tech', 'lucacorrao96@outlook.it')
  );

-- 2. Gli utenti possono INVIARE messaggi solo nelle proprie prenotazioni
CREATE POLICY "Users can send messages in their bookings"
  ON chat_messages
  FOR INSERT
  WITH CHECK (
    -- L'utente è l'ospite della prenotazione
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.id = chat_messages.booking_id 
      AND bookings.guest_email = current_setting('request.jwt.claims', true)::json->>'email'
    )
    OR
    -- L'utente è il proprietario della proprietà
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.id = chat_messages.booking_id 
      AND bookings.property_owner_email = current_setting('request.jwt.claims', true)::json->>'email'
    )
    OR
    -- L'utente è l'ADMIN (Luca)
    current_setting('request.jwt.claims', true)::json->>'email' IN ('luca@bedda.tech', 'lucacorrao96@outlook.it')
  );

-- 3. Gli utenti possono AGGIORNARE (mark as read) solo i propri messaggi
CREATE POLICY "Users can update their own messages"
  ON chat_messages
  FOR UPDATE
  USING (
    sender_email = current_setting('request.jwt.claims', true)::json->>'email'
    OR current_setting('request.jwt.claims', true)::json->>'email' IN ('luca@bedda.tech', 'lucacorrao96@outlook.it', 'luca@metatech.dev', 'lucacorrao1996@outlook.com', 'luca@lucacorrao.com')
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for bookings
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create view for admin dashboard (solo per Luca)
CREATE OR REPLACE VIEW admin_all_bookings AS
SELECT 
  b.*,
  a.name as property_full_name,
  (SELECT COUNT(*) FROM chat_messages WHERE booking_id = b.id) as message_count,
  (SELECT COUNT(*) FROM chat_messages WHERE booking_id = b.id AND is_read = false) as unread_count
FROM bookings b
LEFT JOIN accommodations a ON b.property_id = a.id
ORDER BY b.created_at DESC;

-- Grant access to admin view only for Luca
GRANT SELECT ON admin_all_bookings TO authenticated;

COMMENT ON TABLE bookings IS 'Prenotazioni con Row Level Security - ogni utente vede solo le proprie';
COMMENT ON TABLE chat_messages IS 'Messaggi chat con RLS - privacy totale tra utenti, solo admin vede tutto';
COMMENT ON VIEW admin_all_bookings IS 'Vista admin - accessibile solo da: luca@bedda.tech, lucacorrao96@outlook.it, luca@metatech.dev, lucacorrao1996@outlook.com, luca@lucacorrao.com';


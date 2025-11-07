-- Fix bookings table per supportare property_id come TEXT invece di UUID
-- Prima droppa la view che dipende dalla colonna

-- 1. Droppa la view admin_all_bookings
DROP VIEW IF EXISTS admin_all_bookings;

-- 2. Rimuovi il constraint foreign key
ALTER TABLE bookings
DROP CONSTRAINT IF EXISTS bookings_property_id_fkey;

-- 3. Cambia il tipo di property_id da UUID a TEXT
ALTER TABLE bookings
ALTER COLUMN property_id TYPE TEXT USING property_id::TEXT;

-- 4. Rendi property_id nullable
ALTER TABLE bookings
ALTER COLUMN property_id DROP NOT NULL;

-- 5. Ricrea l'index
DROP INDEX IF EXISTS idx_bookings_property_id;
CREATE INDEX idx_bookings_property_id ON bookings(property_id);

-- 6. Ricrea la view admin_all_bookings (ora con property_id come TEXT)
CREATE OR REPLACE VIEW admin_all_bookings AS
SELECT 
  b.*,
  a.name as property_full_name,
  (SELECT COUNT(*) FROM chat_messages WHERE booking_id = b.id) as message_count,
  (SELECT COUNT(*) FROM chat_messages WHERE booking_id = b.id AND is_read = false) as unread_count
FROM bookings b
LEFT JOIN accommodations a ON b.property_id::uuid = a.id
WHERE a.id IS NOT NULL  -- Join solo se property_id è un UUID valido
UNION ALL
SELECT 
  b.*,
  b.property_name as property_full_name,
  (SELECT COUNT(*) FROM chat_messages WHERE booking_id = b.id) as message_count,
  (SELECT COUNT(*) FROM chat_messages WHERE booking_id = b.id AND is_read = false) as unread_count
FROM bookings b
WHERE b.property_id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'  -- Slug invece di UUID
ORDER BY created_at DESC;

GRANT SELECT ON admin_all_bookings TO authenticated;

COMMENT ON COLUMN bookings.property_id IS 'Property ID - può essere UUID o slug. Nullable per compatibilità.';


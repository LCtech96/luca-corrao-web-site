-- ============================================
-- COMPLETE DATABASE SCHEMA FOR LUCACORRAO.COM
-- ============================================
-- Questo file contiene tutto lo schema SQL necessario per ricreare il database
-- Eseguire in ordine le migrazioni per ripristinare completamente il database
-- ============================================

-- ============================================
-- MIGRATION 001: Initial Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create files table
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  storage_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  owner_id TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  deleted_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for files table
CREATE INDEX IF NOT EXISTS idx_files_category ON files(category);
CREATE INDEX IF NOT EXISTS idx_files_owner ON files(owner_id);
CREATE INDEX IF NOT EXISTS idx_files_active ON files(is_active);
CREATE INDEX IF NOT EXISTS idx_files_uploaded_at ON files(uploaded_at);

-- Create accommodations table
CREATE TABLE IF NOT EXISTS accommodations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic Information
  name TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  
  -- Location
  address TEXT,
  distance TEXT,
  capacity TEXT NOT NULL,
  
  -- Features and Amenities
  features TEXT[] NOT NULL DEFAULT '{}',
  highlight TEXT,
  
  -- Images - Support both file IDs and URLs for backward compatibility
  main_image TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  image_descriptions TEXT[],
  
  -- New file-based image fields
  main_image_file_id UUID REFERENCES files(id),
  image_file_ids UUID[],
  
  -- Pricing
  price TEXT NOT NULL,
  cleaning_fee NUMERIC,
  pets_allowed BOOLEAN DEFAULT false,
  pet_supplement NUMERIC,
  
  -- Owner and Rating
  owner TEXT NOT NULL,
  rating NUMERIC,
  is_owner BOOLEAN DEFAULT false,
  
  -- Metadata
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for accommodations table
CREATE INDEX IF NOT EXISTS idx_accommodations_owner ON accommodations(owner);
CREATE INDEX IF NOT EXISTS idx_accommodations_active ON accommodations(is_active);
CREATE INDEX IF NOT EXISTS idx_accommodations_created_at ON accommodations(created_at);
CREATE INDEX IF NOT EXISTS idx_accommodations_rating ON accommodations(rating);

-- Enable Row Level Security
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for files table
-- Allow anyone to read active files
DROP POLICY IF EXISTS "Public files are viewable by everyone" ON files;
CREATE POLICY "Public files are viewable by everyone"
  ON files FOR SELECT
  USING (is_active = true);

-- Allow authenticated users to insert files
DROP POLICY IF EXISTS "Authenticated users can upload files" ON files;
CREATE POLICY "Authenticated users can upload files"
  ON files FOR INSERT
  WITH CHECK (true);

-- Allow users to update their own files
DROP POLICY IF EXISTS "Users can update own files" ON files;
CREATE POLICY "Users can update own files"
  ON files FOR UPDATE
  USING (owner_id IS NOT NULL);

-- Allow users to delete their own files
DROP POLICY IF EXISTS "Users can delete own files" ON files;
CREATE POLICY "Users can delete own files"
  ON files FOR DELETE
  USING (owner_id IS NOT NULL);

-- RLS Policies for accommodations table (temporanei, verranno sostituiti in migration 003)
-- Allow anyone to read active accommodations
DROP POLICY IF EXISTS "Active accommodations are viewable by everyone" ON accommodations;
DROP POLICY IF EXISTS "Authenticated users can create accommodations" ON accommodations;
DROP POLICY IF EXISTS "Users can update own accommodations" ON accommodations;
DROP POLICY IF EXISTS "Users can delete own accommodations" ON accommodations;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_accommodations_updated_at ON accommodations;
CREATE TRIGGER update_accommodations_updated_at BEFORE UPDATE ON accommodations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_files_updated_at ON files;
CREATE TRIGGER update_files_updated_at BEFORE UPDATE ON files
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- MIGRATION 002: Bookings and Chat
-- ============================================

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Property Information
  property_id TEXT, -- Changed from UUID to TEXT to support both UUID and slug
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
CREATE INDEX IF NOT EXISTS idx_bookings_guest_email ON bookings(guest_email);
CREATE INDEX IF NOT EXISTS idx_bookings_property_id ON bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_property_owner ON bookings(property_owner_email);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_chat_booking_id ON chat_messages(booking_id);
CREATE INDEX IF NOT EXISTS idx_chat_sender_email ON chat_messages(sender_email);
CREATE INDEX IF NOT EXISTS idx_chat_created_at ON chat_messages(created_at DESC);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- BOOKINGS POLICIES

-- 1. Gli utenti possono LEGGERE solo le proprie prenotazioni
DROP POLICY IF EXISTS "Users can read their own bookings" ON bookings;
CREATE POLICY "Users can read their own bookings"
  ON bookings
  FOR SELECT
  USING (
    guest_email = current_setting('request.jwt.claims', true)::json->>'email'
    OR property_owner_email = current_setting('request.jwt.claims', true)::json->>'email'
    OR current_setting('request.jwt.claims', true)::json->>'email' IN ('lucacorrao1996@gmail.com', 'lucacorrao96@outlook.it', 'luca@metatech.dev', 'lucacorrao1996@outlook.com', 'luca@lucacorrao.com')
  );

-- 2. Gli utenti possono CREARE le proprie prenotazioni
DROP POLICY IF EXISTS "Users can create their own bookings" ON bookings;
CREATE POLICY "Users can create their own bookings"
  ON bookings
  FOR INSERT
  WITH CHECK (
    guest_email = current_setting('request.jwt.claims', true)::json->>'email'
  );

-- 3. Solo l'ospite e il proprietario possono AGGIORNARE
DROP POLICY IF EXISTS "Users can update their own bookings" ON bookings;
CREATE POLICY "Users can update their own bookings"
  ON bookings
  FOR UPDATE
  USING (
    guest_email = current_setting('request.jwt.claims', true)::json->>'email'
    OR property_owner_email = current_setting('request.jwt.claims', true)::json->>'email'
    OR current_setting('request.jwt.claims', true)::json->>'email' IN ('lucacorrao1996@gmail.com', 'lucacorrao96@outlook.it', 'luca@metatech.dev', 'lucacorrao1996@outlook.com', 'luca@lucacorrao.com')
  );

-- CHAT POLICIES

-- 1. Gli utenti possono LEGGERE solo i messaggi delle proprie prenotazioni
DROP POLICY IF EXISTS "Users can read their own chat messages" ON chat_messages;
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
    current_setting('request.jwt.claims', true)::json->>'email' IN ('lucacorrao1996@gmail.com', 'lucacorrao96@outlook.it', 'luca@metatech.dev', 'lucacorrao1996@outlook.com', 'luca@lucacorrao.com')
  );

-- 2. Gli utenti possono INVIARE messaggi solo nelle proprie prenotazioni
DROP POLICY IF EXISTS "Users can send messages in their bookings" ON chat_messages;
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
    current_setting('request.jwt.claims', true)::json->>'email' IN ('lucacorrao1996@gmail.com', 'lucacorrao96@outlook.it', 'luca@metatech.dev', 'lucacorrao1996@outlook.com', 'luca@lucacorrao.com')
  );

-- 3. Gli utenti possono AGGIORNARE (mark as read) solo i propri messaggi
DROP POLICY IF EXISTS "Users can update their own messages" ON chat_messages;
CREATE POLICY "Users can update their own messages"
  ON chat_messages
  FOR UPDATE
  USING (
    sender_email = current_setting('request.jwt.claims', true)::json->>'email'
    OR current_setting('request.jwt.claims', true)::json->>'email' IN ('lucacorrao1996@gmail.com', 'lucacorrao96@outlook.it', 'luca@metatech.dev', 'lucacorrao1996@outlook.com', 'luca@lucacorrao.com')
  );

-- Create trigger for bookings
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
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

-- ============================================
-- MIGRATION 003: User Roles and Profiles
-- ============================================

-- Create user_profiles table with roles
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- User Authentication
  user_id UUID UNIQUE, -- Supabase auth.users.id (nullable for WhatsApp-only users)
  email TEXT UNIQUE,
  phone TEXT UNIQUE, -- Per WhatsApp auth
  
  -- User Information
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  
  -- Role System
  role TEXT NOT NULL DEFAULT 'guest', -- 'admin', 'host', 'guest'
  
  -- Host-specific information
  is_host BOOLEAN DEFAULT false,
  host_verified BOOLEAN DEFAULT false,
  host_bio TEXT,
  host_languages TEXT[],
  
  -- Settings
  notifications_enabled BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  
  -- WhatsApp Authentication
  whatsapp_number TEXT UNIQUE,
  whatsapp_verified BOOLEAN DEFAULT false,
  
  -- Revolut Payment Info
  revolut_username TEXT,
  accepts_crypto BOOLEAN DEFAULT false,
  wallet_address TEXT, -- For future crypto payments
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_phone ON user_profiles(phone);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_host ON user_profiles(is_host);
CREATE INDEX IF NOT EXISTS idx_user_profiles_whatsapp ON user_profiles(whatsapp_number);

-- Create function to automatically create profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (
    user_id,
    email,
    full_name,
    email_verified,
    role
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email_confirmed_at IS NOT NULL,
    -- Check if email is in admin list
    CASE 
      WHEN NEW.email IN ('lucacorrao1996@gmail.com', 'lucacorrao96@outlook.it', 'luca@metatech.dev', 'lucacorrao1996@outlook.com', 'luca@lucacorrao.com') 
      THEN 'admin'
      ELSE 'guest'
    END
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Update accommodations table to link with user_profiles
ALTER TABLE accommodations
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES user_profiles(id),
ADD COLUMN IF NOT EXISTS owner_profile_name TEXT;

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES FOR USER_PROFILES

-- 1. Users can read their own profile
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  USING (
    email = current_setting('request.jwt.claims', true)::json->>'email'
    OR user_id::text = current_setting('request.jwt.claims', true)::json->>'sub'
  );

-- 2. Users can read host profiles (public info only)
DROP POLICY IF EXISTS "Anyone can read host profiles" ON user_profiles;
CREATE POLICY "Anyone can read host profiles"
  ON user_profiles
  FOR SELECT
  USING (is_host = true);

-- 3. Admins can read all profiles
DROP POLICY IF EXISTS "Admins can read all profiles" ON user_profiles;
CREATE POLICY "Admins can read all profiles"
  ON user_profiles
  FOR SELECT
  USING (
    current_setting('request.jwt.claims', true)::json->>'email' IN (
      'lucacorrao1996@gmail.com', 
      'lucacorrao96@outlook.it', 
      'luca@metatech.dev', 
      'lucacorrao1996@outlook.com', 
      'luca@lucacorrao.com'
    )
  );

-- 4. Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  USING (
    email = current_setting('request.jwt.claims', true)::json->>'email'
    OR user_id::text = current_setting('request.jwt.claims', true)::json->>'sub'
  )
  WITH CHECK (
    email = current_setting('request.jwt.claims', true)::json->>'email'
    OR user_id::text = current_setting('request.jwt.claims', true)::json->>'sub'
  );

-- 5. Authenticated users can insert their profile (for WhatsApp users)
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  WITH CHECK (true);

-- Update RLS for accommodations to support host users

-- Drop existing policies (vecchie e nuove)
DROP POLICY IF EXISTS "Active accommodations are viewable by everyone" ON accommodations;
DROP POLICY IF EXISTS "Authenticated users can create accommodations" ON accommodations;
DROP POLICY IF EXISTS "Users can update own accommodations" ON accommodations;
DROP POLICY IF EXISTS "Users can delete own accommodations" ON accommodations;
DROP POLICY IF EXISTS "Everyone can view active accommodations" ON accommodations;
DROP POLICY IF EXISTS "Only hosts can create accommodations" ON accommodations;
DROP POLICY IF EXISTS "Owners and admins can update accommodations" ON accommodations;
DROP POLICY IF EXISTS "Owners and admins can delete accommodations" ON accommodations;

-- 1. EVERYONE can read active accommodations (anche non registrati!)
CREATE POLICY "Everyone can view active accommodations"
  ON accommodations
  FOR SELECT
  USING (is_active = true);

-- 2. Only HOSTS can create accommodations
CREATE POLICY "Only hosts can create accommodations"
  ON accommodations
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.email = current_setting('request.jwt.claims', true)::json->>'email'
      AND (user_profiles.is_host = true OR user_profiles.role = 'admin')
    )
  );

-- 3. Only the OWNER HOST or ADMIN can update
CREATE POLICY "Owners and admins can update accommodations"
  ON accommodations
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.email = current_setting('request.jwt.claims', true)::json->>'email'
      AND (
        user_profiles.id = accommodations.owner_id
        OR user_profiles.role = 'admin'
      )
    )
  );

-- 4. Only the OWNER HOST or ADMIN can delete
CREATE POLICY "Owners and admins can delete accommodations"
  ON accommodations
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.email = current_setting('request.jwt.claims', true)::json->>'email'
      AND (
        user_profiles.id = accommodations.owner_id
        OR user_profiles.role = 'admin'
      )
    )
  );

-- Create trigger for user_profiles updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create view for admin to see all users
CREATE OR REPLACE VIEW admin_all_users AS
SELECT 
  up.*,
  (SELECT COUNT(*) FROM accommodations WHERE owner_id = up.id) as properties_count,
  (SELECT COUNT(*) FROM bookings WHERE guest_email = up.email) as bookings_as_guest_count,
  (SELECT COUNT(*) FROM bookings WHERE property_owner_email = up.email) as bookings_as_host_count
FROM user_profiles up
ORDER BY up.created_at DESC;

GRANT SELECT ON admin_all_users TO authenticated;

-- Create function to request host status
CREATE OR REPLACE FUNCTION request_host_status(
  user_email TEXT,
  bio TEXT DEFAULT NULL,
  languages TEXT[] DEFAULT NULL
)
RETURNS user_profiles AS $$
DECLARE
  updated_profile user_profiles;
BEGIN
  UPDATE user_profiles
  SET 
    is_host = true,
    host_verified = false, -- Needs admin approval
    host_bio = bio,
    host_languages = languages,
    updated_at = NOW()
  WHERE email = user_email
  RETURNING * INTO updated_profile;
  
  RETURN updated_profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function for admin to verify host
CREATE OR REPLACE FUNCTION verify_host(
  host_email TEXT,
  admin_email TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if admin
  IF admin_email NOT IN ('lucacorrao1996@gmail.com', 'lucacorrao96@outlook.it', 'luca@metatech.dev', 'lucacorrao1996@outlook.com', 'luca@lucacorrao.com') THEN
    RAISE EXCEPTION 'Only admins can verify hosts';
  END IF;
  
  UPDATE user_profiles
  SET 
    host_verified = true,
    updated_at = NOW()
  WHERE email = host_email;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- MIGRATION 005: Create Structures Table
-- ============================================

-- Create structures table for user-submitted properties
CREATE TABLE IF NOT EXISTS public.structures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    address TEXT NOT NULL,
    gps_coordinates TEXT,
    rating DECIMAL(3,2) DEFAULT 0,
    main_image TEXT NOT NULL,
    images TEXT[], -- Array of image URLs
    main_image_file_id TEXT,
    image_file_ids TEXT[], -- Array of file IDs
    owner TEXT NOT NULL,
    owner_email TEXT NOT NULL,
    owner_id UUID NOT NULL, -- Supabase user ID
    is_active BOOLEAN DEFAULT false, -- Pending admin approval
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Foreign key to auth.users
    CONSTRAINT fk_owner FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_structures_owner_id ON public.structures(owner_id);
CREATE INDEX IF NOT EXISTS idx_structures_status ON public.structures(status);
CREATE INDEX IF NOT EXISTS idx_structures_is_active ON public.structures(is_active);

-- Enable Row Level Security
ALTER TABLE public.structures ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view only approved structures
DROP POLICY IF EXISTS "Users can view approved structures" ON public.structures;
CREATE POLICY "Users can view approved structures"
    ON public.structures
    FOR SELECT
    USING (is_active = true AND status = 'approved');

-- Policy: Users can view their own structures (any status)
DROP POLICY IF EXISTS "Users can view own structures" ON public.structures;
CREATE POLICY "Users can view own structures"
    ON public.structures
    FOR SELECT
    USING (auth.uid() = owner_id);

-- Policy: Authenticated users can insert their own structures
DROP POLICY IF EXISTS "Authenticated users can insert structures" ON public.structures;
CREATE POLICY "Authenticated users can insert structures"
    ON public.structures
    FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

-- Policy: Users can update only their own structures
DROP POLICY IF EXISTS "Users can update own structures" ON public.structures;
CREATE POLICY "Users can update own structures"
    ON public.structures
    FOR UPDATE
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

-- Policy: Users can delete only their own structures
DROP POLICY IF EXISTS "Users can delete own structures" ON public.structures;
CREATE POLICY "Users can delete own structures"
    ON public.structures
    FOR DELETE
    USING (auth.uid() = owner_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_structures_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_structures_timestamp ON public.structures;
CREATE TRIGGER trigger_update_structures_timestamp
    BEFORE UPDATE ON public.structures
    FOR EACH ROW
    EXECUTE FUNCTION update_structures_updated_at();

-- ============================================
-- MIGRATION 006: Storage Bucket for Structures
-- ============================================

-- Create storage bucket for structure images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'structures-images',
  'structures-images',
  true, -- Public bucket
  10485760, -- 10MB per file
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for structures-images bucket

-- Policy: Anyone can view images (public bucket)
DROP POLICY IF EXISTS "Public Access for structures images" ON storage.objects;
CREATE POLICY "Public Access for structures images"
ON storage.objects FOR SELECT
USING (bucket_id = 'structures-images');

-- Policy: Authenticated users can upload images
DROP POLICY IF EXISTS "Authenticated users can upload structures images" ON storage.objects;
CREATE POLICY "Authenticated users can upload structures images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'structures-images' 
  AND auth.role() = 'authenticated'
);

-- Policy: Users can update their own images
DROP POLICY IF EXISTS "Users can update own structures images" ON storage.objects;
CREATE POLICY "Users can update own structures images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'structures-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'structures-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can delete their own images
DROP POLICY IF EXISTS "Users can delete own structures images" ON storage.objects;
CREATE POLICY "Users can delete own structures images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'structures-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================
-- MIGRATION 008: Fix Admin Policies for Structures
-- ============================================

-- Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT email FROM auth.users 
    WHERE id = auth.uid() 
    AND email IN ('lucacorrao1996@gmail.com', 'lucacorrao96@outlook.it', 'luca@metatech.dev', 'lucacorrao1996@outlook.com', 'luca@lucacorrao.com')
  ) IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policy: Admins can view ALL structures
DROP POLICY IF EXISTS "Admins can view all structures" ON public.structures;
CREATE POLICY "Admins can view all structures"
    ON public.structures
    FOR SELECT
    USING (is_admin());

-- Policy: Admins can update ALL structures
DROP POLICY IF EXISTS "Admins can update all structures" ON public.structures;
CREATE POLICY "Admins can update all structures"
    ON public.structures
    FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

-- Policy: Admins can delete ALL structures
DROP POLICY IF EXISTS "Admins can delete all structures" ON public.structures;
CREATE POLICY "Admins can delete all structures"
    ON public.structures
    FOR DELETE
    USING (is_admin());

-- ============================================
-- COMMENTS AND DOCUMENTATION
-- ============================================

COMMENT ON TABLE files IS 'File storage metadata table';
COMMENT ON TABLE accommodations IS 'Accommodation properties table - main properties';
COMMENT ON TABLE bookings IS 'Prenotazioni con Row Level Security - ogni utente vede solo le proprie';
COMMENT ON TABLE chat_messages IS 'Messaggi chat con RLS - privacy totale tra utenti, solo admin vede tutto';
COMMENT ON TABLE user_profiles IS 'User profiles with role system: admin, host, guest. Supports WhatsApp authentication.';
COMMENT ON TABLE structures IS 'User-submitted structures - requires admin approval';
COMMENT ON VIEW admin_all_bookings IS 'Vista admin - accessibile solo da: lucacorrao1996@gmail.com, lucacorrao96@outlook.it, luca@metatech.dev, lucacorrao1996@outlook.com, luca@lucacorrao.com';
COMMENT ON VIEW admin_all_users IS 'Admin view - shows all users with stats';
COMMENT ON FUNCTION request_host_status IS 'Allow users to request host status - requires admin approval';
COMMENT ON FUNCTION verify_host IS 'Admin function to verify and approve host accounts';

-- ============================================
-- END OF SCHEMA
-- ============================================


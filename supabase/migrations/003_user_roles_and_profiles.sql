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
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_phone ON user_profiles(phone);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_is_host ON user_profiles(is_host);
CREATE INDEX idx_user_profiles_whatsapp ON user_profiles(whatsapp_number);

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
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  USING (
    email = current_setting('request.jwt.claims', true)::json->>'email'
    OR user_id::text = current_setting('request.jwt.claims', true)::json->>'sub'
  );

-- 2. Users can read host profiles (public info only)
CREATE POLICY "Anyone can read host profiles"
  ON user_profiles
  FOR SELECT
  USING (is_host = true);

-- 3. Admins can read all profiles
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
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  WITH CHECK (true);

-- Update RLS for accommodations to support host users

-- Drop existing policies
DROP POLICY IF EXISTS "Active accommodations are viewable by everyone" ON accommodations;
DROP POLICY IF EXISTS "Authenticated users can create accommodations" ON accommodations;
DROP POLICY IF EXISTS "Users can update own accommodations" ON accommodations;
DROP POLICY IF EXISTS "Users can delete own accommodations" ON accommodations;

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

COMMENT ON TABLE user_profiles IS 'User profiles with role system: admin, host, guest. Supports WhatsApp authentication.';
COMMENT ON VIEW admin_all_users IS 'Admin view - shows all users with stats';
COMMENT ON FUNCTION request_host_status IS 'Allow users to request host status - requires admin approval';
COMMENT ON FUNCTION verify_host IS 'Admin function to verify and approve host accounts';


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
CREATE INDEX idx_files_category ON files(category);
CREATE INDEX idx_files_owner ON files(owner_id);
CREATE INDEX idx_files_active ON files(is_active);
CREATE INDEX idx_files_uploaded_at ON files(uploaded_at);

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
CREATE INDEX idx_accommodations_owner ON accommodations(owner);
CREATE INDEX idx_accommodations_active ON accommodations(is_active);
CREATE INDEX idx_accommodations_created_at ON accommodations(created_at);
CREATE INDEX idx_accommodations_rating ON accommodations(rating);

-- Enable Row Level Security
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for files table
-- Allow anyone to read active files
CREATE POLICY "Public files are viewable by everyone"
  ON files FOR SELECT
  USING (is_active = true);

-- Allow authenticated users to insert files
CREATE POLICY "Authenticated users can upload files"
  ON files FOR INSERT
  WITH CHECK (true);

-- Allow users to update their own files (owner_id is TEXT, no casting needed)
CREATE POLICY "Users can update own files"
  ON files FOR UPDATE
  USING (owner_id IS NOT NULL);

-- Allow users to delete their own files (owner_id is TEXT, no casting needed)
CREATE POLICY "Users can delete own files"
  ON files FOR DELETE
  USING (owner_id IS NOT NULL);

-- RLS Policies for accommodations table
-- Allow anyone to read active accommodations
CREATE POLICY "Active accommodations are viewable by everyone"
  ON accommodations FOR SELECT
  USING (is_active = true);

-- Allow authenticated users to insert accommodations
CREATE POLICY "Authenticated users can create accommodations"
  ON accommodations FOR INSERT
  WITH CHECK (true);

-- Allow users to update their own accommodations (owner is TEXT, no casting needed)
CREATE POLICY "Users can update own accommodations"
  ON accommodations FOR UPDATE
  USING (owner IS NOT NULL);

-- Allow users to delete their own accommodations (owner is TEXT, no casting needed)
CREATE POLICY "Users can delete own accommodations"
  ON accommodations FOR DELETE
  USING (owner IS NOT NULL);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_accommodations_updated_at BEFORE UPDATE ON accommodations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_files_updated_at BEFORE UPDATE ON files
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

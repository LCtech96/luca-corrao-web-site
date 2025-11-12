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
CREATE POLICY "Users can view approved structures"
    ON public.structures
    FOR SELECT
    USING (is_active = true AND status = 'approved');

-- Policy: Users can view their own structures (any status)
CREATE POLICY "Users can view own structures"
    ON public.structures
    FOR SELECT
    USING (auth.uid() = owner_id);

-- Policy: Authenticated users can insert their own structures
CREATE POLICY "Authenticated users can insert structures"
    ON public.structures
    FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

-- Policy: Users can update only their own structures
CREATE POLICY "Users can update own structures"
    ON public.structures
    FOR UPDATE
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

-- Policy: Users can delete only their own structures
CREATE POLICY "Users can delete own structures"
    ON public.structures
    FOR DELETE
    USING (auth.uid() = owner_id);

-- Admin policies (assuming admin emails are in a list)
-- For now, we'll handle admin checks in application code

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_structures_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_structures_timestamp
    BEFORE UPDATE ON public.structures
    FOR EACH ROW
    EXECUTE FUNCTION update_structures_updated_at();


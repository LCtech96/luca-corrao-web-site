-- Create storage buckets for accommodations and files
-- Note: This should be run in Supabase dashboard SQL editor or via Supabase CLI

-- Create bucket for accommodation images
INSERT INTO storage.buckets (id, name, public)
VALUES ('accommodations-images', 'accommodations-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create bucket for general files
INSERT INTO storage.buckets (id, name, public)
VALUES ('files', 'files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for accommodations-images bucket
CREATE POLICY "Public Access for accommodation images"
ON storage.objects FOR SELECT
USING (bucket_id = 'accommodations-images');

CREATE POLICY "Authenticated users can upload accommodation images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'accommodations-images');

CREATE POLICY "Users can update own accommodation images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'accommodations-images');

CREATE POLICY "Users can delete own accommodation images"
ON storage.objects FOR DELETE
USING (bucket_id = 'accommodations-images');

-- Storage policies for files bucket
CREATE POLICY "Public Access for files"
ON storage.objects FOR SELECT
USING (bucket_id = 'files');

CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'files');

CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'files');

CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING (bucket_id = 'files');


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
CREATE POLICY "Public Access for structures images"
ON storage.objects FOR SELECT
USING (bucket_id = 'structures-images');

-- Policy: Authenticated users can upload images
CREATE POLICY "Authenticated users can upload structures images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'structures-images' 
  AND auth.role() = 'authenticated'
);

-- Policy: Users can update their own images
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
CREATE POLICY "Users can delete own structures images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'structures-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);


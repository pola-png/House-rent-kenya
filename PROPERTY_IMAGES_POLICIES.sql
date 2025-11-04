-- Storage Policies for property-images bucket
-- Run these in Supabase SQL Editor

-- 1. Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads on property-images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'property-images'
  AND auth.role() = 'authenticated'
);

-- 3. Allow public read access to uploaded files
CREATE POLICY "Allow public downloads on property-images" ON storage.objects
FOR SELECT USING (bucket_id = 'property-images');

-- 4. Allow users to update their own files
CREATE POLICY "Allow users to update own files on property-images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'property-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 5. Allow users to delete their own files
CREATE POLICY "Allow users to delete own files on property-images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'property-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

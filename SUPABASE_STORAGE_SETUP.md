# Supabase Storage Setup Guide

## Required Storage Bucket

To enable image uploads for properties and profile photos, you need to create a storage bucket in Supabase.

### Steps:

1. **Go to Supabase Dashboard**
   - Navigate to your project at https://supabase.com/dashboard

2. **Create Storage Bucket**
   - Click on "Storage" in the left sidebar
   - Click "New bucket"
   - Name: `user-uploads`
   - Make it **Public** (check the public option)
   - Click "Create bucket"

3. **Set Storage Policies**
   
   Go to the bucket policies and add these policies:

   **Policy 1: Allow authenticated users to upload**
   ```sql
   CREATE POLICY "Allow authenticated uploads"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'user-uploads');
   ```

   **Policy 2: Allow public read access**
   ```sql
   CREATE POLICY "Allow public read"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'user-uploads');
   ```

   **Policy 3: Allow users to update their own files**
   ```sql
   CREATE POLICY "Allow users to update own files"
   ON storage.objects FOR UPDATE
   TO authenticated
   USING (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
   ```

   **Policy 4: Allow users to delete their own files**
   ```sql
   CREATE POLICY "Allow users to delete own files"
   ON storage.objects FOR DELETE
   TO authenticated
   USING (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
   ```

4. **Verify Setup**
   - Try uploading a profile photo
   - Try posting a property with images
   - Check that images display correctly

## Folder Structure

The app will create these folders automatically:
- `avatars/` - User profile photos
- `properties/` - Property listing images

## Troubleshooting

If uploads fail:
1. Verify the bucket name is exactly `user-uploads`
2. Ensure the bucket is set to **Public**
3. Check that all policies are created
4. Verify your Supabase URL and anon key in `.env.local`

## Alternative: Use Default Images

If you don't want to set up storage immediately, the app will:
- Use default placeholder images for properties
- Show initials for profile photos without images

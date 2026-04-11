-- Fix Ban Feature: Add missing columns to profiles table
-- Run this in your Supabase SQL Editor

-- Add missing columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS "isPro" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "proExpiresAt" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "isBanned" BOOLEAN DEFAULT false;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles("isActive", "isPro", "isBanned");
CREATE INDEX IF NOT EXISTS idx_profiles_pro_expires ON profiles("proExpiresAt");

-- Add admin policies for user management (if they don't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Admins can update any profile') THEN
    CREATE POLICY "Admins can update any profile" ON profiles 
    FOR UPDATE USING (
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
      )
    );
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Admins can delete any profile') THEN
    CREATE POLICY "Admins can delete any profile" ON profiles 
    FOR DELETE USING (
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
      )
    );
  END IF;
END $$;

-- Verify the columns were added
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('isActive', 'isPro', 'proExpiresAt', 'isBanned')
ORDER BY column_name;
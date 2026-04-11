-- Migration: Add isPremium and featuredExpiresAt columns to properties table
-- Run this in your Supabase SQL Editor

-- Add views column if it doesn't exist
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Add isPremium column
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS "isPremium" BOOLEAN DEFAULT false;

-- Add featuredExpiresAt column
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS "featuredExpiresAt" TIMESTAMP;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_properties_is_premium ON properties("isPremium");
CREATE INDEX IF NOT EXISTS idx_properties_featured_expires ON properties("featuredExpiresAt");

-- Add admin policy for updating properties
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'properties' AND policyname = 'Admins can update any property') THEN
    CREATE POLICY "Admins can update any property" 
    ON properties FOR UPDATE 
    USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
  END IF;
END $$;

-- Rename promotion_requests to payment_requests if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'promotion_requests') THEN
    ALTER TABLE promotion_requests RENAME TO payment_requests;
  END IF;
END $$;

-- Add missing columns to payment_requests table
ALTER TABLE payment_requests 
ADD COLUMN IF NOT EXISTS "propertyTitle" TEXT,
ADD COLUMN IF NOT EXISTS "userId" TEXT,
ADD COLUMN IF NOT EXISTS "userName" TEXT,
ADD COLUMN IF NOT EXISTS "userEmail" TEXT,
ADD COLUMN IF NOT EXISTS "paymentScreenshot" TEXT,
ADD COLUMN IF NOT EXISTS "promotionType" TEXT;

-- Drop old columns if they exist
ALTER TABLE payment_requests 
DROP COLUMN IF EXISTS "landlordId",
DROP COLUMN IF EXISTS weeks,
DROP COLUMN IF EXISTS "screenshotUrl",
DROP COLUMN IF EXISTS "approvedAt",
DROP COLUMN IF EXISTS "approvedBy";

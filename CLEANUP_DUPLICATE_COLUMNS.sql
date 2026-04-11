-- Clean up duplicate columns in profiles table
-- Remove lowercase duplicates and keep camelCase versions

-- First, copy data from lowercase to camelCase columns if needed
UPDATE profiles SET "isBanned" = COALESCE("isBanned", isbanned, false) WHERE isbanned IS NOT NULL;
UPDATE profiles SET "isPro" = COALESCE("isPro", ispro, false) WHERE ispro IS NOT NULL;
UPDATE profiles SET "isActive" = COALESCE("isActive", isactive, true) WHERE isactive IS NOT NULL;
UPDATE profiles SET "proExpiresAt" = COALESCE("proExpiresAt", proexpiresat) WHERE proexpiresat IS NOT NULL;

-- Drop the duplicate lowercase columns
ALTER TABLE profiles DROP COLUMN IF EXISTS isbanned;
ALTER TABLE profiles DROP COLUMN IF EXISTS ispro;
ALTER TABLE profiles DROP COLUMN IF EXISTS isactive;
ALTER TABLE profiles DROP COLUMN IF EXISTS proexpiresat;

-- Ensure the correct columns exist with proper defaults
ALTER TABLE profiles 
ALTER COLUMN "isActive" SET DEFAULT true,
ALTER COLUMN "isPro" SET DEFAULT false,
ALTER COLUMN "isBanned" SET DEFAULT false;

-- Add NOT NULL constraints where appropriate
UPDATE profiles SET "isActive" = true WHERE "isActive" IS NULL;
UPDATE profiles SET "isPro" = false WHERE "isPro" IS NULL;
UPDATE profiles SET "isBanned" = false WHERE "isBanned" IS NULL;

ALTER TABLE profiles 
ALTER COLUMN "isActive" SET NOT NULL,
ALTER COLUMN "isPro" SET NOT NULL,
ALTER COLUMN "isBanned" SET NOT NULL;
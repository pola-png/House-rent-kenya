-- Test script to diagnose the isPremium update issue
-- Run this in Supabase SQL Editor

-- 1. Check if isPremium column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'properties' 
AND column_name IN ('isPremium', 'featuredExpiresAt');

-- 2. Check current RLS policies on properties table
SELECT * FROM pg_policies WHERE tablename = 'properties';

-- 3. Try to manually update a property (replace YOUR_PROPERTY_ID with actual ID)
-- UPDATE properties 
-- SET "isPremium" = true, 
--     "featuredExpiresAt" = NOW() + INTERVAL '4 weeks'
-- WHERE id = 'YOUR_PROPERTY_ID';

-- 4. Check if the update worked
-- SELECT id, title, "isPremium", "featuredExpiresAt" 
-- FROM properties 
-- WHERE id = 'YOUR_PROPERTY_ID';

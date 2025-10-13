-- Check if your admin role is set correctly
-- Run this in Supabase SQL Editor

-- 1. Check your profile in profiles table
SELECT id, email, role, "firstName", "lastName", "displayName"
FROM profiles
WHERE email = 'your-email@example.com';  -- Replace with your actual email

-- 2. Check your auth user metadata
SELECT id, email, raw_user_meta_data->>'role' as metadata_role
FROM auth.users
WHERE email = 'your-email@example.com';  -- Replace with your actual email

-- 3. If role is not 'admin' in profiles table, update it:
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';

-- Admin Setup for House Rent Kenya
-- Run this in Supabase SQL Editor to set admin roles

-- OPTION 1: Update existing user to admin by email (RECOMMENDED)
-- Replace 'your-admin-email@example.com' with your actual email
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-admin-email@example.com';

-- OPTION 2: Update by user ID (only if you know the UUID)
-- First get your UUID from option 5 below, then use it here
-- UPDATE profiles 
-- SET role = 'admin' 
-- WHERE id = 'paste-actual-uuid-here';

-- 3. Verify admin was set
SELECT id, email, role, "firstName", "lastName" 
FROM profiles 
WHERE role = 'admin';

-- 4. Create new admin user (if needed)
-- First create the user in Supabase Auth Dashboard
-- Then get their UUID from Auth Users table
-- Then uncomment and run this with actual UUID:
-- INSERT INTO profiles (id, email, role, "firstName", "lastName", "displayName", "createdAt")
-- VALUES (
--   'paste-actual-uuid-from-auth',
--   'admin@example.com',
--   'admin',
--   'Admin',
--   'User',
--   'Admin User',
--   NOW()
-- );

-- 5. View all users and their roles
SELECT id, email, role, "firstName", "lastName", "createdAt"
FROM profiles
ORDER BY "createdAt" DESC;

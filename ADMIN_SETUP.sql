-- Admin Setup for House Rent Kenya
-- Run this in Supabase SQL Editor to set admin roles

-- 1. Update existing user to admin by email
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-admin-email@example.com';

-- 2. Or update by user ID
UPDATE profiles 
SET role = 'admin' 
WHERE id = 'user-uuid-here';

-- 3. Check current admins
SELECT id, email, role, "firstName", "lastName" 
FROM profiles 
WHERE role = 'admin';

-- 4. Create new admin user (if needed)
-- First create the user in Supabase Auth, then run:
INSERT INTO profiles (id, email, role, "firstName", "lastName", "displayName", "createdAt")
VALUES (
  'auth-user-uuid',
  'admin@example.com',
  'admin',
  'Admin',
  'User',
  'Admin User',
  NOW()
);

-- 5. View all users and their roles
SELECT id, email, role, "firstName", "lastName", "createdAt"
FROM profiles
ORDER BY "createdAt" DESC;

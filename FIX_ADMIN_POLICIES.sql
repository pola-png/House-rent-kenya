-- Fix Admin Policies for User Management
-- Run this in your Supabase SQL Editor

-- Drop existing admin policies if they exist
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Admins can delete any profile" ON profiles;

-- Create admin update policy
CREATE POLICY "Admins can update any profile" ON profiles 
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create admin delete policy  
CREATE POLICY "Admins can delete any profile" ON profiles 
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Verify policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles' 
AND policyname LIKE '%Admin%';
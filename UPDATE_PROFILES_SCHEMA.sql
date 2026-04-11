-- Add missing columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS "isPro" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "proExpiresAt" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "isBanned" BOOLEAN DEFAULT false;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles("isActive", "isPro", "isBanned");
CREATE INDEX IF NOT EXISTS idx_profiles_pro_expires ON profiles("proExpiresAt");

-- Add admin policies for user management
CREATE POLICY "Admins can update any profile" ON profiles 
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete any profile" ON profiles 
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
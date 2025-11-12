-- Fix column name mismatch - add snake_case version
-- Run this in your Supabase SQL Editor

-- Add updated_at column (snake_case) if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Drop the existing trigger first
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

-- Create or replace function to update both columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update both columns on profile updates
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Verify both columns exist
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('updatedAt', 'updated_at')
ORDER BY column_name;
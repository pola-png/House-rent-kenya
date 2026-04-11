-- Fix Properties Table RLS Policies
-- Run this in Supabase SQL Editor

-- Enable RLS on properties table
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read access" ON properties;
DROP POLICY IF EXISTS "Allow authenticated users to insert" ON properties;
DROP POLICY IF EXISTS "Allow users to update own properties" ON properties;
DROP POLICY IF EXISTS "Allow users to delete own properties" ON properties;

-- Create new policies
-- 1. Allow everyone to read properties
CREATE POLICY "Allow public read access" ON properties
    FOR SELECT
    USING (true);

-- 2. Allow authenticated users to insert properties
CREATE POLICY "Allow authenticated users to insert" ON properties
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- 3. Allow users to update their own properties
CREATE POLICY "Allow users to update own properties" ON properties
    FOR UPDATE
    TO authenticated
    USING ("landlordId" = auth.uid()::text)
    WITH CHECK ("landlordId" = auth.uid()::text);

-- 4. Allow users to delete their own properties
CREATE POLICY "Allow users to delete own properties" ON properties
    FOR DELETE
    TO authenticated
    USING ("landlordId" = auth.uid()::text);

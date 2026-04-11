-- Add views column to properties table
ALTER TABLE properties ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Update existing properties to have 0 views
UPDATE properties SET views = 0 WHERE views IS NULL;
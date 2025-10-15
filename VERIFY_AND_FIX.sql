-- Step 1: Verify columns exist
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'properties' 
AND column_name IN ('isPremium', 'featuredExpiresAt', 'views');

-- Step 2: If columns don't exist, add them (without quotes)
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS ispremium BOOLEAN DEFAULT false;

ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS featuredexpiresat TIMESTAMP;

ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Step 3: Create the promotion function (lowercase column names)
CREATE OR REPLACE FUNCTION promote_property(
  property_id UUID,
  weeks_count INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  expiry_date TIMESTAMP;
BEGIN
  expiry_date := NOW() + (weeks_count * INTERVAL '7 days');
  
  -- Try both column name formats
  UPDATE properties
  SET 
    ispremium = true,
    featuredexpiresat = expiry_date
  WHERE id = property_id;
  
  IF NOT FOUND THEN
    -- Try with quoted names
    UPDATE properties
    SET 
      "isPremium" = true,
      "featuredExpiresAt" = expiry_date
    WHERE id = property_id;
  END IF;
  
  RETURN FOUND;
END;
$$;

GRANT EXECUTE ON FUNCTION promote_property(UUID, INTEGER) TO authenticated;

-- Step 4: Test the function with a property ID (replace with actual ID)
-- SELECT promote_property('YOUR-PROPERTY-ID-HERE'::UUID, 4);

-- Step 5: Verify it worked
-- SELECT id, title, ispremium, featuredexpiresat FROM properties WHERE id = 'YOUR-PROPERTY-ID-HERE';

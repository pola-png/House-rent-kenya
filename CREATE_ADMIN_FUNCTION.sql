-- Create a function that admins can call to promote properties
-- This bypasses RLS issues

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
  -- Calculate expiry date
  expiry_date := NOW() + (weeks_count * INTERVAL '7 days');
  
  -- Update the property
  UPDATE properties
  SET 
    "isPremium" = true,
    "featuredExpiresAt" = expiry_date
  WHERE id = property_id;
  
  RETURN FOUND;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION promote_property(UUID, INTEGER) TO authenticated;

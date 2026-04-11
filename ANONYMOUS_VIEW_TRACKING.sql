-- Fix anonymous view tracking for impressions
-- This allows all users (authenticated and anonymous) to increment views

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS increment_property_views(UUID);

-- Create improved function with better security and error handling
CREATE OR REPLACE FUNCTION increment_property_views(property_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_views INTEGER;
BEGIN
    -- Update views count, handling null values
    UPDATE properties 
    SET 
        views = COALESCE(views, 0) + 1,
        updatedAt = NOW()
    WHERE id = property_id;
    
    -- Get the updated view count
    SELECT COALESCE(views, 0) INTO new_views 
    FROM properties 
    WHERE id = property_id;
    
    RETURN COALESCE(new_views, 0);
EXCEPTION
    WHEN OTHERS THEN
        -- Return 0 if any error occurs
        RETURN 0;
END;
$$;

-- Grant execute permissions to both anonymous and authenticated users
GRANT EXECUTE ON FUNCTION increment_property_views(UUID) TO anon;
GRANT EXECUTE ON FUNCTION increment_property_views(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_property_views(UUID) TO service_role;

-- Create a function for bulk view tracking (for homepage impressions)
CREATE OR REPLACE FUNCTION increment_multiple_property_views(property_ids UUID[])
RETURNS TABLE(property_id UUID, new_views INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Update all properties in the array
    UPDATE properties 
    SET 
        views = COALESCE(views, 0) + 1,
        updatedAt = NOW()
    WHERE id = ANY(property_ids);
    
    -- Return updated view counts
    RETURN QUERY
    SELECT p.id, COALESCE(p.views, 0)::INTEGER
    FROM properties p
    WHERE p.id = ANY(property_ids);
END;
$$;

-- Grant permissions for bulk function
GRANT EXECUTE ON FUNCTION increment_multiple_property_views(UUID[]) TO anon;
GRANT EXECUTE ON FUNCTION increment_multiple_property_views(UUID[]) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_multiple_property_views(UUID[]) TO service_role;

-- Ensure views column has proper default
ALTER TABLE properties ALTER COLUMN views SET DEFAULT 0;

-- Update existing null views to 0
UPDATE properties SET views = 0 WHERE views IS NULL;
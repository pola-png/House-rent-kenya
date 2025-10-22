-- Create a function to increment property views
-- This function will bypass RLS policies for view counting
CREATE OR REPLACE FUNCTION increment_property_views(property_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_views INTEGER;
BEGIN
    UPDATE properties 
    SET views = COALESCE(views, 0) + 1 
    WHERE id = property_id;
    
    SELECT views INTO new_views 
    FROM properties 
    WHERE id = property_id;
    
    RETURN COALESCE(new_views, 0);
END;
$$;

-- Grant execute permission to anonymous users
GRANT EXECUTE ON FUNCTION increment_property_views(UUID) TO anon;
GRANT EXECUTE ON FUNCTION increment_property_views(UUID) TO authenticated;
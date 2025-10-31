-- Ensure proper cascade deletion when user is deleted
-- This will clean up all user data when profile is deleted

-- Update foreign key constraints to cascade properly
ALTER TABLE properties 
DROP CONSTRAINT IF EXISTS properties_landlordId_fkey;

-- Add proper cascade constraint for properties
-- Note: landlordId is TEXT but should reference profiles.id (UUID)
-- We'll handle this in the application layer since the types don't match

-- Create function to clean up user data on deletion
CREATE OR REPLACE FUNCTION public.cleanup_user_data()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete user's properties
  DELETE FROM public.properties WHERE "landlordId" = OLD.id::text;
  
  -- Delete user's callback requests
  DELETE FROM public.callback_requests WHERE "agentId" = OLD.id::text;
  
  -- Delete user's payment requests
  DELETE FROM public.payment_requests WHERE "userId" = OLD.id::text;
  
  -- Log the deletion
  INSERT INTO public.user_deletion_log (deleted_user_id, deleted_at, deleted_by)
  VALUES (OLD.id, NOW(), auth.uid());
  
  RETURN OLD;
END;
$$;

-- Create deletion log table
CREATE TABLE IF NOT EXISTS public.user_deletion_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deleted_user_id UUID,
  deleted_at TIMESTAMP DEFAULT NOW(),
  deleted_by UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create trigger for cleanup
DROP TRIGGER IF EXISTS trigger_cleanup_user_data ON profiles;
CREATE TRIGGER trigger_cleanup_user_data
  BEFORE DELETE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_user_data();

-- Add RLS for deletion log
ALTER TABLE user_deletion_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view deletion logs" ON user_deletion_log
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
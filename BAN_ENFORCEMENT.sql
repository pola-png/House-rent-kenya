-- Create function to automatically sign out banned users
CREATE OR REPLACE FUNCTION public.check_user_ban_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If user is being banned, we can't directly sign them out from SQL
  -- The frontend will handle this through the auth hook
  IF NEW."isBanned" = true AND OLD."isBanned" = false THEN
    -- Log the ban action
    INSERT INTO public.ban_log (user_id, banned_at, reason)
    VALUES (NEW.id, NOW(), 'Admin action');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create ban log table for tracking
CREATE TABLE IF NOT EXISTS public.ban_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  banned_at TIMESTAMP DEFAULT NOW(),
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create trigger to log bans
DROP TRIGGER IF EXISTS trigger_check_user_ban ON profiles;
CREATE TRIGGER trigger_check_user_ban
  AFTER UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION check_user_ban_status();

-- Add RLS for ban log
ALTER TABLE ban_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view ban logs" ON ban_log
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
-- STEP 1: Add missing columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS "isPro" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "proExpiresAt" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "isBanned" BOOLEAN DEFAULT false;

-- STEP 2: Add RLS policies for admin user management
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Admins can delete any profile" ON profiles;

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

-- STEP 3: Fix security issues with functions
DROP FUNCTION IF EXISTS public.increment_property_views(uuid);
DROP FUNCTION IF EXISTS public.promote_property(uuid, integer);

CREATE FUNCTION public.increment_property_views(property_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.properties 
  SET views = COALESCE(views, 0) + 1 
  WHERE id = property_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, "firstName", "lastName", "displayName", email, role, "agencyName", "phoneNumber")
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'firstName',
    NEW.raw_user_meta_data->>'lastName',
    COALESCE(NEW.raw_user_meta_data->>'displayName', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    NEW.raw_user_meta_data->>'agencyName',
    NEW.raw_user_meta_data->>'phoneNumber'
  );
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.promote_property(property_id uuid, weeks integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.properties 
  SET 
    "isPremium" = true,
    "featuredExpiresAt" = NOW() + (weeks || ' weeks')::interval
  WHERE id = property_id;
END;
$$;

-- STEP 4: Add performance indexes
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles("isActive", "isPro", "isBanned");
CREATE INDEX IF NOT EXISTS idx_profiles_pro_expires ON profiles("proExpiresAt");
CREATE INDEX IF NOT EXISTS idx_properties_landlord_created ON properties("landlordId", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_properties_premium_expires ON properties("isPremium", "featuredExpiresAt");
CREATE INDEX IF NOT EXISTS idx_properties_status_type ON properties(status, "propertyType");
CREATE INDEX IF NOT EXISTS idx_properties_location_city ON properties(location, city);
CREATE INDEX IF NOT EXISTS idx_properties_price_bedrooms ON properties(price, bedrooms);
CREATE INDEX IF NOT EXISTS idx_profiles_role_created ON profiles(role, "createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_email_role ON profiles(email, role);
CREATE INDEX IF NOT EXISTS idx_properties_search ON properties(city, "propertyType", status, bedrooms, price);
CREATE INDEX IF NOT EXISTS idx_properties_featured_search ON properties("isPremium", status, "createdAt" DESC) WHERE "isPremium" = true;

-- STEP 5: Update statistics
ANALYZE properties;
ANALYZE profiles;
ANALYZE callback_requests;
ANALYZE payment_requests;
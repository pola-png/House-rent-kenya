-- Fix security issues with functions
-- Drop existing functions first to avoid conflicts
DROP FUNCTION IF EXISTS public.increment_property_views(uuid);
DROP FUNCTION IF EXISTS public.promote_property(uuid, integer);

-- 1. Create secure increment_property_views function
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

-- 2. Fix handle_new_user function
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

-- 3. Create secure promote_property function
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

-- Performance optimizations
-- Add missing indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_properties_landlord_created ON public.properties("landlordId", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_properties_premium_expires ON public.properties("isPremium", "featuredExpiresAt");
CREATE INDEX IF NOT EXISTS idx_properties_status_type ON public.properties(status, "propertyType");
CREATE INDEX IF NOT EXISTS idx_properties_location_city ON public.properties(location, city);
CREATE INDEX IF NOT EXISTS idx_properties_price_bedrooms ON public.properties(price, bedrooms);

-- Optimize profiles queries
CREATE INDEX IF NOT EXISTS idx_profiles_role_created ON public.profiles(role, "createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_email_role ON public.profiles(email, role);

-- Add composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_properties_search ON public.properties(city, "propertyType", status, bedrooms, price);
CREATE INDEX IF NOT EXISTS idx_properties_featured_search ON public.properties("isPremium", status, "createdAt" DESC) WHERE "isPremium" = true;

-- Update table statistics for better query planning
ANALYZE public.properties;
ANALYZE public.profiles;
ANALYZE public.callback_requests;
ANALYZE public.payment_requests;
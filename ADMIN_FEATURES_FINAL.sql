-- Final Admin Features Database Updates
-- Run these SQL commands in Supabase SQL Editor

-- 1. Add missing columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS isBanned BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS isPro BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS proExpiresAt TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS isActive BOOLEAN DEFAULT TRUE;

-- 2. Add missing columns to properties table
ALTER TABLE properties ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS featuredExpiresAt TIMESTAMP WITH TIME ZONE;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS isPremium BOOLEAN DEFAULT FALSE;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- 3. Update existing data
UPDATE properties SET views = 0 WHERE views IS NULL;
UPDATE profiles SET isActive = TRUE WHERE isActive IS NULL;
UPDATE profiles SET isBanned = FALSE WHERE isBanned IS NULL;
UPDATE profiles SET isPro = FALSE WHERE isPro IS NULL;

-- 4. Create promote_property function
CREATE OR REPLACE FUNCTION promote_property(property_id UUID, weeks_count INTEGER DEFAULT 4)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE properties 
    SET 
        featured = TRUE,
        isPremium = TRUE,
        featuredExpiresAt = NOW() + (weeks_count || ' weeks')::INTERVAL
    WHERE id = property_id;
    
    RETURN TRUE;
END;
$$;

-- 5. Create increment_property_views function
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

-- 6. Grant permissions
GRANT EXECUTE ON FUNCTION promote_property(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION promote_property(UUID, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION increment_property_views(UUID) TO anon;
GRANT EXECUTE ON FUNCTION increment_property_views(UUID) TO authenticated;

-- 7. Create payment_requests table
CREATE TABLE IF NOT EXISTS payment_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "propertyId" UUID REFERENCES properties(id) ON DELETE CASCADE,
    "propertyTitle" TEXT,
    "userId" UUID REFERENCES profiles(id) ON DELETE CASCADE,
    "userName" TEXT,
    "userEmail" TEXT,
    amount INTEGER,
    "paymentScreenshot" TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    "promotionType" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Create callback_requests table
CREATE TABLE IF NOT EXISTS callback_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "propertyId" UUID REFERENCES properties(id) ON DELETE CASCADE,
    "propertyTitle" TEXT,
    "userName" TEXT,
    "userPhone" TEXT,
    "agentId" UUID REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted')),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Create indexes
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(featured);
CREATE INDEX IF NOT EXISTS idx_properties_ispremium ON properties(isPremium);
CREATE INDEX IF NOT EXISTS idx_properties_views ON properties(views);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_ispro ON profiles(isPro);
CREATE INDEX IF NOT EXISTS idx_profiles_isactive ON profiles(isActive);
CREATE INDEX IF NOT EXISTS idx_profiles_isbanned ON profiles(isBanned);
CREATE INDEX IF NOT EXISTS idx_callback_requests_agent ON callback_requests("agentId");
CREATE INDEX IF NOT EXISTS idx_callback_requests_property ON callback_requests("propertyId");
CREATE INDEX IF NOT EXISTS idx_callback_requests_status ON callback_requests(status);
CREATE INDEX IF NOT EXISTS idx_payment_requests_user ON payment_requests("userId");
CREATE INDEX IF NOT EXISTS idx_payment_requests_property ON payment_requests("propertyId");
CREATE INDEX IF NOT EXISTS idx_payment_requests_status ON payment_requests(status);
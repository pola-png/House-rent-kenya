-- Payment Requests table for property promotions
CREATE TABLE payment_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "propertyId" UUID REFERENCES properties(id) ON DELETE CASCADE,
  "propertyTitle" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "userName" TEXT NOT NULL,
  "userEmail" TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  "paymentScreenshot" TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  "promotionType" TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "approvedAt" TIMESTAMP,
  "approvedBy" TEXT
);

-- Enable Row Level Security
ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own payment requests" ON payment_requests FOR SELECT USING (auth.uid()::text = "userId");
CREATE POLICY "Users can create payment requests" ON payment_requests FOR INSERT WITH CHECK (auth.uid()::text = "userId");
CREATE POLICY "Admins can view all payment requests" ON payment_requests FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  )
);
CREATE POLICY "Admins can update payment requests" ON payment_requests FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Add columns to properties table for promotion tracking
ALTER TABLE properties ADD COLUMN IF NOT EXISTS "isPremium" BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS "featuredExpiresAt" TIMESTAMP;

-- Add columns to profiles table for Pro status
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS "isPro" BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS "proExpiresAt" TIMESTAMP;

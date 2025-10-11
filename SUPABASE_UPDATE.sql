-- Only add the new promotion_requests table
-- Run this if you already have existing tables

CREATE TABLE IF NOT EXISTS promotion_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "propertyId" UUID REFERENCES properties(id) ON DELETE CASCADE,
  "landlordId" TEXT NOT NULL,
  weeks INTEGER NOT NULL,
  amount NUMERIC NOT NULL,
  "screenshotUrl" TEXT,
  status TEXT DEFAULT 'pending',
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "approvedAt" TIMESTAMP,
  "approvedBy" TEXT
);

-- Enable Row Level Security
ALTER TABLE promotion_requests ENABLE ROW LEVEL SECURITY;

-- Promotion requests policies
CREATE POLICY "Users can view own promotion requests" ON promotion_requests FOR SELECT USING (auth.uid()::text = "landlordId");
CREATE POLICY "Users can create promotion requests" ON promotion_requests FOR INSERT WITH CHECK (auth.uid()::text = "landlordId");

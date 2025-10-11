-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  "firstName" TEXT,
  "lastName" TEXT,
  "displayName" TEXT,
  email TEXT,
  role TEXT DEFAULT 'user',
  "agencyName" TEXT,
  "phoneNumber" TEXT,
  "photoURL" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Properties table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  "propertyType" TEXT NOT NULL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  area NUMERIC,
  location TEXT,
  city TEXT,
  latitude NUMERIC DEFAULT -1.286389,
  longitude NUMERIC DEFAULT 36.817223,
  images TEXT[],
  amenities TEXT[],
  "landlordId" TEXT NOT NULL,
  status TEXT DEFAULT 'For Rent',
  featured BOOLEAN DEFAULT false,
  keywords TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Articles table
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  excerpt TEXT,
  "imageUrl" TEXT,
  category TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Developments table
CREATE TABLE developments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  location TEXT,
  "priceRange" TEXT,
  description TEXT,
  "imageUrl" TEXT,
  status TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Promotion Requests table
CREATE TABLE promotion_requests (
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

-- Callback Requests table
CREATE TABLE callback_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "propertyId" UUID REFERENCES properties(id),
  "userName" TEXT,
  "userPhone" TEXT,
  "agentId" TEXT,
  status TEXT DEFAULT 'pending',
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE developments ENABLE ROW LEVEL SECURITY;
ALTER TABLE callback_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_requests ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Properties policies
CREATE POLICY "Properties are viewable by everyone" ON properties FOR SELECT USING (true);
CREATE POLICY "Agents can insert properties" ON properties FOR INSERT WITH CHECK (auth.uid()::text = "landlordId");
CREATE POLICY "Agents can update own properties" ON properties FOR UPDATE USING (auth.uid()::text = "landlordId");
CREATE POLICY "Agents can delete own properties" ON properties FOR DELETE USING (auth.uid()::text = "landlordId");

-- Articles policies (public read)
CREATE POLICY "Articles are viewable by everyone" ON articles FOR SELECT USING (true);

-- Developments policies (public read)
CREATE POLICY "Developments are viewable by everyone" ON developments FOR SELECT USING (true);

-- Callback requests policies
CREATE POLICY "Users can view own callback requests" ON callback_requests FOR SELECT USING (auth.uid()::text = "agentId");
CREATE POLICY "Anyone can create callback requests" ON callback_requests FOR INSERT WITH CHECK (true);

-- Promotion requests policies
CREATE POLICY "Users can view own promotion requests" ON promotion_requests FOR SELECT USING (auth.uid()::text = "landlordId");
CREATE POLICY "Users can create promotion requests" ON promotion_requests FOR INSERT WITH CHECK (auth.uid()::text = "landlordId");

-- Function to handle new user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_create
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

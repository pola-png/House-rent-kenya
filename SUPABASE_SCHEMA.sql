-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  display_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'user',
  agency_name TEXT,
  phone_number TEXT,
  photo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Properties table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  property_type TEXT NOT NULL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  area NUMERIC,
  location TEXT,
  city TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  images TEXT[],
  amenities TEXT[],
  landlord_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'For Rent',
  featured BOOLEAN DEFAULT false,
  keywords TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Articles table
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  category TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Developments table
CREATE TABLE developments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  location TEXT,
  price_range TEXT,
  description TEXT,
  image_url TEXT,
  status TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Callback Requests table
CREATE TABLE callback_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id),
  user_name TEXT,
  user_phone TEXT,
  agent_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE developments ENABLE ROW LEVEL SECURITY;
ALTER TABLE callback_requests ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Properties policies
CREATE POLICY "Properties are viewable by everyone" ON properties FOR SELECT USING (true);
CREATE POLICY "Agents can insert properties" ON properties FOR INSERT WITH CHECK (auth.uid() = landlord_id);
CREATE POLICY "Agents can update own properties" ON properties FOR UPDATE USING (auth.uid() = landlord_id);
CREATE POLICY "Agents can delete own properties" ON properties FOR DELETE USING (auth.uid() = landlord_id);

-- Articles policies (public read)
CREATE POLICY "Articles are viewable by everyone" ON articles FOR SELECT USING (true);

-- Developments policies (public read)
CREATE POLICY "Developments are viewable by everyone" ON developments FOR SELECT USING (true);

-- Callback requests policies
CREATE POLICY "Users can view own callback requests" ON callback_requests FOR SELECT USING (auth.uid() = agent_id);
CREATE POLICY "Anyone can create callback requests" ON callback_requests FOR INSERT WITH CHECK (true);

-- Function to handle new user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, display_name, email, role, agency_name, phone_number)
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

-- Seed data for testing (Run after SUPABASE_SCHEMA.sql)

-- Insert sample articles
INSERT INTO articles (id, title, excerpt, image_url, category) VALUES
  (uuid_generate_v4(), 'The Ultimate Guide to Renting Your First Apartment', 'Everything you need to know, from budgeting and searching to signing the lease and moving in. A must-read for first-time renters.', 'https://images.unsplash.com/photo-1560448204-e1a3f8e1e0e0', 'Renting'),
  (uuid_generate_v4(), '5 Red Flags to Watch Out for When Viewing a Property', 'Don''t get caught in a bad deal. Learn to spot the warning signs during a property viewing.', 'https://images.unsplash.com/photo-1560448204-e1a3f8e1e0e0', 'Renting'),
  (uuid_generate_v4(), 'How to Negotiate Rent with Your Landlord', 'Yes, you can negotiate your rent! Discover effective strategies for getting a better deal on your monthly payments.', 'https://images.unsplash.com/photo-1560448204-e1a3f8e1e0e0', 'Finance'),
  (uuid_generate_v4(), 'A Guide to Finding the Perfect Tenant', 'Screening tenants can be daunting. Follow our guide to find reliable, long-term tenants for your property.', 'https://images.unsplash.com/photo-1560448204-e1a3f8e1e0e0', 'For Landlords'),
  (uuid_generate_v4(), 'Kenya''s Property Hotspots in 2024', 'An in-depth look at the most promising areas for real estate investment in Kenya this year.', 'https://images.unsplash.com/photo-1560448204-e1a3f8e1e0e0', 'Investing'),
  (uuid_generate_v4(), 'Decorating Your Rental on a Budget', 'Make your rental feel like home without breaking the bank. Discover affordable and renter-friendly decor ideas.', 'https://images.unsplash.com/photo-1560448204-e1a3f8e1e0e0', 'Lifestyle');

-- Insert sample developments
INSERT INTO developments (id, title, location, price_range, description, status) VALUES
  (uuid_generate_v4(), 'Skyline Residences', 'Westlands, Nairobi', 'KSh 8M - KSh 15M', 'Modern apartments with stunning city views', 'Available'),
  (uuid_generate_v4(), 'Garden Estate', 'Karen, Nairobi', 'KSh 12M - KSh 25M', 'Luxury villas in a serene environment', 'Available'),
  (uuid_generate_v4(), 'Coastal Paradise', 'Diani Beach', 'KSh 6M - KSh 12M', 'Beachfront properties with ocean views', 'Available');

-- Note: Properties and profiles will be created by users through the app
-- This is just sample data for articles and developments

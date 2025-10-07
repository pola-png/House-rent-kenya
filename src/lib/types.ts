export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  type: 'rent' | 'buy';
  property_type: 'apartment' | 'house' | 'condo' | 'studio';
  bedrooms: number;
  bathrooms: number;
  area: number;
  location: string;
  latitude?: number;
  longitude?: number;
  images: string[];
  amenities: string[];
  agent_id?: string;
  status: 'active' | 'inactive' | 'sold' | 'rented';
  created_at: string;
  updated_at: string;
  featured?: boolean;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  role: 'user' | 'agent' | 'admin';
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}
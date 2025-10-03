export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  area: number; // in sqft
  type: 'Apartment' | 'House' | 'Condo' | 'Townhouse' | 'Villa';
  amenities: string[];
  images: string[];
  agent: {
    name: string;
    avatar: string;
  };
  featured: boolean;
  latitude: number;
  longitude: number;
  status: 'For Rent' | 'Rented';
}

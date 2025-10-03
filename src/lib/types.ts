
import { Timestamp } from "firebase/firestore";

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
  status: 'For Rent' | 'For Sale' | 'Short Let' | 'Land' | 'Rented';
  landlordId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  keywords?: string;
}

export interface UserProfile {
    id: string;
    uid: string;
    firstName: string;
    lastName: string;
    displayName: string;
    email: string;
    role: 'user' | 'agent';
    agencyName?: string;
    createdAt: Timestamp;
    photoURL?: string;
}

    
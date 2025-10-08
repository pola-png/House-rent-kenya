
import type { Timestamp } from "firebase/firestore";

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  propertyType: "Apartment" | "House" | "Condo" | "Townhouse" | "Villa";
  bedrooms: number;
  bathrooms: number;
  area: number;
  location: string;
  city: string;
  latitude: number;
  longitude: number;
  images: string[];
  amenities: string[];
  agent: UserProfile;
  landlordId: string;
  status: "For Rent" | "For Sale" | "Short Let" | "Land" | "Rented";
  createdAt: Timestamp;
  updatedAt: Timestamp;
  featured?: boolean;
  keywords?: string;
}

export interface UserProfile {
  uid: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phoneNumber?: string;
  role: "user" | "agent";
  agencyName?: string;
  createdAt: Timestamp;
  photoURL?: string;
}

export interface CallbackRequest {
    id: string;
    propertyId: string;
    propertyTitle: string;
    userName: string;
    userPhone: string;
    agentId: string;
    status: "pending" | "contacted";
    createdAt: Timestamp;
}

export interface SupportTicket {
    id: string;
    userId: string;
    subject: string;
    status: "open" | "closed";
    createdAt: Timestamp;
    updatedAt: Timestamp;
    lastMessage?: string;
}

export interface Message {
    id: string;
    text: string;
    senderId: string;
    timestamp: Timestamp;
}

export interface Development {
    id: string;
    title: string;
    location: string;
    priceRange: string;
    description: string;
    imageId: string;
    status: string;
}

export interface Article {
    id: string;
    title: string;
    excerpt: string;
    imageId: string;
    category: string;
}

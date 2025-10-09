
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
  createdAt: Date;
  updatedAt: Date;
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
  createdAt: Date;
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
    createdAt: Date;
}

export interface SupportTicket {
    id: string;
    userId: string;
    subject: string;
    status: "open" | "closed";
    createdAt: Date;
    updatedAt: Date;
    lastMessage?: string;
}

export interface Message {
    id: string;
    ticketId?: string; // Add ticketId for easier filtering
    text: string;
    senderId: string;
    timestamp: Date;
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

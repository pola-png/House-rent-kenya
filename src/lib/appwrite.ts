import { Client, Account, Databases, Storage, Query } from 'appwrite';

const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Database and Collection IDs
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';
export const COLLECTIONS = {
  PROPERTIES: process.env.NEXT_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID || 'properties',
  PROFILES: process.env.NEXT_PUBLIC_APPWRITE_PROFILES_COLLECTION_ID || 'profiles',
  PAYMENT_REQUESTS: process.env.NEXT_PUBLIC_APPWRITE_PAYMENT_REQUESTS_COLLECTION_ID || 'payment_requests',
  BOOKINGS: process.env.NEXT_PUBLIC_APPWRITE_BOOKINGS_COLLECTION_ID || 'bookings',
  REVIEWS: process.env.NEXT_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID || 'reviews',
};

export const STORAGE_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || '';

export { client, Query };
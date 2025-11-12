const { Client, Databases, Storage, ID } = require('node-appwrite');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase setup
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Appwrite setup
const client = new Client();
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const COLLECTIONS = {
  PROPERTIES: 'properties',
  PROFILES: 'profiles',
  PAYMENT_REQUESTS: 'payment_requests',
  BOOKINGS: 'bookings',
  REVIEWS: 'reviews',
};

async function createCollections() {
  try {
    // Create Properties collection
    await databases.createCollection(
      DATABASE_ID,
      COLLECTIONS.PROPERTIES,
      'Properties'
    );

    // Create Profiles collection
    await databases.createCollection(
      DATABASE_ID,
      COLLECTIONS.PROFILES,
      'Profiles'
    );

    // Create Payment Requests collection
    await databases.createCollection(
      DATABASE_ID,
      COLLECTIONS.PAYMENT_REQUESTS,
      'Payment Requests'
    );

    console.log('Collections created successfully!');
  } catch (error) {
    console.error('Error creating collections:', error);
  }
}

async function migrateData() {
  try {
    // Migrate Properties
    console.log('Migrating properties...');
    const { data: properties } = await supabase.from('properties').select('*');
    
    for (const property of properties || []) {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.PROPERTIES,
        ID.unique(),
        {
          title: property.title,
          description: property.description,
          price: property.price,
          location: property.location,
          city: property.city,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          area: property.area,
          property_type: property.property_type,
          images: property.images || [],
          landlord_id: property.landlord_id,
          status: property.status || 'available',
          isPremium: property.isPremium || false,
          featuredExpiresAt: property.featuredExpiresAt,
          created_at: property.created_at,
          updated_at: property.updated_at,
        }
      );
    }

    // Migrate Profiles
    console.log('Migrating profiles...');
    const { data: profiles } = await supabase.from('profiles').select('*');
    
    for (const profile of profiles || []) {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.PROFILES,
        profile.id,
        {
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          phoneNumber: profile.phoneNumber,
          role: profile.role || 'user',
          agencyName: profile.agencyName,
          photoURL: profile.photoURL,
          isActive: profile.isActive !== false,
          isPro: profile.isPro || false,
          proExpiresAt: profile.proExpiresAt,
          created_at: profile.created_at,
        }
      );
    }

    // Migrate Payment Requests
    console.log('Migrating payment requests...');
    const { data: paymentRequests } = await supabase.from('payment_requests').select('*');
    
    for (const request of paymentRequests || []) {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.PAYMENT_REQUESTS,
        ID.unique(),
        {
          propertyId: request.propertyId,
          propertyTitle: request.propertyTitle,
          userId: request.userId,
          userName: request.userName,
          userEmail: request.userEmail,
          amount: request.amount,
          paymentScreenshot: request.paymentScreenshot,
          status: request.status || 'pending',
          promotionType: request.promotionType,
          createdAt: request.createdAt,
          approvedAt: request.approvedAt,
          approvedBy: request.approvedBy,
        }
      );
    }

    console.log('Data migration completed successfully!');
  } catch (error) {
    console.error('Error migrating data:', error);
  }
}

async function main() {
  console.log('Starting Appwrite migration...');
  await createCollections();
  await migrateData();
  console.log('Migration completed!');
}

main();
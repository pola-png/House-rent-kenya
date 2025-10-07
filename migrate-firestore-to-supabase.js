// Migration script to move data from Firestore to Supabase
// Run this script after setting up your Supabase database

const { createClient } = require('@supabase/supabase-js');
const admin = require('firebase-admin');

// Initialize Firebase Admin (you'll need your service account key)
// admin.initializeApp({
//   credential: admin.credential.cert(require('./path-to-service-account-key.json'))
// });

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // You'll need the service role key for this
);

async function migrateProperties() {
  try {
    console.log('Starting properties migration...');
    
    // Get all properties from Firestore
    const firestore = admin.firestore();
    const propertiesSnapshot = await firestore.collection('properties').get();
    
    const properties = [];
    propertiesSnapshot.forEach(doc => {
      const data = doc.data();
      properties.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        price: data.price,
        type: data.type,
        property_type: data.propertyType || data.property_type,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        area: data.area,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        images: data.images || [],
        amenities: data.amenities || [],
        agent_id: data.agentId || data.agent_id,
        status: data.status || 'active',
        featured: data.featured || false,
        created_at: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updated_at: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
      });
    });
    
    // Insert into Supabase
    const { data, error } = await supabase
      .from('properties')
      .insert(properties);
    
    if (error) {
      console.error('Error migrating properties:', error);
    } else {
      console.log(`Successfully migrated ${properties.length} properties`);
    }
    
  } catch (error) {
    console.error('Migration error:', error);
  }
}

async function migrateUsers() {
  try {
    console.log('Starting users migration...');
    
    // Get all users from Firestore
    const firestore = admin.firestore();
    const usersSnapshot = await firestore.collection('users').get();
    
    const users = [];
    usersSnapshot.forEach(doc => {
      const data = doc.data();
      users.push({
        id: doc.id,
        email: data.email,
        full_name: data.displayName || data.full_name,
        role: data.role || 'user',
        phone: data.phone,
        avatar_url: data.photoURL || data.avatar_url,
        created_at: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updated_at: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
      });
    });
    
    // Insert into Supabase
    const { data, error } = await supabase
      .from('users')
      .insert(users);
    
    if (error) {
      console.error('Error migrating users:', error);
    } else {
      console.log(`Successfully migrated ${users.length} users`);
    }
    
  } catch (error) {
    console.error('Migration error:', error);
  }
}

// Run migrations
async function runMigration() {
  console.log('Starting Firestore to Supabase migration...');
  
  await migrateUsers();
  await migrateProperties();
  
  console.log('Migration completed!');
  process.exit(0);
}

// Uncomment to run the migration
// runMigration();
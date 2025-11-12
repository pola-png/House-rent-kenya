const { Client, Databases, Storage, ID, Permission, Role } = require('node-appwrite');
require('dotenv').config();

const client = new Client();
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

async function createDatabase() {
  try {
    await databases.create(DATABASE_ID, 'HouseRentKenya');
    console.log('Database created successfully!');
  } catch (error) {
    if (error.code === 409) {
      console.log('Database already exists');
    } else {
      console.error('Error creating database:', error);
    }
  }
}

async function createCollectionsWithAttributes() {
  try {
    // Create Properties collection
    await databases.createCollection(DATABASE_ID, 'properties', 'Properties', [
      Permission.read(Role.any()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users())
    ]);

    // Add attributes to Properties
    await databases.createStringAttribute(DATABASE_ID, 'properties', 'title', 255, true);
    await databases.createStringAttribute(DATABASE_ID, 'properties', 'description', 5000, false);
    await databases.createIntegerAttribute(DATABASE_ID, 'properties', 'price', true);
    await databases.createStringAttribute(DATABASE_ID, 'properties', 'location', 255, false);
    await databases.createStringAttribute(DATABASE_ID, 'properties', 'city', 100, false);
    await databases.createIntegerAttribute(DATABASE_ID, 'properties', 'bedrooms', false);
    await databases.createIntegerAttribute(DATABASE_ID, 'properties', 'bathrooms', false);
    await databases.createIntegerAttribute(DATABASE_ID, 'properties', 'area', false);
    await databases.createStringAttribute(DATABASE_ID, 'properties', 'property_type', 50, false);
    await databases.createStringAttribute(DATABASE_ID, 'properties', 'images', 500, false, undefined, true);
    await databases.createStringAttribute(DATABASE_ID, 'properties', 'landlord_id', 50, true);
    await databases.createStringAttribute(DATABASE_ID, 'properties', 'status', 20, false, 'available');
    await databases.createBooleanAttribute(DATABASE_ID, 'properties', 'isPremium', false, false);
    await databases.createDatetimeAttribute(DATABASE_ID, 'properties', 'featuredExpiresAt', false);

    console.log('Properties collection created with attributes!');

    // Create Profiles collection
    await databases.createCollection(DATABASE_ID, 'profiles', 'Profiles', [
      Permission.read(Role.any()),
      Permission.create(Role.users()),
      Permission.update(Role.users())
    ]);

    await databases.createStringAttribute(DATABASE_ID, 'profiles', 'firstName', 100, false);
    await databases.createStringAttribute(DATABASE_ID, 'profiles', 'lastName', 100, false);
    await databases.createStringAttribute(DATABASE_ID, 'profiles', 'email', 255, true);
    await databases.createStringAttribute(DATABASE_ID, 'profiles', 'phoneNumber', 20, false);
    await databases.createStringAttribute(DATABASE_ID, 'profiles', 'role', 20, false, 'user');
    await databases.createStringAttribute(DATABASE_ID, 'profiles', 'agencyName', 255, false);
    await databases.createStringAttribute(DATABASE_ID, 'profiles', 'photoURL', 500, false);
    await databases.createBooleanAttribute(DATABASE_ID, 'profiles', 'isActive', false, true);
    await databases.createBooleanAttribute(DATABASE_ID, 'profiles', 'isPro', false, false);
    await databases.createDatetimeAttribute(DATABASE_ID, 'profiles', 'proExpiresAt', false);

    console.log('Profiles collection created with attributes!');

    // Create Payment Requests collection
    await databases.createCollection(DATABASE_ID, 'payment_requests', 'Payment Requests', [
      Permission.read(Role.any()),
      Permission.create(Role.users()),
      Permission.update(Role.users())
    ]);

    await databases.createStringAttribute(DATABASE_ID, 'payment_requests', 'propertyId', 50, true);
    await databases.createStringAttribute(DATABASE_ID, 'payment_requests', 'propertyTitle', 255, true);
    await databases.createStringAttribute(DATABASE_ID, 'payment_requests', 'userId', 50, true);
    await databases.createStringAttribute(DATABASE_ID, 'payment_requests', 'userName', 255, true);
    await databases.createStringAttribute(DATABASE_ID, 'payment_requests', 'userEmail', 255, true);
    await databases.createFloatAttribute(DATABASE_ID, 'payment_requests', 'amount', true);
    await databases.createStringAttribute(DATABASE_ID, 'payment_requests', 'paymentScreenshot', 500, true);
    await databases.createStringAttribute(DATABASE_ID, 'payment_requests', 'status', 20, false, 'pending');
    await databases.createStringAttribute(DATABASE_ID, 'payment_requests', 'promotionType', 100, true);
    await databases.createDatetimeAttribute(DATABASE_ID, 'payment_requests', 'approvedAt', false);
    await databases.createStringAttribute(DATABASE_ID, 'payment_requests', 'approvedBy', 50, false);

    console.log('Payment Requests collection created with attributes!');

    // Create storage bucket
    await storage.createBucket('images', 'Images', [
      Permission.read(Role.any()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users())
    ]);

    console.log('Storage bucket created!');

  } catch (error) {
    if (error.code === 409) {
      console.log('Collections already exist');
    } else {
      console.error('Error creating collections:', error);
    }
  }
}

async function main() {
  console.log('Setting up Appwrite database and collections...');
  await createDatabase();
  await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for database creation
  await createCollectionsWithAttributes();
  console.log('Appwrite setup completed!');
}

main();
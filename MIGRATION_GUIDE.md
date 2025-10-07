# Firestore to Supabase Migration Guide

## Prerequisites

1. **Supabase Project Setup**
   - Run the SQL schema in your Supabase dashboard (from `supabase-schema.sql`)
   - Create storage buckets: `property-images` and `avatars`
   - Get your service role key from Supabase dashboard

2. **Firebase Service Account**
   - Download your Firebase service account key JSON file
   - Place it in the project root

## Migration Steps

### 1. Install Migration Dependencies
```bash
npm install firebase-admin
```

### 2. Set Environment Variables
```bash
export NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
```

### 3. Update Migration Script
- Edit `migrate-firestore-to-supabase.js`
- Update the path to your Firebase service account key
- Uncomment the `runMigration()` call at the bottom

### 4. Run Migration
```bash
node migrate-firestore-to-supabase.js
```

## What Gets Migrated

### Properties
- All property listings with images, pricing, location data
- Property types, amenities, and status
- Agent associations

### Users
- User profiles and roles (user/agent/admin)
- Contact information and avatars
- Account creation dates

### Images
- Property images will need to be manually migrated to Supabase Storage
- Update image URLs in the database after migration

## Post-Migration Steps

1. **Verify Data**: Check your Supabase dashboard to ensure all data migrated correctly
2. **Update Image URLs**: Migrate images to Supabase Storage and update URLs
3. **Test Authentication**: Ensure users can sign in with their existing accounts
4. **Update Environment Variables**: Set production Supabase credentials

## Storage Migration

For images, you'll need to:
1. Download images from Firebase Storage
2. Upload to Supabase Storage buckets
3. Update image URLs in the database

## Rollback Plan

Keep your Firebase project active during testing. You can always revert the app to use Firebase if needed.
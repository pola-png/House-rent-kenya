# Supabase Migration Guide

## Changes Made

### 1. Dependencies Added
- `@supabase/supabase-js` - Supabase JavaScript client

### 2. New Files Created
- `src/lib/supabase.ts` - Supabase client configuration
- `src/hooks/use-auth-supabase.tsx` - New auth hook using Supabase
- `src/lib/storage.ts` - Storage utility functions for Supabase

### 3. Files Updated
- `package.json` - Added Supabase dependency
- `src/app/layout.tsx` - Updated to use new auth provider
- `src/app/login/page.tsx` - Updated to use Supabase auth
- `src/app/signup/user/page.tsx` - Updated to use Supabase auth
- `src/app/signup/agent/page.tsx` - Updated to use Supabase auth
- `src/components/header.tsx` - Updated to use Supabase auth

### 4. Environment Variables
Your `.env` file already has the required Supabase credentials:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Installation Steps

1. Install dependencies:
```bash
npm install
```

2. Supabase Setup (if not already done):
   - Create a Supabase project at https://supabase.com
   - Enable Email authentication in Authentication > Providers
   - Enable Google OAuth in Authentication > Providers (for Google sign-in)
   - Create a storage bucket named "properties" for property images
   - Set up Row Level Security (RLS) policies as needed

3. Start the development server:
```bash
npm run dev
```

## Features Preserved

✅ All UI/UX components remain unchanged
✅ All page layouts and designs intact
✅ Login functionality (now with Supabase)
✅ Signup for users and agents (now with Supabase)
✅ Google OAuth support
✅ User profile management
✅ Session persistence
✅ Protected routes

## New Capabilities

✅ Real authentication (replaces mock auth)
✅ Secure password storage
✅ Email verification support
✅ Password reset functionality
✅ File storage with Supabase Storage
✅ Real-time auth state management

## Storage Functions

The new `src/lib/storage.ts` provides:
- `uploadFile(bucket, path, file)` - Upload files to Supabase Storage
- `getPublicUrl(bucket, path)` - Get public URL for files
- `deleteFile(bucket, path)` - Delete files
- `listFiles(bucket, path)` - List files in a bucket

## Migration Notes

- The old `use-auth.tsx` file is preserved (not deleted)
- All components now use `use-auth-supabase.tsx`
- Auth functions are now async (return Promises)
- User metadata is stored in Supabase user_metadata field
- No changes to UI components or styling

## Next Steps

1. Test authentication flows
2. Set up Supabase Storage buckets for property images
3. Configure RLS policies for security
4. Set up email templates in Supabase
5. Configure OAuth providers (Google, etc.)

# Quick Setup Guide - 5 Minutes ⚡

## Step 1: Database Schema (2 min)
1. Open Supabase Dashboard → SQL Editor
2. Copy and paste contents of `SUPABASE_SCHEMA.sql`
3. Click "Run"
4. Wait for success message ✅

**Note:** If you get column name errors, the schema has been fixed. Just re-run it!

## Step 2: Storage Bucket (2 min)
1. Go to Storage in Supabase Dashboard
2. Click "Create Bucket"
3. Name it: `user-uploads`
4. Make it **Public** ✅
5. Go to SQL Editor
6. Copy and paste contents of `STORAGE_POLICIES.sql`
7. Click "Run"

## Step 3: Environment Check (1 min)
Verify your `.env` file has:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Test It! 🎉

### Test Authentication
1. Go to `/signup/agent`
2. Create a new account
3. You should be redirected to dashboard

### Test Property Posting
1. Click "Post a Property" in dashboard
2. Fill out the form
3. Submit
4. Check "My Listings" - your property should appear!

### Test Search
1. Go to homepage
2. Click "To Rent"
3. Your property should appear in search results

### Test Profile
1. Go to Profile in dashboard
2. Click camera icon on avatar
3. Upload a photo
4. Check header - your photo should appear!

## Common Issues & Fixes

### Column name errors
- **Fixed!** The schema now uses consistent camelCase
- If you ran the old schema, drop tables and re-run
- See `TROUBLESHOOTING.md` for details

### "Not authenticated" error
- Make sure you're logged in
- Check browser console for auth errors
- Verify Supabase keys in `.env`

### Properties not showing
- Check RLS policies are enabled
- Verify `landlordId` matches your user ID
- Check browser console for errors

### Photo upload fails
- Ensure storage bucket is public
- Check storage policies are applied
- Verify bucket name is exactly `user-uploads`

### Search shows 0 results
- Make sure you've created at least one property
- Check the property status matches the search type
- Verify database connection

## What Changed?

✅ **Authentication Required** - Can't post without login
✅ **Real Database** - All data saved to Supabase
✅ **User-Specific Listings** - See only your properties
✅ **Working Search** - Filters by rent/sale correctly
✅ **Profile Photos** - Upload and change anytime
✅ **Persistent Login** - Stay logged in across pages

## Need Help?

Check `FIXES_APPLIED.md` for detailed information about each fix.

---

**Total Setup Time**: ~5 minutes
**Difficulty**: Easy
**Result**: Fully functional property management system! 🏠

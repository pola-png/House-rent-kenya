# Troubleshooting Guide 🔧

## Common Setup Issues

### ✅ FIXED: Column Name Error

**Error Message:**
```
ERROR: 42703: column "landlord_id" does not exist
HINT: Perhaps you meant to reference the column "properties.landlordId".
```

**Cause:** SQL schema had inconsistent column naming (snake_case vs camelCase)

**Solution:** The `SUPABASE_SCHEMA.sql` file has been updated with correct camelCase column names throughout. Simply re-run the schema.

---

## Setup Issues

### Issue: Schema Won't Run

**Symptoms:**
- SQL errors when running schema
- Column name mismatches
- Reference errors

**Solution:**
1. Drop existing tables (if any):
```sql
DROP TABLE IF EXISTS callback_requests CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS developments CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP FUNCTION IF EXISTS handle_new_user CASCADE;
```

2. Re-run the updated `SUPABASE_SCHEMA.sql`

---

### Issue: Storage Bucket Policies Fail

**Symptoms:**
- Can't upload files
- Permission denied errors
- Storage access issues

**Solution:**
1. Ensure bucket `user-uploads` exists and is **public**
2. Run `STORAGE_POLICIES.sql` in SQL Editor
3. Verify policies in Storage → Policies tab

---

### Issue: Authentication Not Working

**Symptoms:**
- Can't log in
- "Not authenticated" errors
- Redirect loops

**Solution:**
1. Check `.env` file has correct Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

2. Restart dev server:
```bash
npm run dev
```

3. Clear browser cache and cookies

---

### Issue: Properties Not Showing

**Symptoms:**
- My Listings is empty
- Search shows 0 results
- Properties disappear after posting

**Solution:**
1. Check RLS policies are enabled:
```sql
-- Verify in Supabase Dashboard → Authentication → Policies
```

2. Verify user is logged in:
```javascript
// Check browser console
console.log(user);
```

3. Check landlordId matches:
```sql
-- In Supabase SQL Editor
SELECT * FROM properties WHERE "landlordId" = 'your-user-id';
```

---

### Issue: Profile Photo Won't Upload

**Symptoms:**
- Upload button doesn't work
- Photo doesn't appear
- Upload errors

**Solution:**
1. Verify storage bucket exists and is public
2. Check storage policies are applied
3. Verify bucket name is exactly `user-uploads`
4. Check browser console for errors

---

## Database Verification

### Check Tables Exist
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

**Expected Output:**
- profiles
- properties
- articles
- developments
- callback_requests

---

### Check RLS Policies
```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

**Expected Policies:**
- Properties are viewable by everyone
- Agents can insert properties
- Agents can update own properties
- Agents can delete own properties
- Public profiles are viewable by everyone
- Users can update own profile

---

### Check Column Names
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'properties';
```

**Expected Columns (camelCase):**
- id
- title
- description
- price
- propertyType
- bedrooms
- bathrooms
- area
- location
- city
- latitude
- longitude
- images
- amenities
- landlordId
- status
- featured
- keywords
- createdAt
- updatedAt

---

## Application Issues

### Issue: "Module not found" errors

**Solution:**
```bash
npm install
# or
npm ci
```

---

### Issue: TypeScript errors

**Solution:**
```bash
# Restart TypeScript server in VS Code
# Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

---

### Issue: Build errors

**Solution:**
```bash
# Clean build
rm -rf .next
npm run build
```

---

## Testing Checklist

### ✅ Database Setup
- [ ] Schema runs without errors
- [ ] All tables created
- [ ] RLS policies enabled
- [ ] Trigger function created

### ✅ Storage Setup
- [ ] Bucket `user-uploads` exists
- [ ] Bucket is public
- [ ] Storage policies applied
- [ ] Can upload test file

### ✅ Authentication
- [ ] Can sign up
- [ ] Can log in
- [ ] Can log out
- [ ] Session persists

### ✅ Properties
- [ ] Can create listing
- [ ] Listing appears in My Listings
- [ ] Listing appears in search
- [ ] Can edit listing
- [ ] Can delete listing

### ✅ Profile
- [ ] Can upload photo
- [ ] Photo appears in header
- [ ] Can edit info
- [ ] Changes save

---

## Quick Fixes

### Reset Everything
```sql
-- WARNING: This deletes all data!
DROP TABLE IF EXISTS callback_requests CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS developments CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP FUNCTION IF EXISTS handle_new_user CASCADE;

-- Then re-run SUPABASE_SCHEMA.sql
```

### Clear Browser Data
1. Open DevTools (F12)
2. Application tab
3. Clear storage
4. Refresh page

### Restart Dev Server
```bash
# Stop server (Ctrl+C)
# Clear cache
rm -rf .next
# Restart
npm run dev
```

---

## Getting Help

### Check Logs

**Browser Console:**
- F12 → Console tab
- Look for red errors

**Supabase Logs:**
- Dashboard → Logs
- Check API logs
- Check Auth logs

**Network Tab:**
- F12 → Network tab
- Check failed requests
- Look at response data

---

## Still Having Issues?

1. **Check the error message** - Most errors are self-explanatory
2. **Read the documentation** - Check `QUICK_SETUP.md` and `FIXES_APPLIED.md`
3. **Verify environment** - Ensure `.env` is correct
4. **Check Supabase Dashboard** - Look for errors in logs
5. **Clear everything** - Sometimes a fresh start helps

---

## Success Indicators

✅ **Everything Working:**
- No console errors
- Can sign up/login
- Can post properties
- Properties appear in listings
- Search works
- Profile photo uploads
- No red errors anywhere

🎉 **You're ready to go!**

# Admin Setup Guide

## How to Set Admin Role in Supabase

### Method 1: Using Supabase Dashboard

1. **Go to Supabase Dashboard**
   - Open your project at https://supabase.com
   - Navigate to "SQL Editor"

2. **Run SQL Command**
   ```sql
   UPDATE profiles 
   SET role = 'admin' 
   WHERE email = 'your-email@example.com';
   ```
   Replace `your-email@example.com` with the actual admin email

3. **Verify Admin Role**
   ```sql
   SELECT id, email, role, "firstName", "lastName" 
   FROM profiles 
   WHERE role = 'admin';
   ```

### Method 2: Using Table Editor

1. Go to "Table Editor" in Supabase Dashboard
2. Select the `profiles` table
3. Find the user you want to make admin
4. Click on the `role` field
5. Change value from `user` or `agent` to `admin`
6. Save changes

## Admin Features

Once a user has admin role, they can:

### Property Management
- ✅ View all properties from all agents
- ✅ Approve/reject property promotions
- ✅ Edit any property
- ✅ Delete any property
- ✅ Feature properties on homepage

### User Management
- ✅ View all users and agents
- ✅ Change user roles
- ✅ Suspend/activate accounts
- ✅ View user activity

### Dashboard Access
- ✅ Access admin dashboard at `/admin/dashboard`
- ✅ View platform analytics
- ✅ Monitor property listings
- ✅ Review promotion requests

## Testing Admin Access

1. **Login with admin account**
2. **Check header navigation** - Should show "Admin" link
3. **Access admin routes** - Navigate to `/admin/dashboard`
4. **Verify permissions** - Should see all properties, not just own

## Current Role Types

- `user` - Can browse and search properties only
- `agent` - Can post and manage own properties
- `admin` - Full access to all features

## Security Notes

- Admin role is checked on both frontend and backend
- Protected routes redirect non-admins
- Database RLS policies enforce role-based access
- Always use secure passwords for admin accounts

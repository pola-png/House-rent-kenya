# 🔧 Supabase Admin Features Setup

## 📋 Required Database Updates

### **1. Run SQL Script**
Copy and paste the entire content of `ADMIN_FEATURES_UPDATE.sql` into your **Supabase SQL Editor** and execute it.

### **2. What This Script Does:**

#### **👥 User Management Features:**
- Adds `isBanned` column for user banning
- Adds `isPro` and `proExpiresAt` for Pro subscriptions
- Adds `isActive` for user activation/deactivation
- Creates indexes for better performance

#### **🏠 Property Management Features:**
- Adds `featured` and `featuredExpiresAt` for featured listings
- Adds `isPremium` for premium properties
- Adds `views` column for view counting
- Creates `promote_property()` function for payment approvals

#### **💰 Payment System:**
- Creates `payment_requests` table for M-Pesa payments
- Adds RLS policies for secure access
- Creates indexes for performance

#### **📞 Callback System:**
- Creates `callback_requests` table for lead management
- Adds RLS policies for agent access
- Creates performance indexes

#### **🔐 Security & Permissions:**
- RLS policies for admin-only access
- Secure functions with SECURITY DEFINER
- Proper role-based permissions

### **3. Verification Steps:**

After running the SQL script, verify in Supabase:

1. **Tables exist:**
   - `profiles` (with new columns)
   - `properties` (with new columns)
   - `payment_requests`
   - `callback_requests`

2. **Functions exist:**
   - `promote_property()`
   - `increment_property_views()`

3. **Indexes created:**
   - Performance indexes on all new columns

### **4. Test Admin Features:**

1. **User Management:**
   - Ban/unban users ✅
   - Activate/deactivate users ✅
   - Grant/remove Pro status ✅

2. **Property Management:**
   - Feature/unfeature properties ✅
   - Set premium status ✅
   - View count tracking ✅

3. **Payment Processing:**
   - M-Pesa payment approvals ✅
   - Automatic property promotion ✅

4. **Callback Requests:**
   - Lead management ✅
   - Agent notifications ✅

## ⚠️ Important Notes:

- **Backup your database** before running the script
- Run the script in **Supabase SQL Editor** (not locally)
- All changes are **backwards compatible**
- Existing data will **not be affected**
- New columns have **safe defaults**

## 🚀 After Setup:

Your admin system will have **full database support** for:
- ✅ Real-time user management
- ✅ Property promotion system
- ✅ Payment processing
- ✅ Lead management
- ✅ Analytics and reporting
- ✅ Bulk operations

The admin dashboard will now work with **real database data** and all **real-time toggles** will function properly!
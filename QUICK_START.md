# Quick Start Guide

## ✅ Your Supabase credentials are already configured!

Your `.env` file has:
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - Configured
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Configured

## 🚀 Get Started in 3 Steps:

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Supabase (One-time setup)

Go to your Supabase Dashboard: https://supabase.com/project/mntibasereference/settings/auth

#### Enable Email Authentication:
- Go to **Authentication** → **Providers**
- Ensure **Email** is enabled
- For development, you can disable email confirmation

#### Enable Google OAuth (Optional):
- Go to **Authentication** → **Providers** → **Google**
- Add your Google OAuth credentials
- Add redirect URL: `http://localhost:9002/auth/callback`

### 3. Start Development
```bash
npm run dev
```

Visit: http://localhost:9002

## 🎯 What's New:

- ✅ Real authentication (replaces mock data)
- ✅ Secure password storage
- ✅ Email/password login
- ✅ Google OAuth support
- ✅ User sessions persist
- ✅ File storage ready (for property images)

## 🎨 What's Preserved:

- ✅ All UI/UX components
- ✅ All page layouts
- ✅ All styling and design
- ✅ All existing features

## 📝 Test Authentication:

1. **Sign Up**: Go to `/signup` → Choose User or Agent → Create account
2. **Login**: Go to `/login` → Enter credentials
3. **Dashboard**: After login, you'll be redirected to `/admin/dashboard`

## 🔧 Optional Setup:

### Create Storage Buckets (for images):
1. Go to **Storage** in Supabase Dashboard
2. Create bucket: `properties` (for property images)
3. Create bucket: `avatars` (for user profiles)
4. Set to Public or configure RLS policies

### Create Profiles Table (for user data):
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  role TEXT,
  agency_name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🎉 You're Ready!

Your app now uses real Supabase authentication with all UI/UX intact.

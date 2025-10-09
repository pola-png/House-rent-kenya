# 🚀 Deployment Checklist

## ✅ Pre-Deployment Setup

### 1. Database Setup (Required)
Execute the SQL schema in your Supabase project:

1. Go to: https://supabase.com/dashboard/project/mntibasereference/editor
2. Open SQL Editor
3. Copy and paste contents from `SUPABASE_SCHEMA.sql`
4. Execute the SQL

This creates:
- ✅ `profiles` table (user data)
- ✅ `properties` table (property listings)
- ✅ `articles` table (blog posts)
- ✅ `developments` table (new developments)
- ✅ `callback_requests` table (contact requests)
- ✅ Row Level Security policies
- ✅ Auto-create profile trigger

### 2. Authentication Setup (Required)

Go to: https://supabase.com/project/mntibasereference/settings/auth

**Email Authentication:**
- ✅ Enable Email provider
- ✅ For development: Disable email confirmation
- ✅ For production: Configure email templates

**Google OAuth (Optional):**
- ✅ Enable Google provider
- ✅ Add Client ID and Secret
- ✅ Add redirect URLs:
  - Development: `http://localhost:9002/auth/callback`
  - Production: `https://yourdomain.com/auth/callback`

### 3. Storage Setup (Required for Images)

Go to: https://supabase.com/project/mntibasereference/storage

Create buckets:
- ✅ `properties` - For property images (Public)
- ✅ `avatars` - For user profile pictures (Public)
- ✅ `documents` - For property documents (Private)

### 4. Environment Variables

**Development (.env):**
```env
NEXT_PUBLIC_SUPABASE_URL=https://mntibasereference.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Production (Vercel/Netlify):**
- Add same variables to deployment platform
- Never commit `.env` to git

## 🔧 Code Changes Made

### Files Created:
- ✅ `src/lib/supabase.ts` - Supabase client
- ✅ `src/lib/supabase-client.ts` - Data operations
- ✅ `src/hooks/use-auth-supabase.tsx` - Auth hook
- ✅ `src/lib/storage.ts` - File upload utilities
- ✅ `SUPABASE_SCHEMA.sql` - Database schema

### Files Updated:
- ✅ `package.json` - Added @supabase/supabase-js
- ✅ `src/app/layout.tsx` - Uses Supabase auth
- ✅ `src/app/login/page.tsx` - Uses Supabase auth
- ✅ `src/app/signup/user/page.tsx` - Uses Supabase auth
- ✅ `src/app/signup/agent/page.tsx` - Uses Supabase auth
- ✅ `src/components/header.tsx` - Uses Supabase auth

## 📦 Deployment Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Test Locally
```bash
npm run dev
```
Visit: http://localhost:9002

### 3. Build for Production
```bash
npm run build
```

### 4. Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

Or push to GitHub and connect to Vercel dashboard.

### 5. Set Environment Variables
In Vercel/Netlify dashboard, add:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## ✅ Post-Deployment

### 1. Test Authentication
- ✅ Sign up new user
- ✅ Login with email/password
- ✅ Test Google OAuth (if enabled)
- ✅ Test logout

### 2. Test Data Operations
- ✅ View properties
- ✅ Create new property (as agent)
- ✅ Update property
- ✅ Delete property

### 3. Configure Email (Production)
- ✅ Set up custom SMTP in Supabase
- ✅ Configure email templates
- ✅ Test password reset
- ✅ Test email verification

## 🔒 Security Checklist

- ✅ Row Level Security enabled on all tables
- ✅ API keys in environment variables (not in code)
- ✅ `.env` in `.gitignore`
- ✅ HTTPS enabled in production
- ✅ Email verification enabled (production)
- ✅ Rate limiting configured (Supabase settings)

## 📊 Optional: Seed Data

To add sample data for testing:
1. Go to Supabase SQL Editor
2. Run INSERT statements for:
   - Articles
   - Developments
   - Sample properties

## 🎯 Production Checklist

- [ ] Database schema executed
- [ ] Email authentication enabled
- [ ] Storage buckets created
- [ ] Environment variables set
- [ ] npm install completed
- [ ] npm run build successful
- [ ] Deployed to production
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Email templates configured
- [ ] Test authentication flow
- [ ] Test data operations

## 🎉 You're Ready!

Your app is now using real Supabase data and ready for production deployment!

# 🚀 Deploy on Windows - Step by Step

## ✅ Pre-Deployment Setup

### 1. Execute Database Schema (REQUIRED)

1. Go to: **https://supabase.com/project/mntibasereference/editor**
2. Open SQL Editor
3. Copy all contents from `SUPABASE_SCHEMA.sql`
4. Paste and Execute
5. Verify tables are created (check Tables section)

### 2. Install Dependencies

```powershell
npm install
```

### 3. Test Locally

```powershell
npm run dev
```

Visit: http://localhost:9002

Test:
- Sign up at `/signup`
- Login at `/login`
- Create property as agent

---

## 🚀 Deploy to Vercel (Recommended)

### Option 1: Deploy via GitHub (Easiest)

1. **Push to GitHub:**
   ```powershell
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to: https://vercel.com/new
   - Import your GitHub repository
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL` = `https://mntibasereference.supabase.co`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (your key from `.env`)
   - Click Deploy

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```powershell
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```powershell
   vercel login
   ```

3. **Deploy:**
   ```powershell
   vercel
   ```

4. **Add Environment Variables:**
   - Go to project settings on Vercel
   - Add environment variables from `.env`

---

## 🌐 Alternative: Deploy to Netlify

### Via Netlify CLI:

1. **Install Netlify CLI:**
   ```powershell
   npm install -g netlify-cli
   ```

2. **Build:**
   ```powershell
   npm run build
   ```

3. **Deploy:**
   ```powershell
   netlify deploy --prod
   ```

### Via Netlify Dashboard:

1. Go to: https://app.netlify.com/
2. Drag and drop your `.next` folder
3. Add environment variables in site settings

---

## ✅ Post-Deployment Checklist

### 1. Configure Authentication Redirect URLs

Go to: https://supabase.com/project/mntibasereference/settings/auth

Add your production URL to:
- **Site URL:** `https://your-app.vercel.app`
- **Redirect URLs:** `https://your-app.vercel.app/auth/callback`

### 2. Test Production

- ✅ Sign up new user
- ✅ Login with email/password
- ✅ Test Google OAuth (if enabled)
- ✅ Create property as agent
- ✅ Upload images
- ✅ Test all features

### 3. Enable Email Verification (Optional)

In Supabase Settings:
- Enable email confirmation
- Configure email templates
- Set up custom SMTP (optional)

---

## 🔧 Troubleshooting

### Build Fails on Windows

**Issue:** `NODE_ENV is not recognized`

**Solution:** Already fixed! Just run:
```powershell
npm run build
```

### Vercel Not Found

**Solution:** Install globally:
```powershell
npm install -g vercel
```

Or use GitHub deployment (easier).

### Environment Variables Not Working

**Solution:** 
- Ensure variables start with `NEXT_PUBLIC_`
- Redeploy after adding variables
- Check Vercel/Netlify dashboard

---

## 📋 Quick Deploy Checklist

- [ ] Database schema executed in Supabase
- [ ] `npm install` completed
- [ ] Tested locally (`npm run dev`)
- [ ] Code pushed to GitHub
- [ ] Connected to Vercel/Netlify
- [ ] Environment variables added
- [ ] Deployed successfully
- [ ] Updated auth redirect URLs
- [ ] Tested production site

---

## 🎉 You're Live!

Your app is now deployed and using real Supabase data! 🚀

**Production URL:** Check Vercel/Netlify dashboard for your live URL

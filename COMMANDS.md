# 🚀 Quick Commands Reference

## 📦 Development

```powershell
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🚀 Deploy to Vercel (Easiest Way)

### Method 1: Via GitHub (Recommended)
```powershell
# Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# Then go to: https://vercel.com/new
# Import your repository and deploy
```

### Method 2: Via Vercel CLI
```powershell
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel
```

## 🔧 Setup Supabase Database

1. Go to: https://supabase.com/project/mntibasereference/editor
2. Copy contents of `SUPABASE_SCHEMA.sql`
3. Paste and Execute

## ✅ Test Locally

```powershell
# Start dev server
npm run dev

# Open browser
start http://localhost:9002
```

## 📝 Git Commands

```powershell
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Add remote (replace with your repo)
git remote add origin https://github.com/yourusername/your-repo.git

# Push
git push -u origin main
```

## 🔐 Environment Variables

Your `.env` file (already configured):
```env
NEXT_PUBLIC_SUPABASE_URL=https://mntibasereference.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
```

**For Production (Vercel/Netlify):**
- Add same variables in deployment platform settings

## 🎯 Quick Start (3 Commands)

```powershell
# 1. Install
npm install

# 2. Start
npm run dev

# 3. Open
start http://localhost:9002
```

## 🚀 Deploy (Easiest Way)

1. **Push to GitHub:**
   ```powershell
   git add .
   git commit -m "Deploy"
   git push
   ```

2. **Deploy on Vercel:**
   - Go to: https://vercel.com/new
   - Import your GitHub repo
   - Add environment variables
   - Click Deploy

**Done! 🎉**

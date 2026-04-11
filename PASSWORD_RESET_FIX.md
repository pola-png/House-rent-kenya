# Password Reset Not Working - Complete Fix

## Problem
Reset link expires immediately even when opened within 30 seconds.

## Root Cause
Supabase redirect URL configuration doesn't match your actual domain.

## Complete Fix Steps

### Step 1: Check Your Supabase Configuration

1. Go to **Supabase Dashboard** → **Authentication** → **URL Configuration**

2. **CRITICAL**: Set these EXACTLY as shown:
   ```
   Site URL: https://houserentkenya.co.ke
   
   Redirect URLs (add all these):
   https://houserentkenya.co.ke/**
   https://houserentkenya.co.ke/reset-password
   http://localhost:3000/reset-password
   ```

3. Click **Save**

### Step 2: Update Email Template

1. Go to **Authentication** → **Email Templates** → **Reset Password (Change Email)**

2. Replace with this EXACT template:

```html
<h2>Reset Your Password</h2>

<p>Hi there,</p>

<p>Follow this link to reset your password for House Rent Kenya:</p>

<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>

<p>If that doesn't work, copy and paste this URL into your browser:</p>
<p>{{ .ConfirmationURL }}</p>

<p>This link expires in 1 hour.</p>

<p>If you didn't request this, ignore this email.</p>
```

### Step 3: Test the Flow

1. Clear your browser cache and cookies
2. Go to: https://houserentkenya.co.ke/forgot-password
3. Enter your email
4. Check email (including spam folder)
5. Click the reset link
6. You should see the password form
7. Enter new password
8. Submit

### Step 4: If Still Not Working

Check the URL in the email. It should look like:
```
https://houserentkenya.co.ke/reset-password#access_token=LONG_TOKEN_HERE&type=recovery
```

**NOT like:**
```
https://houserentkenya.co.ke/reset-password/reset-password
```

If you see the duplicate path, the email template is wrong.

### Step 5: Alternative - Use Supabase Default Template

If custom template doesn't work:

1. Go to **Email Templates** → **Reset Password**
2. Click **Revert to default template**
3. Just ensure Site URL is correct: `https://houserentkenya.co.ke`

### Step 6: Check Environment Variables

Verify your `.env.local` or Vercel environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Common Issues & Solutions

#### Issue: "Reset link expired" immediately
**Solution**: Site URL in Supabase doesn't match your domain. Update it.

#### Issue: 404 Page Not Found
**Solution**: Email template has wrong URL. Use `{{ .ConfirmationURL }}` not manual URL.

#### Issue: Blank page after clicking link
**Solution**: Redirect URLs not configured. Add `https://houserentkenya.co.ke/**` to redirect URLs.

#### Issue: Token not detected
**Solution**: Clear browser cache, try incognito mode.

### Testing Checklist

- [ ] Site URL is `https://houserentkenya.co.ke` (no trailing slash)
- [ ] Redirect URL includes `/reset-password`
- [ ] Email template uses `{{ .ConfirmationURL }}`
- [ ] Browser cache cleared
- [ ] Tested in incognito mode
- [ ] Email received (check spam)
- [ ] URL in email has `#access_token=` in it
- [ ] Form appears when clicking link
- [ ] Can submit new password

### Still Not Working?

1. **Check Supabase Logs**:
   - Go to Supabase Dashboard → Logs
   - Look for auth errors

2. **Check Browser Console**:
   - Open DevTools (F12)
   - Look for errors when clicking reset link

3. **Verify Email Service**:
   - Supabase free tier has email limits
   - Consider setting up custom SMTP

4. **Contact Support**:
   - If all else fails, contact Supabase support
   - Provide: Project ID, error messages, email template

### Quick Test Command

Open browser console on reset-password page and run:
```javascript
console.log(window.location.hash);
```

Should show: `#access_token=...&type=recovery`

If empty, the token isn't being passed from email.

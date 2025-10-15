# Supabase Email Configuration for Password Reset

## Issue
Password reset emails from Supabase redirect to a blank page because the email template needs to be configured with the correct redirect URL.

## Solution

### Step 1: Configure Site URL in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Set the following URLs:

   - **Site URL**: `https://your-domain.com` (or `http://localhost:3000` for development)
   - **Redirect URLs**: Add these URLs:
     - `https://your-domain.com/reset-password`
     - `http://localhost:3000/reset-password` (for development)

### Step 2: Update Email Template

1. Go to **Authentication** → **Email Templates**
2. Select **Reset Password** template
3. Replace the template with this:

```html
<h2>Reset Password</h2>

<p>Hi there,</p>

<p>You requested to reset your password for House Rent Kenya.</p>

<p>Click the button below to reset your password:</p>

<p><a href="{{ .SiteURL }}/reset-password?token={{ .Token }}&type=recovery">Reset Password</a></p>

<p>Or copy and paste this URL into your browser:</p>
<p>{{ .SiteURL }}/reset-password?token={{ .Token }}&type=recovery</p>

<p>This link will expire in 1 hour.</p>

<p>If you didn't request this, you can safely ignore this email.</p>

<p>Thanks,<br>House Rent Kenya Team</p>
```

### Step 3: Test the Flow

1. Go to `/forgot-password` on your site
2. Enter your email
3. Check your email inbox
4. Click the reset link
5. You should see the password reset form
6. Enter new password and confirm
7. You'll be redirected to login

## Alternative: Use Supabase Default Template

If you want to use Supabase's default template, just ensure:

1. **Site URL** is set correctly in Authentication settings
2. The redirect URL includes `/reset-password`

Supabase will automatically append the recovery token to the URL.

## Troubleshooting

### Blank Page After Clicking Reset Link

**Cause**: The email template is redirecting to the wrong URL or missing the token.

**Fix**: 
- Verify Site URL is correct in Supabase dashboard
- Check that `/reset-password` is in the Redirect URLs list
- Ensure email template includes `{{ .Token }}` parameter

### "Invalid or Expired Reset Link" Error

**Cause**: The reset link has expired (1 hour limit) or was already used.

**Fix**: Request a new password reset link from `/forgot-password`

### Email Not Received

**Cause**: Email might be in spam or Supabase email service is not configured.

**Fix**:
- Check spam folder
- For production, configure custom SMTP in Supabase dashboard:
  - Go to **Project Settings** → **Auth** → **SMTP Settings**
  - Add your email service credentials (Gmail, SendGrid, etc.)

## Development vs Production

### Development (localhost)
- Site URL: `http://localhost:3000`
- Redirect URL: `http://localhost:3000/reset-password`

### Production (Vercel/Custom Domain)
- Site URL: `https://your-domain.com`
- Redirect URL: `https://your-domain.com/reset-password`

## Important Notes

1. **Always update both Site URL and Redirect URLs** when deploying
2. **Test password reset** after any URL changes
3. **Email links expire in 1 hour** - users must act quickly
4. **One-time use** - each reset link can only be used once
5. **Secure tokens** - tokens are automatically handled by Supabase

## Quick Fix Checklist

- [ ] Site URL configured in Supabase
- [ ] Redirect URLs include `/reset-password`
- [ ] Email template includes token parameter
- [ ] Tested on development environment
- [ ] Tested on production environment
- [ ] SMTP configured for production (optional but recommended)

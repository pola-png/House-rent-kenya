# Enable Supabase Auth Security Features

## 1. Enable HaveIBeenPwned Password Protection

Go to your Supabase Dashboard:
1. Navigate to **Authentication** → **Settings**
2. Scroll to **Security** section
3. Enable **"Check passwords against HaveIBeenPwned"**
4. Click **Save**

This will prevent users from using compromised passwords.

## 2. Additional Security Settings to Enable

### Password Policy
- Minimum password length: 8 characters
- Require uppercase letters: Yes
- Require lowercase letters: Yes
- Require numbers: Yes
- Require special characters: Yes

### Session Settings
- JWT expiry: 3600 seconds (1 hour)
- Refresh token rotation: Enabled
- Reuse interval: 10 seconds

### Rate Limiting
- Enable rate limiting for auth endpoints
- Max requests per hour: 100 per IP

## 3. Apply the SQL Fixes

Run `FIX_SUPABASE_ISSUES.sql` in your Supabase SQL Editor to fix:
- Function security issues
- Performance optimizations
- Missing indexes

## 4. Monitor Performance

After applying fixes, monitor:
- Query performance in Database → Query Performance
- Function execution times
- Index usage statistics
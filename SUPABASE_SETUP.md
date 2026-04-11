# Supabase Setup Instructions

## 1. Install Dependencies

```bash
npm install
```

## 2. Supabase Project Configuration

Your `.env` file already has the Supabase credentials configured:
- `NEXT_PUBLIC_SUPABASE_URL=https://mntibasereference.com`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-key>`

## 3. Enable Authentication Providers

In your Supabase Dashboard (https://supabase.com/dashboard):

### Email Authentication
1. Go to **Authentication** > **Providers**
2. Enable **Email** provider
3. Configure email templates (optional)

### Google OAuth (Optional)
1. Go to **Authentication** > **Providers**
2. Enable **Google** provider
3. Add your Google OAuth credentials:
   - Client ID
   - Client Secret
4. Add authorized redirect URL: `http://localhost:9002/auth/callback` (for development)

## 4. Set Up Storage Buckets

1. Go to **Storage** in your Supabase Dashboard
2. Create a new bucket named `properties` for property images
3. Set the bucket to **Public** (or configure RLS policies)
4. Create additional buckets as needed:
   - `avatars` - For user profile pictures
   - `documents` - For property documents

## 5. Database Setup (Optional)

If you want to store user profiles in a database table:

```sql
-- Create a profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  display_name TEXT,
  role TEXT DEFAULT 'user',
  agency_name TEXT,
  phone_number TEXT,
  photo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);
```

## 6. Storage Policies (Optional)

For secure file uploads, set up RLS policies:

```sql
-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'properties');

-- Allow public access to files
CREATE POLICY "Public access to files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'properties');
```

## 7. Email Configuration (Optional)

Configure email templates in **Authentication** > **Email Templates**:
- Confirmation email
- Password reset email
- Magic link email

## 8. Start Development

```bash
npm run dev
```

Visit http://localhost:9002

## Testing Authentication

1. **Sign Up**: Navigate to `/signup` and create a new account
2. **Login**: Use your credentials at `/login`
3. **Google OAuth**: Click "Sign in with Google" (if configured)
4. **Password Reset**: Use the "Forgot Password" link

## Troubleshooting

### Issue: "Invalid API key"
- Check that your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Ensure you're using the anon/public key, not the service role key

### Issue: "Email not confirmed"
- Check your email for confirmation link
- Or disable email confirmation in Supabase settings (for development)

### Issue: "Google OAuth not working"
- Ensure you've added the correct redirect URL in Google Console
- Check that the Client ID and Secret are correct in Supabase

## Security Notes

- Never commit your `.env` file to version control
- Use environment variables for all sensitive data
- Enable RLS policies for production
- Use the service role key only on the server side

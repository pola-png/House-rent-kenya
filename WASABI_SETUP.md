# Wasabi Storage Setup Guide

## 1. Create Wasabi Account
1. Go to [Wasabi Console](https://console.wasabisys.com/)
2. Sign up for a new account
3. Complete email verification

## 2. Create Storage Bucket
1. In Wasabi Console, go to "Buckets"
2. Click "Create Bucket"
3. Name: `house-rent-kenya`
4. Region: `us-east-1` (or your preferred region)
5. Enable "Public Access" for the bucket

## 3. Generate Access Keys
1. Go to "Access Keys" in the console
2. Click "Create New Access Key"
3. Copy the Access Key ID and Secret Access Key
4. Store them securely

## 4. Configure Environment Variables
Update your `.env` file with your Wasabi credentials:

```env
# Wasabi Storage Configuration
NEXT_PUBLIC_WASABI_ENDPOINT=https://s3.wasabisys.com
NEXT_PUBLIC_WASABI_REGION=us-east-1
NEXT_PUBLIC_WASABI_BUCKET=house-rent-kenya
NEXT_PUBLIC_WASABI_ACCESS_KEY=your_actual_access_key_here
NEXT_PUBLIC_WASABI_SECRET_KEY=your_actual_secret_key_here
```

## 5. Set Bucket Policy (Optional)
For public read access, you can set a bucket policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::house-rent-kenya/*"
    }
  ]
}
```

## 6. Test Upload
After configuration, test the image upload functionality in your property form.

## Benefits of Wasabi over Supabase Storage
- No CORS issues
- Better performance for large files
- More cost-effective for storage
- S3-compatible API
- Better global CDN coverage

## File Structure
Images will be stored in:
- Property images: `properties/{userId}/{timestamp}-{filename}`
- Payment screenshots: `payment-screenshots/payment-{userId}-{timestamp}.{ext}`
import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_WASABI_REGION!,
  endpoint: `https://s3.${process.env.NEXT_PUBLIC_WASABI_REGION}.wasabisys.com`,
  credentials: {
    accessKeyId: process.env.WASABI_ACCESS_KEY_ID!,
    secretAccessKey: process.env.WASABI_SECRET_ACCESS_KEY!,
  },
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (!path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    const command = new GetObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_WASABI_BUCKET!,
      Key: path,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return NextResponse.redirect(signedUrl);
  } catch (error: any) {
    console.error('Image proxy error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

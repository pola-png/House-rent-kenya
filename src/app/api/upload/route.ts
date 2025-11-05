import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const path = formData.get('path') as string;

    if (!file || !path) {
      return NextResponse.json({ error: 'File and path are required' }, { status: 400 });
    }

    // Convert file to buffer for server-side upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create the Wasabi URL
    const bucket = process.env.NEXT_PUBLIC_WASABI_BUCKET;
    const region = process.env.NEXT_PUBLIC_WASABI_REGION;
    const endpoint = `https://${bucket}.s3.${region}.wasabisys.com/${path}`;

    // Upload to Wasabi using fetch with proper headers
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
        'Content-Length': buffer.length.toString(),
      },
      body: buffer,
    });

    if (!response.ok) {
      throw new Error(`Wasabi upload failed: ${response.status} ${response.statusText}`);
    }

    const publicUrl = `https://${bucket}.s3.${region}.wasabisys.com/${path}`;
    return NextResponse.json({ url: publicUrl });

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
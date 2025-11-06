import { NextResponse } from 'next/server';
import { getPresignedPutUrl, buildPublicishPath, extractWasabiKey } from '@/lib/wasabi';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { key, contentType } = body as { key?: string; contentType?: string };

    if (!key) {
      return NextResponse.json({ error: 'Missing key' }, { status: 400 });
    }

    // Prevent directory traversal or odd keys
    const sanitized = extractWasabiKey(String(key)).replace(/\.\.+/g, '.');
    if (/^\s*$/.test(sanitized)) {
      return NextResponse.json({ error: 'Invalid key' }, { status: 400 });
    }

    const { url, headers } = await getPresignedPutUrl(sanitized, {
      contentType,
      expiresIn: 300,
    });

    const getPath = buildPublicishPath(sanitized);

    return NextResponse.json({
      uploadUrl: url,
      uploadHeaders: headers,
      // Store getPath in DB; convert to presigned on read
      objectPath: getPath,
      expiresIn: 300,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Upload URL error' }, { status: 500 });
  }
}


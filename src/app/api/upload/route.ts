import { NextResponse } from 'next/server';
import { getPresignedPutUrl, buildPublicishPath, extractWasabiKey } from '@/lib/wasabi';
import { supabase } from '@/lib/supabase';

// Basic server-side limits
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB default limit (adjust as needed)
const ALLOWED_CONTENT_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
]);

function enforceContentType(ct?: string) {
  if (!ct || !ALLOWED_CONTENT_TYPES.has(ct)) {
    throw new Error('Unsupported content type');
  }
}

export async function POST(request: Request) {
  try {
    // AuthN: require a valid Supabase session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { key, contentType, contentLength } = body as { key?: string; contentType?: string; contentLength?: number };

    if (!key) {
      return NextResponse.json({ error: 'Missing key' }, { status: 400 });
    }

    // Basic file validations
    enforceContentType(contentType);
    if (typeof contentLength === 'number' && contentLength > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: 'File too large' }, { status: 413 });
    }

    // Prevent directory traversal or odd keys
    const sanitized = extractWasabiKey(String(key)).replace(/\.\.+/g, '.');
    if (/^\s*$/.test(sanitized)) {
      return NextResponse.json({ error: 'Invalid key' }, { status: 400 });
    }

    // AuthZ: enforce user-specific prefix (e.g., user/{uid}/...)
    const uid = session.user.id;
    const requiredPrefix = `user/${uid}/`;
    if (!sanitized.startsWith(requiredPrefix)) {
      return NextResponse.json({ error: 'Invalid key prefix' }, { status: 403 });
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

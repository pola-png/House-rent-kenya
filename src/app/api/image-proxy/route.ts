import { NextResponse } from 'next/server';
import { extractWasabiKey, getPresignedGetUrl, wasabiClient, getWasabiRuntimeConfig } from '@/lib/wasabi-server';
import { GetObjectCommand } from '@aws-sdk/client-s3';

function decodePath(p: string | null): string | null {
  if (!p) return p;
  try {
    let prev = p;
    for (let i = 0; i < 3; i++) {
      const dec = decodeURIComponent(prev);
      if (dec === prev) break;
      prev = dec;
    }
    return prev;
  } catch {
    return p;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const raw = searchParams.get('path');
    const decoded = decodePath(raw);
    if (!decoded) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    const key = decoded.startsWith('http') ? extractWasabiKey(decoded) : decoded;
    // Prefer streaming from Wasabi to avoid signed URL caching issues
    const { bucket } = getWasabiRuntimeConfig();
    if (wasabiClient && bucket) {
      try {
        const resp = await wasabiClient.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
        // @ts-ignore - Body is a stream
        const body = resp.Body as ReadableStream | null;
        if (!body) throw new Error('Empty object body');
        return new Response(body as any, {
          status: 200,
          headers: {
            'Content-Type': resp.ContentType || 'application/octet-stream',
            // Browser cache (short), CDN cache (long)
            'Cache-Control': 'public, max-age=300',
            'CDN-Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
          },
        });
      } catch (e) {
        // Fall through to redirect
      }
    }

    // Redirect as a fallback (no-store to avoid stale redirects)
    try {
      const signedUrl = await getPresignedGetUrl(key, 900);
      const res = NextResponse.redirect(signedUrl, 307);
      // Allow CDN to cache the redirect briefly while keeping browsers no-store
      res.headers.set('Cache-Control', 'no-store, max-age=0');
      res.headers.set('CDN-Cache-Control', 'public, max-age=0, s-maxage=600');
      return res;
    } catch (e: any) {
      if (decoded.startsWith('http')) {
        const res = NextResponse.redirect(decoded, 302);
        res.headers.set('Cache-Control', 'no-store, max-age=0');
        return res;
      }
      throw e;
    }
  } catch (error: any) {
    console.error('Image proxy error:', error);
    return NextResponse.json({ error: error.message || 'Proxy error' }, { status: 500 });
  }
}

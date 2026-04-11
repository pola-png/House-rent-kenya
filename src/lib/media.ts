import { supabase } from './supabase';

const PROPERTY_MEDIA_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_PROPERTY_BUCKET || 'property-images';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export function getPropertyMediaBucket(): string {
  return PROPERTY_MEDIA_BUCKET;
}

export function normalizeImageArray(images: unknown): string[] {
  if (!images) return [];
  if (Array.isArray(images)) {
    return images.filter((value): value is string => typeof value === 'string' && value.length > 0);
  }
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images);
      return normalizeImageArray(parsed);
    } catch {
      return images.length > 0 ? [images] : [];
    }
  }
  return [];
}

export async function uploadMediaFile(file: File, path: string, bucket = PROPERTY_MEDIA_BUCKET): Promise<string> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase URL or anon key');
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error('No active Supabase session');
  }

  const uploadUrl = `${SUPABASE_URL.replace(/\/+$/, '')}/storage/v1/object/${bucket}/${encodeURIComponent(path).replace(/%2F/g, '/')}`;
  const res = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'apikey': SUPABASE_ANON_KEY,
      'Content-Type': file.type || 'application/octet-stream',
      'x-upsert': 'false',
      'Cache-Control': '3600',
    },
    body: file,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Upload failed (${res.status}): ${text || res.statusText}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

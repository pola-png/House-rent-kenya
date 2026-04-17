import { supabase } from '@/lib/supabase';
import { getAccessTokenSync } from '@/lib/token-cache';

const PROPERTY_MEDIA_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_PROPERTY_BUCKET || 'property-images';
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

export async function uploadMediaFile(
  file: File,
  path: string,
  bucket = PROPERTY_MEDIA_BUCKET,
  accessToken?: string | null
): Promise<string> {
  let token = accessToken || null;
  if (!token) {
    token = getAccessTokenSync();
  }
  if (!token) {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      throw new Error(`Could not read Supabase session: ${error.message}`);
    }
    token = data.session?.access_token || null;
  }

  if (!token) {
    throw new Error('No active Supabase session');
  }

  const form = new FormData();
  form.append('file', file);
  form.append('path', path);
  form.append('bucket', bucket);

  const res = await fetch('/api/admin/storage/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: form,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Upload failed (${res.status}): ${text || res.statusText}`);
  }

  const json = await res.json().catch(() => ({}));
  if (!json?.publicUrl) {
    throw new Error('Upload succeeded but no public URL was returned');
  }
  return json.publicUrl as string;
}

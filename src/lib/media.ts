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
  if (!accessToken) {
    throw new Error('No active Supabase session');
  }

  const form = new FormData();
  form.append('file', file);
  form.append('path', path);
  form.append('bucket', bucket);

  const res = await fetch('/api/admin/storage/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
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

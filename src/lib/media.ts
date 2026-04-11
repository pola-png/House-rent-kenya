import { supabase } from './supabase';

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

export async function uploadMediaFile(file: File, path: string, bucket = PROPERTY_MEDIA_BUCKET): Promise<string> {
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

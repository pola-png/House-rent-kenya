import { extractWasabiKey, getPresignedGetUrl } from '@/lib/wasabi-server';

export const DEFAULT_GET_TTL = 900; // 15 minutes

export async function presignImageUrls(urls: string[] | null | undefined, ttl = DEFAULT_GET_TTL): Promise<string[] | null | undefined> {
  if (!urls || urls.length === 0) return urls;
  const out = await Promise.all(
    urls.map(async (u) => {
      try {
        // If already presigned, keep as-is
        if (/X-Amz-Signature=|X-Amz-Algorithm=/.test(u)) return u;
        // If not a Wasabi URL or key, return as-is (e.g., Supabase public URL)
        const isWasabi = /wasabisys\.com/.test(u) || !/^https?:\/\//i.test(u);
        if (!isWasabi) return u;
        const key = extractWasabiKey(u);
        // Some malformed entries stored an encoded Supabase URL as the Wasabi key.
        // If decoding yields an absolute URL, return that directly instead of presigning.
        if (/^https?:\/\//i.test(key)) return key;
        return await getPresignedGetUrl(key, ttl);
      } catch {
        return u; // fallback
      }
    })
  );
  return out;
}

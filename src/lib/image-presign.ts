import { extractWasabiKey, getPresignedGetUrl } from '@/lib/wasabi-server';

export const DEFAULT_GET_TTL = 900; // 15 minutes

export async function presignImageUrls(urls: string[] | null | undefined, ttl = DEFAULT_GET_TTL): Promise<string[] | null | undefined> {
  if (!urls || urls.length === 0) return urls;
  const out = await Promise.all(
    urls.map(async (u) => {
      try {
        const key = extractWasabiKey(u);
        return await getPresignedGetUrl(key, ttl);
      } catch {
        return u; // fallback
      }
    })
  );
  return out;
}

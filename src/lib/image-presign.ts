export const DEFAULT_GET_TTL = 900; // 15 minutes

export async function presignImageUrls(urls: string[] | null | undefined, ttl = DEFAULT_GET_TTL): Promise<string[] | null | undefined> {
  void ttl;
  return urls;
}

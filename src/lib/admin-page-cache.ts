type CacheEntry<T> = {
  timestamp: number;
  data: T;
};

const memoryCache = new Map<string, CacheEntry<unknown>>();

export const ADMIN_PAGE_CACHE_TTL = 5 * 60 * 1000;

function storageKey(key: string) {
  return `admin-page-cache:${key}`;
}

export function getAdminPageCache<T>(key: string, maxAgeMs = ADMIN_PAGE_CACHE_TTL) {
  const now = Date.now();
  const memoryEntry = memoryCache.get(key) as CacheEntry<T> | undefined;

  if (memoryEntry) {
    return {
      data: memoryEntry.data,
      isFresh: now - memoryEntry.timestamp <= maxAgeMs,
    };
  }

  if (typeof window === "undefined") {
    return { data: null as T | null, isFresh: false };
  }

  try {
    const raw = window.sessionStorage.getItem(storageKey(key));
    if (!raw) {
      return { data: null as T | null, isFresh: false };
    }

    const parsed = JSON.parse(raw) as CacheEntry<T>;
    memoryCache.set(key, parsed as CacheEntry<unknown>);

    return {
      data: parsed.data,
      isFresh: now - parsed.timestamp <= maxAgeMs,
    };
  } catch {
    return { data: null as T | null, isFresh: false };
  }
}

export function setAdminPageCache<T>(key: string, data: T) {
  const entry: CacheEntry<T> = {
    timestamp: Date.now(),
    data,
  };

  memoryCache.set(key, entry as CacheEntry<unknown>);

  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(storageKey(key), JSON.stringify(entry));
  } catch {}
}

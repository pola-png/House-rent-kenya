// Simple front-end token cache to make access tokens instantly available
// across components without waiting for async supabase calls.

let cachedToken: string | null = null;

export function setAccessToken(token: string | null) {
  cachedToken = token || null;
  try {
    if (typeof window !== 'undefined' && token) {
      window.localStorage.setItem('hrk_access_token', token);
    }
  } catch {}
}

export function getAccessTokenSync(): string | null {
  if (cachedToken) return cachedToken;
  try {
    if (typeof window !== 'undefined') {
      const t = window.localStorage.getItem('hrk_access_token');
      if (t) {
        cachedToken = t;
        return t;
      }
      // Fallback: attempt to read Supabase stored token
      const keys = Object.keys(window.localStorage);
      const sbKey = keys.find((k) => k.startsWith('sb-') && k.endsWith('-auth-token'));
      if (sbKey) {
        const raw = window.localStorage.getItem(sbKey);
        if (raw) {
          try {
            const json = JSON.parse(raw);
            const token = json?.access_token || json?.currentSession?.access_token || json?.state?.currentSession?.access_token;
            if (token) {
              cachedToken = token;
              window.localStorage.setItem('hrk_access_token', token);
              return token;
            }
          } catch {}
        }
      }
    }
  } catch {}
  return null;
}


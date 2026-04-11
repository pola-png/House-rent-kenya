"use client";

import { useEffect, useState } from 'react';

// Auto-retry helper for pages that fetch data and may stall on slow networks.
// Returns [retryTick, forceRetry]. Include retryTick in your data-fetch effect deps.
export function useAutoRetry(isLoading: boolean, deps: any[] = [], timeoutMs = 7500) {
  const [retryTick, setRetryTick] = useState(0);
  const [startedAt] = useState<number>(() => Date.now());

  useEffect(() => {
    const t = setTimeout(() => {
      if (isLoading && Date.now() - startedAt > timeoutMs - 500) {
        setRetryTick((x) => x + 1);
      }
    }, timeoutMs);
    const onOnline = () => setRetryTick((x) => x + 1);
    try { window.addEventListener('online', onOnline); } catch {}
    return () => {
      clearTimeout(t);
      try { window.removeEventListener('online', onOnline); } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, startedAt, timeoutMs, ...deps]);

  const forceRetry = () => setRetryTick((x) => x + 1);
  return [retryTick, forceRetry] as const;
}


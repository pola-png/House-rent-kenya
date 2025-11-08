"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth-supabase";
import { supabase } from "@/lib/supabase";
import { useAutoRetry } from "@/hooks/use-auto-retry";

type PromotionRow = {
  id: string;
  property_id?: string;
  property_title?: string | null;
  user_id?: string | null;
  agent_id?: string | null;
  screenshot_url?: string;
  status?: string;
  weeks?: number;
  created_at?: string;
  updated_at?: string;
};

export default function PromotionsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [propertyId, setPropertyId] = useState("");
  const [propertyTitle, setPropertyTitle] = useState("");
  const [weeks, setWeeks] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [rows, setRows] = useState<PromotionRow[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [retryTick, retryNow] = useAutoRetry(loadingList || submitting || !user, [user]);

  function log(...args: any[]) { console.log("[Promotions]", ...args); }

  async function presignWasabi(key: string, contentType: string, contentLength: number) {
    log("presign start", { key, contentType, contentLength });
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, contentType, contentLength }),
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json() as { url: string };
    log("presign ok", { key });
    return data;
  }

  async function uploadToWasabi(file: File) {
    const ext = file.name.split(".").pop() || "jpg";
    const key = `promotions/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { url } = await presignWasabi(key, file.type || "image/jpeg", file.size);
    log("wasabi PUT start", { key });
    const put = await fetch(url, { method: "PUT", body: file, headers: { "Content-Type": file.type || "application/octet-stream" } });
    if (!put.ok) throw new Error(`Wasabi PUT failed: ${put.status}`);
    log("wasabi PUT success", { key, status: put.status });
    const publicUrl = url.split("?")[0];
    return { key, url: publicUrl };
  }

  async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit & { timeoutMs?: number } = {}) {
    const { timeoutMs = 15000, ...rest } = init;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      // @ts-ignore
      const res: Response = await fetch(input, { ...rest, signal: controller.signal });
      return res;
    } finally { clearTimeout(id); }
  }

  async function submitPromotion() {
    log("submit triggered", { propertyId, hasFile: !!file, weeks });
    setSubmitError(null);
    if (!file) {
      const msg = "Please attach a screenshot";
      setSubmitError(msg);
      console.warn("[Promotions] submit blocked", msg);
      return;
    }
    if (!propertyId) {
      const msg = "Please provide a property ID";
      setSubmitError(msg);
      console.warn("[Promotions] submit blocked", msg);
      return;
    }
    try {
      setErrorMsg(null);
      setSubmitting(true);
      log("submit started", { propertyId, weeks });
      const up = await uploadToWasabi(file);
      log("upload done", up);
      // fetch a fresh access token at submit time
      const { data: sess } = await supabase.auth.getSession();
      const token = sess?.session?.access_token || null;

      const res = await fetchWithTimeout("/api/admin/promotions/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ propertyId, propertyTitle: propertyTitle || undefined, weeks, screenshotUrl: up.url }),
        timeoutMs: 15000,
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      log("submit ok", json);
      alert("Promotion request submitted");
      setFile(null);
      setWeeks(1);
      setPropertyTitle("");
      await loadList();
    } catch (e: any) {
      console.error("[Promotions] submit error", e);
      setErrorMsg(String(e?.message || e));
      // best-effort retry
      setTimeout(() => retryNow(), 2000);
    } finally {
      setSubmitting(false);
    }
  }

  async function fetchFirstAvailable(table: string, filter?: (q: any) => any) {
    let q: any = supabase.from(table).select("*").order("created_at", { ascending: false }).limit(50);
    if (filter) q = filter(q);
    const { data, error } = await q;
    if (error) throw error;
    return data as PromotionRow[];
  }

  async function loadList() {
    try {
      setLoadingList(true);
      setErrorMsg(null);
      // Try common tables in order. Last one (payment_requests) filters type=promotion
      const tries: Array<() => Promise<PromotionRow[]>> = [
        () => fetchFirstAvailable("promotions", (q) => user?.uid ? q.eq("agent_id", user.uid) : q),
        () => fetchFirstAvailable("promotion_requests", (q) => user?.uid ? q.eq("user_id", user.uid) : q),
        () => fetchFirstAvailable("payment_requests", (q) => (user?.uid ? q.eq("user_id", user.uid) : q).eq("type", "promotion")),
      ];
      for (const t of tries) {
        try {
          const result = await t();
          setRows(result || []);
          return;
        } catch (_) {}
      }
      setRows([]);
    } catch (e) {
      console.error("[Promotions] list load error", e);
      setErrorMsg(String((e as any)?.message || e));
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    loadList();
  }, [retryTick, user?.uid]);

  const canSubmit = useMemo(() => !!file && !!propertyId && !submitting, [file, propertyId, submitting]);

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Promotions</h1>

      <div className="border rounded-md p-4 space-y-3">
        <h2 className="font-semibold">Submit Promotion Request</h2>
        <div className="grid gap-3">
          <label className="grid gap-1">
            <span className="text-sm">Property ID</span>
            <input className="border rounded p-2" value={propertyId} onChange={(e) => setPropertyId(e.target.value)} placeholder="b1c54d88-..." />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Property Title (optional)</span>
            <input className="border rounded p-2" value={propertyTitle} onChange={(e) => setPropertyTitle(e.target.value)} placeholder="Nice 2-bed in Nairobi" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Weeks</span>
            <input type="number" min={1} max={52} className="border rounded p-2 w-32" value={weeks} onChange={(e) => setWeeks(Math.max(1, Math.min(52, Number(e.target.value) || 1)))} />
          </label>
         <label className="grid gap-1">
           <span className="text-sm">Screenshot</span>
           <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
         </label>
          {submitError && (
            <div className="text-sm text-destructive">{submitError}</div>
          )}
          <button
            type="button"
            onClick={submitPromotion}
            aria-disabled={!canSubmit}
            className={`inline-flex items-center justify-center rounded bg-primary px-3 py-2 text-white transition ${!canSubmit ? "opacity-60" : ""}`}
          >
            {submitting ? "Submitting..." : "Submit for Approval"}
          </button>
        </div>
      </div>

      <div className="border rounded-md p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Recent Promotion Requests</h2>
          <button onClick={loadList} className="text-sm underline">Reload now</button>
        </div>
        {errorMsg ? (
          <div className="text-sm text-destructive">{errorMsg}</div>
        ) : loadingList ? (
          <div className="text-sm text-muted-foreground">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="text-sm text-muted-foreground">No promotion requests yet.</div>
        ) : (
          <ul className="space-y-2">
            {rows.map((r) => (
              <li key={r.id} className="border rounded p-2">
                <div className="text-sm">Property: {r.property_title || r.property_id}</div>
                <div className="text-xs text-muted-foreground">Status: {r.status || "pending"} • Weeks: {r.weeks ?? 1}</div>
                {r.screenshot_url ? (
                  <a className="text-xs underline" href={r.screenshot_url} target="_blank">screenshot</a>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

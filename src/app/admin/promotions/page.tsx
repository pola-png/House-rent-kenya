"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth-supabase";
import { supabase } from "@/lib/supabase";

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

  async function presignWasabi(key: string, contentType: string, contentLength: number) {
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, contentType, contentLength }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json() as Promise<{ url: string }>;
  }

  async function uploadToWasabi(file: File) {
    const ext = file.name.split(".").pop() || "jpg";
    const key = `promotions/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { url } = await presignWasabi(key, file.type || "image/jpeg", file.size);
    const put = await fetch(url, { method: "PUT", body: file, headers: { "Content-Type": file.type || "application/octet-stream" } });
    if (!put.ok) throw new Error(`Wasabi PUT failed: ${put.status}`);
    const publicUrl = url.split("?")[0];
    return { key, url: publicUrl };
  }

  async function submitPromotion() {
    if (!file) {
      alert("Please attach a screenshot");
      return;
    }
    if (!propertyId) {
      alert("Please provide a property ID");
      return;
    }
    try {
      setSubmitting(true);
      const up = await uploadToWasabi(file);
      // fetch a fresh access token at submit time
      const { data: sess } = await supabase.auth.getSession();
      const token = sess?.session?.access_token || null;

      const res = await fetch("/api/admin/promotions/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ propertyId, propertyTitle: propertyTitle || undefined, weeks, screenshotUrl: up.url }),
      });
      if (!res.ok) throw new Error(await res.text());
      await res.json();
      alert("Promotion request submitted");
      setFile(null);
      setWeeks(1);
      setPropertyTitle("");
      await loadList();
    } catch (e: any) {
      console.error("[Promotions] submit error", e);
      alert("Failed to submit promotion: " + (e?.message || e));
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
      // Try common tables in order. Last one (payment_requests) filters type=promotion
      const tries: Array<() => Promise<PromotionRow[]>> = [
        () => fetchFirstAvailable("promotions"),
        () => fetchFirstAvailable("promotion_requests"),
        () => fetchFirstAvailable("payment_requests", (q) => q.eq("type", "promotion")),
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
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    loadList();
  }, []);

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
          <button disabled={!canSubmit} onClick={submitPromotion} className="inline-flex items-center justify-center rounded bg-primary px-3 py-2 text-white disabled:opacity-50">
            {submitting ? "Submitting..." : "Submit for Approval"}
          </button>
        </div>
      </div>

      <div className="border rounded-md p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Recent Promotion Requests</h2>
          <button onClick={loadList} className="text-sm underline">Reload now</button>
        </div>
        {loadingList ? (
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

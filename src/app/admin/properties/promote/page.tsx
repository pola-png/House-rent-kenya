'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth-supabase';
import { supabase } from '@/lib/supabase';
import { useEffect, useMemo, useState } from 'react';
import { useAutoRetry } from '@/hooks/use-auto-retry';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Upload, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface PromotionRow {
  id: string;
  property_id?: string;
  propertyId?: string;
  property_title?: string;
  propertyTitle?: string;
  status?: string;
  weeks?: number;
  screenshot_url?: string;
  screenshotUrl?: string;
  created_at?: string;
  createdAt?: string;
}

export default function MergedPromotionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const propertyIdParam = searchParams.get('propertyId');

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(!!propertyIdParam);
  const [promotionWeeks, setPromotionWeeks] = useState(1);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rows, setRows] = useState<PromotionRow[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [retryTick, retryNow] = useAutoRetry(loadingList || isSubmitting || !user, [user]);

  const weeklyRate = 5;

  function log(...args: any[]) {
    console.log('[MergedPromotion]', ...args);
  }

  // Fetch property if propertyId is in URL
  useEffect(() => {
    if (propertyIdParam && user) {
      fetchProperty();
    }
  }, [propertyIdParam, user]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyIdParam)
        .eq('landlordId', user?.uid)
        .single();

      if (error) throw error;
      setProperty(data);
    } catch (error) {
      console.error('Error fetching property:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Property not found' });
    } finally {
      setLoading(false);
    }
  };

  const handleScreenshotChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setScreenshotFile(file);
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  async function presignWasabi(key: string, contentType: string, contentLength: number) {
    log('presign start', { key, contentType, contentLength });
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, contentType, contentLength }),
    });
    if (!res.ok) throw new Error(await res.text());
    const data = (await res.json()) as { url: string };
    log('presign ok', { key });
    return data;
  }

  async function uploadToWasabi(file: File) {
    const ext = file.name.split('.').pop() || 'jpg';
    const key = `promotions/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { url } = await presignWasabi(key, file.type || 'image/jpeg', file.size);
    log('wasabi PUT start', { key });
    const put = await fetch(url, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type || 'application/octet-stream' },
    });
    if (!put.ok) throw new Error(`Wasabi PUT failed: ${put.status}`);
    log('wasabi PUT success', { key, status: put.status });
    const publicUrl = url.split('?')[0];
    return { key, url: publicUrl };
  }

  async function fetchWithTimeout(
    input: RequestInfo | URL,
    init: RequestInit & { timeoutMs?: number } = {}
  ) {
    const { timeoutMs = 15000, ...rest } = init;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      // @ts-ignore
      const res: Response = await fetch(input, { ...rest, signal: controller.signal });
      return res;
    } finally {
      clearTimeout(id);
    }
  }

  async function submitPromotion() {
    log('submit triggered', { propertyIdParam, hasFile: !!screenshotFile, weeks: promotionWeeks });
    setSubmitError(null);

    if (!screenshotFile) {
      const msg = 'Please attach a screenshot';
      setSubmitError(msg);
      console.warn('[MergedPromotion] submit blocked', msg);
      return;
    }

    if (!propertyIdParam && !property?.id) {
      const msg = 'Please provide a property ID';
      setSubmitError(msg);
      console.warn('[MergedPromotion] submit blocked', msg);
      return;
    }

    try {
      setErrorMsg(null);
      setIsSubmitting(true);
      log('submit started', { propertyId: propertyIdParam || property?.id, weeks: promotionWeeks });

      const up = await uploadToWasabi(screenshotFile);
      log('upload done', up);

      const { data: sess } = await supabase.auth.getSession();
      const token = sess?.session?.access_token || null;

      const res = await fetchWithTimeout('/api/admin/promotions/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          propertyId: propertyIdParam || property?.id,
          propertyTitle: property?.title || undefined,
          weeks: promotionWeeks,
          screenshotUrl: up.url,
        }),
        timeoutMs: 15000,
      });

      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      log('submit ok', json);

      toast({ title: 'Success', description: 'Promotion request submitted for approval' });
      setScreenshotFile(null);
      setScreenshotPreview(null);
      setPromotionWeeks(1);

      await loadList();

      // Redirect back to properties after 2 seconds
      setTimeout(() => {
        router.push('/admin/properties');
      }, 2000);
    } catch (e: any) {
      console.error('[MergedPromotion] submit error', e);
      setSubmitError(String(e?.message || e));
      setTimeout(() => retryNow(), 2000);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function fetchFirstAvailable(table: string, filter?: (q: any) => any) {
    let q: any = supabase.from(table).select('*').order('created_at', { ascending: false }).limit(50);
    if (filter) q = filter(q);
    const { data, error } = await q;
    if (error) throw error;
    return data as PromotionRow[];
  }

  async function loadList() {
    try {
      setLoadingList(true);
      setErrorMsg(null);

      const tries: Array<() => Promise<PromotionRow[]>> = [
        () => fetchFirstAvailable('promotions', (q) => (user?.uid ? q.eq('agent_id', user.uid) : q)),
        () => fetchFirstAvailable('promotion_requests', (q) => (user?.uid ? q.eq('user_id', user.uid) : q)),
        () =>
          fetchFirstAvailable('payment_requests', (q) =>
            (user?.uid ? q.eq('user_id', user.uid) : q).eq('type', 'promotion')
          ),
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
      console.error('[MergedPromotion] list load error', e);
      setErrorMsg(String((e as any)?.message || e));
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    loadList();
  }, [retryTick, user?.uid]);

  const canSubmit = useMemo(() => !!screenshotFile && !!propertyIdParam && !isSubmitting, [
    screenshotFile,
    propertyIdParam,
    isSubmitting,
  ]);

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <Button variant="ghost" asChild>
        <Link href="/admin/properties">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Properties
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Promotion Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Promote Property</CardTitle>
              <CardDescription>Boost your property's visibility with featured placement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {propertyIdParam && loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : property ? (
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">{property.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {property.location}, {property.city}
                  </p>
                </div>
              ) : propertyIdParam ? (
                <div className="p-4 bg-red-100 rounded-lg">
                  <p className="text-sm">Property not found</p>
                </div>
              ) : null}

              <div>
                <Label htmlFor="weeks">Number of Weeks</Label>
                <div className="flex items-center space-x-4 mt-2">
                  <Input
                    type="range"
                    id="weeks"
                    min="1"
                    max="12"
                    value={promotionWeeks}
                    onChange={(e) => setPromotionWeeks(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-lg font-semibold w-10">{promotionWeeks}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  ${weeklyRate} per week • Total: ${(promotionWeeks * weeklyRate).toFixed(2)}
                </p>
              </div>

              <div>
                <Label htmlFor="screenshot">Screenshot</Label>
                <div className="mt-2 flex items-center space-x-4">
                  <Input
                    id="screenshot"
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotChange}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('screenshot')?.click()}
                    disabled={isSubmitting}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Screenshot
                  </Button>
                  {screenshotPreview && (
                    <Image
                      src={screenshotPreview}
                      alt="Screenshot preview"
                      width={100}
                      height={100}
                      className="rounded-md border object-cover"
                    />
                  )}
                </div>
                {submitError && (
                  <p className="mt-2 text-sm text-red-600">{submitError}</p>
                )}
              </div>

              <Button
                onClick={submitPromotion}
                disabled={!canSubmit || isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Promotion'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Promotion History */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Promotion History</CardTitle>
              <CardDescription>Your recent promotion requests</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingList ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : errorMsg ? (
                <div className="py-4 text-center text-red-600">{errorMsg}</div>
              ) : rows.length > 0 ? (
                <div className="space-y-4">
                  {rows.map((row) => (
                    <div key={row.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">
                            {row.property_title || row.propertyTitle || 'Untitled Property'}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {row.weeks} week{row.weeks !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          row.status === 'approved' ? 'bg-green-100 text-green-800' :
                          row.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {row.status || 'unknown'}
                        </span>
                      </div>
                      {row.screenshot_url || row.screenshotUrl ? (
                        <div className="mt-2">
                          <Image
                            src={row.screenshot_url || row.screenshotUrl}
                            alt="Promotion screenshot"
                            width={100}
                            height={100}
                            className="rounded-md border object-cover"
                          />
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center text-muted-foreground">
                  No promotions found
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
